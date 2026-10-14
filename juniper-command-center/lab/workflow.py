"""Synthetic CRM workflow with deterministic policy boundaries and durable local audit events."""
from __future__ import annotations
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
import json, re, sqlite3, uuid
from pathlib import Path
from .engine import DATA, demo_schedule, scenario_assumptions

CATEGORIES=('urgent','repeat_service','technician_absence','scheduling','data_quality','inventory','equipment','specialty','delay','other')
PRIORITIES=('critical','high','normal')
ROLE_PERMISSIONS={'viewer':set(),'dispatcher':{'propose'},'manager':{'propose','approve','reject','execute'}}

@dataclass(frozen=True)
class Interpretation:
    incident_id:str
    category:str
    priority:str
    requested_outcome:str
    relevant_constraints:list[str]
    required_qualifications:list[str]
    proposed_next_owner:str
    action_type:str
    evidence_reference:str
    missing_information:list[str]
    review_required:bool=True
    model_version:str='deterministic-replay-1'
    execution_mode:str='DETERMINISTIC_REPLAY_NOT_LLM'

def interpret(note:str, incident_id:str)->Interpretation:
    """Rules are for safe, transparent replay. They are not an LLM or model accuracy claim."""
    if not 3<=len(note)<=1500: raise ValueError('note must contain 3..1500 characters')
    s=note.lower()
    priority='critical' if any(w in s for w in ('urgent','safety','emergency','hazard')) else ('high' if any(w in s for w in ('complaint','missed','absence','late')) else 'normal')
    patterns=[('technician_absence',r'absen|sick|call.?out'),('inventory',r'stock|inventory|material|kit'),('data_quality',r'wrong address|incorrect|duplicate|missing customer|crm'),('scheduling',r'conflict|reschedul|appointment'),('repeat_service',r'repeat|complaint|rework'),('equipment',r'equipment|truck|pump'),('specialty',r'certif|specialist'),('delay',r'late|delay|missed'),('urgent',r'urgent|emergency')]
    category=next((n for n,p in patterns if re.search(p,s)),'other')
    suspicious=bool(re.search(r'ignore (previous|all) instructions|system prompt|bypass approval|override policy|developer message',s))
    missing=[]
    if not re.search(r'\b(wo-\d+|job-\d+|appointment\s*#?\d+)\b',s):missing.append('Service order identifier')
    if category=='other':missing.append('Unambiguous incident category')
    if suspicious:missing.append('Untrusted embedded instructions require independent review')
    required=['specialty'] if category=='specialty' else []
    owner='service_manager' if priority=='critical' or suspicious else 'dispatch'
    action='REVIEW_ONLY' if suspicious or category in ('other','data_quality') else 'PROPOSE_RESCHEDULE'
    return Interpretation(incident_id,category,priority,'Restore feasible service and document customer follow-up', ['qualification','appointment window','hours','inventory','approved customer change'], required, owner, action,'submitted_synthetic_note',missing)

