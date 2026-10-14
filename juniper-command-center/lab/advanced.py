"""Constrained technician assignment and transformation funding analysis.

All input is synthetic. CP-SAT solves time-window scheduling with inter-job travel
on an intentionally tractable operating subset; not a full-company route benchmark.
"""
from __future__ import annotations
from dataclasses import asdict
from itertools import combinations
from time import perf_counter
from .engine import DATA, PROGRAM, SEED, schedule_program


def leg_minutes(a: dict, b: dict) -> int:
    """Synthetic neighborhood travel proxy, not observed road-network travel."""
    return 5 + abs(int(a.get('zone', 0)) - int(b.get('zone', 0))) * 4


def validate_assignments(jobs, technicians, result, inventory=None):
    """Independent hard-constraint audit of a scheduling result."""
    jmap={j['id']: j for j in jobs}
    tmap={t['id']: t for t in technicians}
    inventory=inventory or {}
    used={}
    groups={}
    for a in result['assignments']:
        jid=a['job_id']; tid=a['technician_id']; j=jmap[jid]; t=tmap[tid]
        assert jid not in used, 'job assigned twice'
        used[jid]=tid
        assert j['skill'] in t['skills'], 'unqualified technician'
        assert t.get('branch_id', j.get('branch_id'))==j.get('branch_id',t.get('branch_id')), 'wrong branch'
        assert a['start'] >= j['start'] and a['end'] <= j['end'], 'appointment window'
        assert a['end']-a['start']==j['minutes'], 'wrong duration'
        assert a['start']>=t.get('start',480)+j.get('travel_minutes',0), 'depot travel'
        assert a['end']<=t.get('end',960), 'shift overflow'
        groups.setdefault(tid,[]).append((a,j))
    for tid,entries in groups.items():
        entries.sort(key=lambda x:x[0]['start'])
        for (a,old),(b,new) in zip(entries,entries[1:]):
            assert b['start']>=a['end']+leg_minutes(old,new), 'missing inter-job travel'
    for item,stock in inventory.items():
        assert sum(1 for jid in used if jmap[jid].get('inventory_item')==item)<=stock, 'inventory exhausted'
    assert len(used)+len(result['unassigned'])==len(jobs), 'unreconciled assignments'
    return True


