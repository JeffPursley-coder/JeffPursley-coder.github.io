"""Juniper Vale synthetic operating model. Every value is illustrative, not a client result."""
from __future__ import annotations
from dataclasses import dataclass, asdict
from datetime import date, timedelta
import itertools, math, random, statistics
from typing import Any

SEED = 20261014
START = date(2026, 10, 1)
BRANCH_NAMES = ('North Atlanta','Woodstock','Marietta','Roswell','Alpharetta','Canton','Sandy Springs','Kennesaw')
SERVICE_TYPES = {
    'standard': {'fee': 145.0, 'minutes': 64, 'material': 11.0, 'skill': 'general'},
    'commercial': {'fee': 255.0, 'minutes': 90, 'material': 24.0, 'skill': 'commercial'},
    'specialty': {'fee': 345.0, 'minutes': 118, 'material': 43.0, 'skill': 'specialty'},
}
LABOR_RATE = 27.5  # fully burdened dollar/hour, synthetic
TRAVEL_COST_PER_MIN = 0.26
FIXED_DAILY_PER_BRANCH = 850.0
BASE_WEEKS = 3

@dataclass(frozen=True)
class Assumptions:
    scenario: str = 'baseline'
    available_delta: int = 0  # total technicians from 60
    demand_multiplier: float = 1.0
    wage_multiplier: float = 1.0
    price_multiplier: float = 1.0
    travel_multiplier: float = 1.0
    overtime_minutes: int = 0
    data_quality: float = 0.985
    funding_multiplier: float = 1.0
    seed: int = SEED

    def __post_init__(self):
        if self.available_delta < -55 or self.available_delta > 30: raise ValueError('technician change outside 5..90 range')
        for n in ('demand_multiplier','wage_multiplier','price_multiplier','travel_multiplier','funding_multiplier'):
            if not 0.2 <= getattr(self,n) <= 3.0: raise ValueError(n+' outside supported range')
        if not 0 <= self.data_quality <= 1: raise ValueError('data_quality outside 0..1')
        if not 0 <= self.overtime_minutes <= 240: raise ValueError('overtime beyond authorized max')

SCENARIOS = {
 'baseline': {},
 'technician-shortage': {'available_delta': -15},
 'crm-data-failure': {'data_quality': .88},
 'demand-surge': {'demand_multiplier': 1.32},
}

def scenario_assumptions(scenario: str = 'baseline', **updates: Any) -> Assumptions:
    if scenario not in SCENARIOS: raise ValueError('unknown scenario')
    return Assumptions(**{'scenario': scenario, **SCENARIOS[scenario], **updates})

def generate(seed: int = SEED) -> dict:
    """One fixed-seed, internally linked modeled work-order history for 15 weekdays."""
    rng = random.Random(seed)
    branches = [{'id':f'B{i+1:02}','name':n,'fixed_daily':FIXED_DAILY_PER_BRANCH} for i,n in enumerate(BRANCH_NAMES)]
    technicians=[]
    for i in range(60):
        b = branches[i % 8]
        technicians.append({'id':f'T{i+1:03}','branch_id':b['id'],'skills':['general']+(['commercial'] if i%3!=0 else [])+(['specialty'] if i%5==0 else []), 'shift_minutes':480,'hourly_burden':LABOR_RATE})
    customers=[{'id':f'C{i+1:05}','branch_id':branches[i%8]['id'],'contract_id':f'K{i+1:05}','active':i%19!=0} for i in range(1200)]
    orders=[]; invoices=[]; calendar=[]
    d=START
    while len(calendar)<15:
        if d.weekday()<5: calendar.append(d.isoformat())
        d+=timedelta(days=1)
    for day_index,ds in enumerate(calendar):
        volume=300 if day_index==9 else (226+int(22*math.sin(day_index*1.7)))
        for j in range(volume):
            cust=customers[rng.randrange(len(customers))]
            service=rng.choices(list(SERVICE_TYPES),weights=[72,21,7])[0]; cfg=SERVICE_TYPES[service]
            duration=max(30,round(rng.gauss(cfg['minutes'],12)))
            travel=rng.randint(8,35)
            is_complete = rng.random() > (.055 if day_index!=9 else .105)
            quality=rng.random()>.037
            ontime=rng.random()>.115
            price=round(cfg['fee']*(1+rng.uniform(-.07,.07)),2)
            oid=f'WO-{day_index+1:02}-{j+1:04}'
            row={'id':oid,'customer_id':cust['id'],'branch_id':cust['branch_id'],'date':ds,'service_type':service,'minutes':duration,'travel_minutes':travel,'completed':is_complete,'on_time':ontime if is_complete else False,'rework':not quality if is_complete else False,'window_start':8+(j%8),'window_end':10+(j%8),'revenue':price if is_complete else 0.0,'material_cost':cfg['material'] if is_complete else 0.0}
            orders.append(row)
            if is_complete: invoices.append({'invoice_id':'INV-'+oid,'order_id':oid,'amount':price,'paid':rng.random()>.07})
    check_data({'branches':branches,'technicians':technicians,'customers':customers,'orders':orders,'invoices':invoices})
    return {'version':'2026.10.v1','seed':seed,'days':calendar,'branches':branches,'technicians':technicians,'customers':customers,'orders':orders,'invoices':invoices,'service_types':SERVICE_TYPES}

