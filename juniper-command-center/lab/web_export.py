"""Export versioned operating inputs for the static read-only scenario calculator."""
from __future__ import annotations
from pathlib import Path
from collections import defaultdict
from statistics import mean
import json
from .engine import DATA, SERVICE_TYPES,LABOR_RATE,TRAVEL_COST_PER_MIN,FIXED_DAILY_PER_BRANCH,PROGRAM,operations,SEED


def export(dest='web/data.json'):
    branches=[]
    for b in DATA['branches']:
        group=[o for o in DATA['orders'] if o['branch_id']==b['id']]
        complete=[o for o in group if o['completed']]
        def record(rows):
            completed=[o for o in rows if o['completed']]
            return {
                'baseline_orders':len(rows),
                'completion_rate':sum(o['completed'] for o in rows)/len(rows) if rows else 0,
                'average_service_minutes':mean(o['minutes'] for o in rows) if rows else 0,
                'average_travel_minutes':mean(o['travel_minutes'] for o in rows) if rows else 0,
                'average_revenue':mean(o['revenue'] for o in completed) if completed else 0,
                'average_materials':mean(o['material_cost'] for o in completed) if completed else 0,
                'on_time_rate':mean(o['on_time'] for o in completed) if completed else 0,
                'rework_rate':mean(o['rework'] for o in completed) if completed else 0,
            }
        branches.append({'id':b['id'],'name':b['name'],
                         'technicians':sum(t['branch_id']==b['id'] for t in DATA['technicians']),
                         'all':record(group),
                         'services':{s:record([o for o in group if o['service_type']==s]) for s in SERVICE_TYPES}})
    result={
        'version':DATA['version'],
        'release':'2026.10.v2',
        'seed':SEED,'days':len(DATA['days']),
        'branches':branches,
        'total_orders':len(DATA['orders']),'total_technicians':len(DATA['technicians']),
        'labor_rate':LABOR_RATE,'travel_cost_per_minute':TRAVEL_COST_PER_MIN,'fixed_daily_per_branch':FIXED_DAILY_PER_BRANCH,
        'initiatives':PROGRAM,
        'python_baseline':{k:operations()[k] for k in ('requested','completed','unfulfilled','revenue','direct_cost','contribution','fixed_operating_cost','operating_profit')},
        'method':'Branch aggregates computed directly from lab.engine.DATA. Client recalculates using the same stated unit-economics assumptions. CP-SAT and transactional actions require local API.'
    }
    p=Path(dest);p.parent.mkdir(parents=True,exist_ok=True)
    p.write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8')
    return result


if __name__=='__main__':
    r=export()
    print('Exported static calculator inputs:',r['total_orders'],'orders /',len(r['branches']),'branches')