def solve_cp_sat(jobs:list[dict], technicians:list[dict], inventory:dict|None=None,
                 seconds:float=4.0, seed:int=SEED):
    """CP-SAT with optional assignments, disjunctive route-order constraints and penalties.

    The time-dependent road network is not modeled: leg times are deterministic proxies.
    Status OPTIMAL is reported only when CP-SAT proves the bounded model optimum.
    """
    try:
        from ortools.sat.python import cp_model
    except ImportError as e:
        raise RuntimeError('OR-Tools not installed: pip install -r requirements.txt') from e
    if len(jobs)>40 or len(technicians)>12: raise ValueError('subset solver limited to 40 orders and 12 technicians')
    if len({j['id'] for j in jobs}) != len(jobs): raise ValueError('duplicate job id')
    if len({t['id'] for t in technicians}) != len(technicians): raise ValueError('duplicate technician id')
    inventory=inventory or {}
    if any(v<0 for v in inventory.values()):raise ValueError('negative inventory')
    model=cp_model.CpModel()
    starts={};assigned={};served={};valid={}
    for j in jobs:
        jid=j['id']
        if not (0<int(j['minutes'])<=960) or not (0<=j['start']<j['end']<=1440):
            raise ValueError('invalid job duration or time window')
        start=model.NewIntVar(int(j['start']),int(j['end']),'start_'+jid)
        starts[jid]=start
        served[jid]=model.NewBoolVar('served_'+jid)
        choices=[]
        for t in technicians:
            if j['skill'] not in t['skills']:continue
            if t.get('branch_id',j.get('branch_id'))!=j.get('branch_id',t.get('branch_id')):continue
            if j.get('inventory_item') and inventory.get(j['inventory_item'],0)==0:continue
            if max(j['start'],t.get('start',480)+j.get('travel_minutes',0))+j['minutes']>min(j['end'],t.get('end',960)):continue
            v=model.NewBoolVar('assigned_'+jid+'_'+t['id'])
            assigned[(jid,t['id'])]=v
            model.Add(start>=max(j['start'],t.get('start',480)+j.get('travel_minutes',0))).OnlyEnforceIf(v)
            model.Add(start+j['minutes']<=min(j['end'],t.get('end',960))).OnlyEnforceIf(v)
            choices.append(v)
        model.Add(sum(choices)==served[jid])
    for item,stock in inventory.items():
        model.Add(sum(v for (jid,tid),v in assigned.items()
                      if next(j for j in jobs if j['id']==jid).get('inventory_item')==item)<=stock)
    travel_terms=[]
    for t in technicians:
        tid=t['id']
        eligible=[j for j in jobs if (j['id'],tid) in assigned]
        for i,j in combinations(eligible,2):
            x=assigned[(i['id'],tid)];y=assigned[(j['id'],tid)]
            ab=model.NewBoolVar('before_'+i['id']+'_'+j['id']+'_'+tid)
            ba=model.NewBoolVar('before_'+j['id']+'_'+i['id']+'_'+tid)
            model.AddBoolOr([x.Not(),y.Not(),ab,ba])
            model.Add(ab+ba<=1)
            model.Add(starts[j['id']]>=starts[i['id']]+i['minutes']+leg_minutes(i,j)).OnlyEnforceIf([x,y,ab])
            model.Add(starts[i['id']]>=starts[j['id']]+j['minutes']+leg_minutes(j,i)).OnlyEnforceIf([x,y,ba])
            travel_terms.extend((leg_minutes(i,j)*ab, leg_minutes(j,i)*ba))
    # Serving one additional job dominates any possible travel savings.
    objective=sum(int(j.get('priority',1))*10000*served[j['id']] for j in jobs)
    model.Maximize(objective - sum(travel_terms))
    solver=cp_model.CpSolver()
    solver.parameters.max_time_in_seconds=float(seconds)
    solver.parameters.num_search_workers=1
    solver.parameters.random_seed=int(seed%2147483647)
    start_clock=perf_counter()
    status=solver.Solve(model)
    elapsed=round(perf_counter()-start_clock,4)
    state=solver.StatusName(status)
    if status not in (cp_model.OPTIMAL,cp_model.FEASIBLE):
        return {'status':state,'jobs_total':len(jobs),'jobs_assigned':0,
                'unassigned':[j['id'] for j in jobs], 'assignments':[], 'solve_seconds':elapsed,
                'objective':None,'constraints_checked':True}
    out=[]
    for (jid,tid),x in assigned.items():
        if solver.BooleanValue(x):
            j=next(j for j in jobs if j['id']==jid)
            s=solver.Value(starts[jid])
            out.append({'job_id':jid,'technician_id':tid,'start':s,'end':s+j['minutes'],'travel_minutes':j.get('travel_minutes',0)})
    used={a['job_id'] for a in out}
    result={'status':state,'jobs_total':len(jobs),'jobs_assigned':len(out),
            'unassigned':[j['id'] for j in jobs if j['id'] not in used],
            'assignments':sorted(out,key=lambda a:(a['technician_id'],a['start'])),
            'solve_seconds':elapsed,'objective':solver.ObjectiveValue(),
            'best_objective_bound':solver.BestObjectiveBound(),
            'travel_model':'fixed depot legs; inter-job travel uses synthetic zone proxy'}
    validate_assignments(jobs,technicians,result,inventory)
    return result


def greedy_baseline(jobs,technicians, inventory=None):
    inventory=inventory or {}
    stock=dict(inventory)
    routes={t['id']:[] for t in technicians}
    assigned=[]
    for j in sorted(jobs,key=lambda j:(j['start'],-j.get('priority',1),j['id'])):
        candidates=[]
        for t in technicians:
            if j['skill'] not in t['skills']:continue
            if t.get('branch_id',j.get('branch_id'))!=j.get('branch_id',t.get('branch_id')):continue
            if j.get('inventory_item') and stock.get(j['inventory_item'],0)<1:continue
            route=routes[t['id']]
            last_a,last_j=route[-1] if route else (None,None)
            earliest=t.get('start',480)+j.get('travel_minutes',0) if not route else last_a['end']+leg_minutes(last_j,j)
            s=max(j['start'],earliest)
            if s+j['minutes']<=min(j['end'],t.get('end',960)):candidates.append((s,t))
        if not candidates:continue
        s,t=min(candidates,key=lambda p:(p[0],p[1]['id']))
        a={'job_id':j['id'],'technician_id':t['id'],'start':s,'end':s+j['minutes'],'travel_minutes':j.get('travel_minutes',0)}
        assigned.append(a);routes[t['id']].append((a,j))
        if j.get('inventory_item'):stock[j['inventory_item']]-=1
    done={a['job_id'] for a in assigned}
    result={'status':'FEASIBLE_HEURISTIC','jobs_total':len(jobs),'jobs_assigned':len(assigned),
            'unassigned':[j['id'] for j in jobs if j['id'] not in done],'assignments':assigned}
    validate_assignments(jobs,technicians,result,inventory)
    return result