def check_data(data:dict)->None:
    def uniques(name,key):
        vals=[x[key] for x in data[name]]
        if len(set(vals))!=len(vals): raise ValueError('duplicate '+name+' identifier')
        return set(vals)
    bs=uniques('branches','id');ts=uniques('technicians','id');cs=uniques('customers','id');os=uniques('orders','id');uniques('invoices','invoice_id')
    for t in data['technicians']:
        if t['branch_id'] not in bs or t['shift_minutes']<=0: raise ValueError('invalid technician')
    for c in data['customers']:
        if c['branch_id'] not in bs: raise ValueError('invalid customer')
    for o in data['orders']:
        if o['customer_id'] not in cs or o['branch_id'] not in bs or o['minutes']<=0 or o['window_end']<=o['window_start'] or o['revenue']<0:raise ValueError('invalid work order')
    for inv in data['invoices']:
        if inv['order_id'] not in os or inv['amount']<0: raise ValueError('invalid invoice')

DATA=generate()

def operations(data:dict = DATA, a:Assumptions|None=None, branch:str|None=None, service:str|None=None)->dict:
    """Contribution is revenue minus labor, travel, materials. Operating profit less fixed branch expense.
       Fixed operating expense is for complete dataset dates. Projections assume fixed is unchanged.
    """
    a=a or scenario_assumptions()
    # Consolidate branch P&Ls rather than independently rounding company-wide completed jobs.
    # This guarantees the company statement reconciles to its eight branch statements.
    if branch is None:
        parts=[operations(data,a,b['id'],service) for b in data['branches']]
        sum_fields=('baseline_orders','requested','eligible','completed','unfulfilled','technicians',
                    'capacity_minutes','revenue','direct_cost','contribution','fixed_operating_cost','operating_profit')
        total={k:sum(p[k] for p in parts) for k in sum_fields}
        rev=total['revenue']; completed=total['completed']; cap=total['capacity_minutes']
        total.update({'scenario':a.scenario,'branch':'all','service':service or 'all',
          'working_days':len(data['days']),
          'utilization':round(sum(p['utilization']*p['capacity_minutes'] for p in parts)/cap,4) if cap else 0,
          'on_time_rate':round(sum(p['on_time_rate']*p['completed'] for p in parts)/max(1,completed),4),
          'rework_rate':round(sum(p['rework_rate']*p['completed'] for p in parts)/max(1,completed),4),
          'contribution_margin':round(total['contribution']/rev,4) if rev else 0,
          'cost_per_completed_service':round(total['direct_cost']/max(1,completed),2),
          'revenue_per_completed_service':round(rev/max(1,completed),2),
          'travel_minutes_per_service':round(sum(p['travel_minutes_per_service']*p['completed'] for p in parts)/max(1,completed),1),
          'assumptions':asdict(a)})
        return total
    if branch and branch not in {b['id'] for b in data['branches']}:raise ValueError('unknown branch')
    if service and service not in SERVICE_TYPES: raise ValueError('unknown service')
    rows=[x for x in data['orders'] if (not branch or x['branch_id']==branch) and (not service or x['service_type']==service)]
    branch_ids={x['branch_id'] for x in rows} if not branch else {branch}
    techs=[t for t in data['technicians'] if not branch or t['branch_id']==branch]
    # Demand is increased or decreased against the identical workload baseline.
    request_count=round(len(rows)*a.demand_multiplier)
    available_techs=max(0,round(len(techs)+(a.available_delta*(len(techs)/60))))
    capacity_minutes=available_techs*(480+a.overtime_minutes)*len(data['days'])
    avg_job_minutes=statistics.mean((x['minutes']+x['travel_minutes']*a.travel_multiplier for x in rows)) if rows else 1
    feasible_count=min(request_count,max(0,int(capacity_minutes//avg_job_minutes)))
    # Data with missing eligibility is blocked, not counted as executable.
    eligible_count=int(feasible_count*a.data_quality)
    completed_rate=sum(x['completed'] for x in rows)/len(rows) if rows else 0
    completed_count=int(eligible_count*completed_rate)
    typical_complete=[x for x in rows if x['completed']]
    rev_per=sum(x['revenue'] for x in typical_complete)/len(typical_complete) if typical_complete else 0
    material_per=sum(x['material_cost'] for x in typical_complete)/len(typical_complete) if typical_complete else 0
    labor_per=sum(x['minutes'] for x in rows)/max(1,len(rows))/60*LABOR_RATE*a.wage_multiplier
    travel_per=sum(x['travel_minutes'] for x in rows)/max(1,len(rows))*a.travel_multiplier*TRAVEL_COST_PER_MIN
    revenue=round(completed_count*rev_per*a.price_multiplier,2)
    direct=round(completed_count*(material_per+labor_per+travel_per),2)
    contribution=round(revenue-direct,2)
    fixed=round(len(branch_ids)*len(data['days'])*FIXED_DAILY_PER_BRANCH,2)
    profit=round(contribution-fixed,2)
    ontime=sum(x['on_time'] for x in rows if x['completed'])/max(1,len(typical_complete))
    rework=sum(x['rework'] for x in typical_complete)/max(1,len(typical_complete))
    denom=capacity_minutes or 1
    used_minutes=completed_count*avg_job_minutes
    return {'scenario':a.scenario,'branch':branch or 'all','service':service or 'all','working_days':len(data['days']),'baseline_orders':len(rows),'requested':request_count,'eligible':eligible_count,'completed':completed_count,'unfulfilled':max(0,request_count-completed_count),'technicians':available_techs,'capacity_minutes':capacity_minutes,'utilization':round(min(1,used_minutes/denom),4),'on_time_rate':round(ontime*(1-.30*max(0,used_minutes/denom-.78)),4),'rework_rate':round(rework,4),'revenue':revenue,'direct_cost':direct,'contribution':contribution,'contribution_margin':round(contribution/revenue,4) if revenue else 0,'fixed_operating_cost':fixed,'operating_profit':profit,'cost_per_completed_service':round(direct/max(1,completed_count),2),'revenue_per_completed_service':round(revenue/max(1,completed_count),2),'travel_minutes_per_service':round(avg_job_minutes-labor_per*60/(LABOR_RATE*a.wage_multiplier),1),'assumptions':asdict(a)}

def branch_comparison(a:Assumptions|None=None)->list[dict]:
    return [dict(branch_name=b['name'],**operations(DATA,a,b['id'])) for b in DATA['branches']]

# Intentionally small exact assignment engine. Enumerates candidate assignments and rejects violating
# technician skill, appointment window, shift, inventory and travel. Not a full VRPTW solver.
def assign_jobs(jobs:list[dict], technicians:list[dict], *, inventory:dict|None=None, max_nodes:int=200000)->dict:
    if len(jobs)>11 or len(technicians)>10:raise ValueError('interactive exact subset: <=11 jobs and <=10 technicians')
    inventory=inventory or {}
    if len(set(j['id'] for j in jobs))!=len(jobs):raise ValueError('duplicate job id')
    if len(set(t['id'] for t in technicians))!=len(technicians):raise ValueError('duplicate technician id')
    candidates={}
    for j in jobs:
        opts=[]
        for t in technicians:
            if j['skill'] not in t['skills']:continue
            if j.get('inventory_item') and inventory.get(j['inventory_item'],0)<=0:continue
            travel=j.get('travel_minutes',15)
            start=max(j['start'],t.get('start',480)+travel)
            end=start+j['minutes']
            if end<=j['end'] and end<=t.get('end',960):opts.append((t['id'],start,end,travel))
        candidates[j['id']]=opts
    ordered=sorted(jobs,key=lambda j:(-j.get('priority',1),len(candidates[j['id']])))
    best={'served':-1,'cost':float('inf'),'assignments':[]}
    nodes=0;cutoff=False
    def backtrack(i, assigned, by_tech, inv_used, served, cost):
        nonlocal nodes,cutoff,best
        nodes+=1
        if nodes>max_nodes:cutoff=True;return
        if served+len(ordered)-i<best['served']:return
        if i==len(ordered):
            if served>best['served'] or (served==best['served'] and cost<best['cost']):best.update(served=served,cost=cost,assignments=assigned[:])
            return
        j=ordered[i]
        for tech,start,end,travel in candidates[j['id']]:
            if any(not (end<=s or start>=e) for s,e in by_tech.get(tech,[])):continue
            item=j.get('inventory_item')
            if item and inv_used.get(item,0)>=inventory[item]:continue
            by_tech.setdefault(tech,[]).append((start,end))
            if item:inv_used[item]=inv_used.get(item,0)+1
            assigned.append({'job_id':j['id'],'technician_id':tech,'start':start,'end':end,'travel_minutes':travel})
            backtrack(i+1,assigned,by_tech,inv_used,served+1,cost+travel)
            assigned.pop();by_tech[tech].pop()
            if item:inv_used[item]-=1
        backtrack(i+1,assigned,by_tech,inv_used,served,cost)
    backtrack(0,[],{}, {},0,0)
    assigned={x['job_id'] for x in best['assignments']}
    return {'status':'FEASIBLE_UNPROVEN' if cutoff else ('OPTIMAL_WITHIN_SUBSET' if best['served']==len(jobs) else 'BEST_PARTIAL_WITHIN_SUBSET'), 'jobs_total':len(jobs),'jobs_assigned':best['served'],'unassigned':[j['id'] for j in jobs if j['id'] not in assigned],'assignments':best['assignments'],'travel_minutes':best['cost'],'nodes':nodes,'note':'Exact subset enumerator; not a vehicle routing solver. Travel is a static per-job estimate.'}

def demo_schedule(a:Assumptions|None=None)->dict:
    a=a or scenario_assumptions();r=random.Random(SEED)
    jobs=[]
    for i in range(8):
        typ=['general','commercial','specialty'][i%3]
        jobs.append({'id':f'JOB-{i+1}','minutes':r.choice([50,60,80]),'start':480+i//3*130,'end':720+i//3*130,'skill':typ,'priority':3 if i==6 else 1,'travel_minutes':r.randint(10,27),'inventory_item':'kit' if i==6 else None})
    tech=[{'id':f'T-{i+1}','start':480,'end':960+a.overtime_minutes,'skills':['general','commercial','specialty'] if i%3==0 else ['general','commercial'] if i%2==0 else ['general']} for i in range(max(1,min(5,4+round(a.available_delta/8))))]
    return assign_jobs(jobs,tech,inventory={'kit':1 if a.data_quality>=.95 else 0})

PROGRAM = [
 {'id':'CRM','name':'Customer data and CRM modernization','days':16,'cost':52000,'staff':2,'deps':[],'benefit_annual':87000,'mandatory':True},
 {'id':'DISPATCH','name':'Dispatch and capacity optimization','days':22,'cost':75000,'staff':2,'deps':['CRM'],'benefit_annual':168000,'mandatory':False},
 {'id':'AI','name':'AI-assisted service operations','days':18,'cost':46000,'staff':2,'deps':['CRM'],'benefit_annual':66000,'mandatory':False},
 {'id':'ADOPTION','name':'Workforce adoption and controls','days':15,'cost':29000,'staff':1,'deps':['CRM','DISPATCH','AI'],'benefit_annual':55000,'mandatory':True},
]

def schedule_program(initiatives:list[dict]=PROGRAM, technical_staff:int=4, factor:float=1.0, migrate_quality:float=0.985, gate:float=.95)->dict:
    """Deterministic day-level serial resource scheduler; multiple initiatives can share team slots."""
    if technical_staff<1:raise ValueError('no technical capacity')
    ids={p['id'] for p in initiatives};remaining={p['id']:dict(p) for p in initiatives}
    if len(ids)!=len(initiatives):raise ValueError('duplicate project id')
    if any(set(p['deps'])-ids for p in initiatives):raise ValueError('unknown dependency')
    if any(p['staff']>technical_staff for p in initiatives):return {'status':'INFEASIBLE_STAFFING','items':[]}
    schedule={}; days=0
    while remaining and days<1000:
        ready=[p for p in remaining.values() if all(dep in schedule for dep in p['deps'])]
        if not ready: raise ValueError('dependency cycle')
        # capacity check for start-day overlap, schedule by earliest available slot
        p=sorted(ready,key=lambda q:(not q['mandatory'],q['id']))[0]
        earliest=max((schedule[dep]['finish'] for dep in p['deps']),default=0)
        start=earliest
        while any(sum(item['staff'] for item in schedule.values() if item['start']<=d<item['finish'])+p['staff']>technical_staff for d in range(start,start+max(1,round(p['days']*factor)))):start+=1
        finish=start+max(1,round(p['days']*factor))
        schedule[p['id']]={'name':p['name'],'start':start,'finish':finish,'staff':p['staff'],'cost':p['cost'],'depends_on':p['deps']}
        del remaining[p['id']];days=finish
    date_limit=max(v['finish'] for v in schedule.values())
    blocked=migrate_quality<gate
    return {'status':'RELEASE_BLOCKED_DATA_QUALITY' if blocked else 'PLANNED','target_day':50,'finish_day':date_limit,'delay_days':max(0,date_limit-50),'migration_quality':migrate_quality,'release_threshold':gate,'release_approved':not blocked,'items':[{'id':k,**v} for k,v in schedule.items()],'total_investment':sum(x['cost'] for x in initiatives)}

def risk_simulation(samples:int=400,seed:int=SEED,staff:int=4,quality:float=.985)->dict:
    rng=random.Random(seed);finishes=[];costs=[]
    for _ in range(samples):
        varied=[{**p,'days':max(1,round(p['days']*rng.triangular(.82,1.43,1)))} for p in PROGRAM]
        plan=schedule_program(varied,technical_staff=staff,migrate_quality=quality)
        if plan.get('items'):
            finishes.append(plan['finish_day']);costs.append(round(plan['total_investment']*rng.triangular(.96,1.27,1.06)))
    if not finishes:return {'status':'NO_FEASIBLE_PLAN'}
    def pct(x,p):return sorted(x)[max(0,min(len(x)-1,math.ceil(len(x)*p)-1))]
    return {'status':'MODELED','runs':samples,'seed':seed,'p10_finish_day':pct(finishes,.10),'p50_finish_day':pct(finishes,.5),'p90_finish_day':pct(finishes,.9),'probability_by_day_50':round(sum(v<=50 for v in finishes)/samples,3),'p10_cost':pct(costs,.10),'p50_cost':pct(costs,.5),'p90_cost':pct(costs,.9),'distributions':'Independent triangular duration multipliers: min .82, mode 1, max 1.43. Cost multipliers .96, 1.06, 1.27. Correlations not modeled.'}

def investment_case(discount:float=.11,years:int=3,adoption:float=.70,limit:float|None=None)->dict:
    """Shared benefits reduction avoids counting all initiatives at face value."""
    projects=[];aggregate=0
    for p in PROGRAM:
        benefit=p['benefit_annual']*adoption
        # 25% of AI benefit overlaps with CRM/dispatch; 20% of adoption benefit overlaps with others.
        if p['id']=='AI':benefit*=.75
        if p['id']=='ADOPTION':benefit*=.80
        annual=[benefit*(.5 if y==1 else 1) for y in range(1,years+1)]
        npv=-p['cost']+sum(b/((1+discount)**i) for i,b in enumerate(annual,1))
        aggregate+=npv
        projects.append({'id':p['id'],'mandatory':p['mandatory'],'investment':p['cost'],'net_annual_benefit':round(benefit),'npv':round(npv),'simple_payback_years':round(p['cost']/benefit,2) if benefit else None})
    total=sum(p['investment'] for p in projects)
    if limit is None:limit=total
    mandatory=sum(p['investment'] for p in projects if p['mandatory'])
    affordable=limit>=mandatory
    return {'discount':discount,'years':years,'adoption':adoption,'total_investment':total,'funding_limit':limit,'mandatory_cost':mandatory,'mandatory_affordable':affordable,'total_npv_if_all':round(aggregate),'benefits_overlap_adjusted':True,'projects':projects}

def integrated(scenario:str='baseline',**updates)->dict:
    a=scenario_assumptions(scenario,**updates)
    op=operations(DATA,a)
    staffing=2 if a.available_delta<=-8 else 4
    program=schedule_program(technical_staff=staffing,migrate_quality=a.data_quality)
    program['funding']=investment_case(limit=sum(x['cost'] for x in PROGRAM)*a.funding_multiplier)
    opt=demo_schedule(a)
    block=program.get('release_approved') is False
    return {'scenario_id':f'JV-{scenario}-{a.seed}','data_version':DATA['version'],'assumptions':asdict(a),'operations':op,'program':program,'service_command':{'assignment_status':opt['status'],'assignment':opt,'write_blocked':block,'action':'HOLD_FOR_DATA_REMEDIATION' if block else 'REVIEW_OPTIMIZATION','review_required':True},'comparison':{'baseline_profit':operations(DATA,scenario_assumptions())['operating_profit'],'scenario_profit':op['operating_profit']}}