class WorkflowStore:
    def __init__(self,db_path:str|Path):
        self.path=str(db_path)
        self.init()
    def connect(self):
        conn=sqlite3.connect(self.path,timeout=8, isolation_level=None)
        conn.row_factory=sqlite3.Row
        conn.execute('PRAGMA foreign_keys=ON')
        return conn
    def init(self):
        with self.connect() as db:
            db.execute('CREATE TABLE IF NOT EXISTS incidents (id TEXT PRIMARY KEY, note TEXT NOT NULL, category TEXT NOT NULL, priority TEXT NOT NULL, state TEXT NOT NULL, version INTEGER NOT NULL, suggestion TEXT NOT NULL, created TEXT NOT NULL, updated TEXT NOT NULL)')
            db.execute('CREATE TABLE IF NOT EXISTS audit (id INTEGER PRIMARY KEY AUTOINCREMENT, incident_id TEXT NOT NULL, actor_role TEXT NOT NULL, action TEXT NOT NULL, before_state TEXT, after_state TEXT NOT NULL, time TEXT NOT NULL, details TEXT NOT NULL, FOREIGN KEY(incident_id) REFERENCES incidents(id))')
    @staticmethod
    def time():return datetime.now(timezone.utc).isoformat()
    def create(self,note:str,actor_role:str='dispatcher',incident_id:str|None=None):
        if actor_role not in ROLE_PERMISSIONS or 'propose' not in ROLE_PERMISSIONS[actor_role]: raise PermissionError('role cannot propose incidents')
        incident_id=incident_id or str(uuid.uuid4())
        suggestion=asdict(interpret(note,incident_id));now=self.time()
        with self.connect() as db:
            db.execute('BEGIN IMMEDIATE')
            old=db.execute('SELECT id FROM incidents WHERE id=?',(incident_id,)).fetchone()
            if old: db.execute('ROLLBACK');raise ValueError('duplicate incident idempotency key')
            db.execute('INSERT INTO incidents VALUES(?,?,?,?,?,?,?, ?,?)',(incident_id,note,suggestion['category'],suggestion['priority'],'Pending Review',1,json.dumps(suggestion),now,now))
            db.execute('INSERT INTO audit(incident_id,actor_role,action,before_state,after_state,time,details) VALUES(?,?,?,?,?,?,?)',(incident_id,actor_role,'propose',None,'Pending Review',now,json.dumps({'mode':suggestion['execution_mode']})))
            db.commit()
        return self.get(incident_id)
    def get(self,incident_id):
        with self.connect() as db:
            row=db.execute('SELECT * FROM incidents WHERE id=?',(incident_id,)).fetchone()
            if not row:raise KeyError('incident not found')
            d=dict(row);d['suggestion']=json.loads(d['suggestion']);return d
    def transition(self,incident_id:str,action:str,actor_role:str,expected_version:int, *,data_quality:float=.985):
        if action not in ('approve','reject','execute','resolve'):raise ValueError('unknown transition')
        if actor_role not in ROLE_PERMISSIONS or action not in ROLE_PERMISSIONS[actor_role] and action!='resolve': raise PermissionError('action forbidden for role')
        if action=='resolve' and actor_role!='manager':raise PermissionError('manager required')
        rule={'approve':('Pending Review','Approved'),'reject':('Pending Review','Rejected'),'execute':('Approved','Executed'),'resolve':('Executed','Resolved')}
        src,dest=rule[action];now=self.time()
        with self.connect() as db:
            db.execute('BEGIN IMMEDIATE')
            row=db.execute('SELECT * FROM incidents WHERE id=?',(incident_id,)).fetchone()
            if not row:db.execute('ROLLBACK');raise KeyError('incident not found')
            if row['version']!=expected_version:db.execute('ROLLBACK');raise ValueError('stale version; reload before action')
            if row['state']!=src:db.execute('ROLLBACK');raise ValueError(f'invalid state transition from {row["state"]}')
            suggestion=json.loads(row['suggestion'])
            if action=='execute':
                if data_quality<.95: db.execute('ROLLBACK');raise ValueError('CRM data integrity gate blocks simulated write')
                if suggestion['missing_information']:db.execute('ROLLBACK');raise ValueError('missing information blocks simulated write')
                if suggestion['action_type']!='PROPOSE_RESCHEDULE':db.execute('ROLLBACK');raise ValueError('this category cannot execute a scheduling action')
                if demo_schedule(scenario_assumptions())['jobs_assigned']<1:db.execute('ROLLBACK');raise ValueError('no feasible scheduling alternative')
            if action=='resolve' and suggestion['missing_information']:db.execute('ROLLBACK');raise ValueError('completion evidence missing')
            db.execute('UPDATE incidents SET state=?,version=version+1,updated=? WHERE id=?',(dest,now,incident_id))
            db.execute('INSERT INTO audit(incident_id,actor_role,action,before_state,after_state,time,details) VALUES(?,?,?,?,?,?,?)',(incident_id,actor_role,action,src,dest,now,json.dumps({'simulated_only':True})))
            db.commit()
        return self.get(incident_id)
    def audit(self,incident_id:str):
        with self.connect() as db:return [dict(x) for x in db.execute('SELECT * FROM audit WHERE incident_id=? ORDER BY id',(incident_id,)).fetchall()]
    def reset(self):
        with self.connect() as db:
            db.execute('DELETE FROM audit');db.execute('DELETE FROM incidents')