def scheduling_sample(count:int=18,branch_id:str='B01',available_delta:int=0):
    """Extract a reproducible real subset of the synthetic data, not invented demo jobs."""
    if not 1<=count<=40:raise ValueError('count must be between 1 and 40')
    day=DATA['days'][0]
    source=[o for o in DATA['orders'] if o['date']==day and o['branch_id']==branch_id][:count]
    if len(source)<count:raise ValueError('not enough work orders in branch')
    tech=[t for t in DATA['technicians'] if t['branch_id']==branch_id]
    if available_delta<0:tech=tech[:max(0,len(tech)+available_delta)]
    elif available_delta>0:
        tech+= [{**t,'id':'EXTRA-'+str(i)} for i,t in enumerate(tech[:available_delta])]
    technicians=[{'id':t['id'],'branch_id':t['branch_id'],'skills':t['skills'],'start':480,'end':960} for t in tech]
    jobs=[{'id':o['id'],'branch_id':o['branch_id'],
           'skill':DATA['service_types'][o['service_type']]['skill'],
           'minutes':o['minutes'],'start':o['window_start']*60,'end':o['window_end']*60,
           'travel_minutes':o['travel_minutes'],'zone':int(o['customer_id'][1:])%8,
           'priority':2 if o['service_type']=='specialty' else 1,
           'inventory_item':'specialty_kit' if o['service_type']=='specialty' else None} for o in source]
    return jobs,technicians,{'specialty_kit':3}


def compare_solvers(count=18,available_delta=0,seconds=4.0):
    jobs,tech,stock=scheduling_sample(count,available_delta=available_delta)
    heuristic=greedy_baseline(jobs,tech,stock)
    cp=solve_cp_sat(jobs,tech,stock,seconds)
    return {'dataset':'synthetic first-day B01 subset','seed':SEED,'branch':'B01',
            'jobs':len(jobs),'technicians':len(tech),'heuristic':heuristic,
            'cp_sat':cp,'feasible_improvement':cp['jobs_assigned']-heuristic['jobs_assigned'] if cp['status'] in ('FEASIBLE','OPTIMAL') else None}


def investment_allocation(budget:float=202000,staff:int=4,discount:float=.11,adoption:float=.70,years:int=3):
    """Enumerate a small constrained portfolio with two mandatory initiatives.

    Adoption depends on completion of whichever delivery initiatives are selected.
    Benefits are netted to avoid counting overlapping work twice.
    """
    if not 0<=budget<=1_000_000:raise ValueError('budget must be 0 to 1000000')
    if not 1<=staff<=8:raise ValueError('staff outside 1..8')
    if not 0<=adoption<=1 or not 0<=discount<1 or not 1<=years<=10:
        raise ValueError('invalid investment assumptions')
    mandatory={p['id'] for p in PROGRAM if p['mandatory']}
    feasible=[]
    options=[]
    for mask in range(1<<len(PROGRAM)):
        ids={p['id'] for i,p in enumerate(PROGRAM) if mask>>i&1}
        if not mandatory<=ids:continue
        if any(p['id'] in ids and p['id'] not in ('ADOPTION',) and
               not set(p['deps'])<=ids for p in PROGRAM):continue
        selected=[]
        for p in PROGRAM:
            if p['id'] in ids:
                selected.append({**p,'deps':[d for d in p['deps'] if d in ids]})
        spend=sum(p['cost'] for p in selected)
        if spend>budget:continue
        plan=schedule_program(selected,technical_staff=staff)
        if plan['status']=='INFEASIBLE_STAFFING':continue
        annual=0
        benefits={}
        for p in selected:
            benefit=p['benefit_annual']*adoption
            if p['id']=='AI' and 'DISPATCH' in ids:benefit*=.75
            if p['id']=='ADOPTION':benefit*=.80
            benefits[p['id']]=round(benefit,2)
            annual+=benefit
        cashflows=[annual*(.50 if year==1 else 1.0) for year in range(1,years+1)]
        npv=-spend+sum(v/(1+discount)**year for year,v in enumerate(cashflows,1))
        result={'selected':sorted(ids),'investment':spend,'annual_benefits_after_overlap':round(annual,2),
                'benefit_by_project':benefits,'npv':round(npv,2),'finish_day':plan['finish_day'],
                'cashflows':[round(v,2) for v in cashflows],
                'simple_payback_years':round(spend/annual,2) if annual>0 else None}
        feasible.append(result)
    feasible.sort(key=lambda x:(-x['npv'],x['investment']))
    return {'status':'FEASIBLE' if feasible else 'INFEASIBLE_MANDATORY_FUNDING',
            'budget':budget,'staff':staff,'mandatory':sorted(mandatory),
            'mandatory_cost':sum(p['cost'] for p in PROGRAM if p['mandatory']),
            'discount':discount,'adoption':adoption,'years':years,
            'recommended':feasible[0] if feasible else None,
            'alternatives':feasible[1:],
            'limitation':'Synthetic, overlap-adjusted annual benefits; no actual cash receipts or realized savings.'}
