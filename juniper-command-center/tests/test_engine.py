import math
import pytest
from copy import deepcopy
from lab.engine import DATA, SEED, generate,check_data,scenario_assumptions, operations,branch_comparison,assign_jobs, demo_schedule,PROGRAM,schedule_program,risk_simulation,investment_case, integrated


def test_dataset_reproducible():
    a=generate(SEED);b=generate(SEED)
    assert a['orders']==b['orders']
    assert a['seed']==SEED and len(a['branches'])==8 and len(a['technicians'])==60
    assert len(a['days'])==15 and len(a['orders'])>=3000

def test_referential_integrity():
    check_data(DATA)
    corrupted=deepcopy(DATA);corrupted['orders'][0]['customer_id']='MISSING'
    with pytest.raises(ValueError):check_data(corrupted)

def test_no_duplicate_order_ids():
    corrupted=deepcopy(DATA);corrupted['orders'][0]['id']=corrupted['orders'][1]['id']
    with pytest.raises(ValueError):check_data(corrupted)

def test_company_reconciliation():
    main=operations();branches=branch_comparison()
    for k in ['revenue','direct_cost','contribution','fixed_operating_cost','operating_profit','completed','requested']:
        assert main[k]==pytest.approx(sum(b[k] for b in branches))
    assert main['contribution']==pytest.approx(main['revenue']-main['direct_cost'])
    assert main['operating_profit']==pytest.approx(main['contribution']-main['fixed_operating_cost'])

def test_contribution_not_operating_profit():
    p=operations()
    assert p['contribution']>p['operating_profit']
    assert p['fixed_operating_cost']>0

def test_bad_assumptions_rejected():
    with pytest.raises(ValueError):scenario_assumptions('baseline',overtime_minutes=1000)
    with pytest.raises(ValueError):scenario_assumptions('not-a-scenario')
    with pytest.raises(ValueError):operations(DATA,scenario_assumptions(),branch='BAD')

def test_demand_surge_more_unfulfilled():
    assert operations(DATA,scenario_assumptions('demand-surge'))['unfulfilled']>operations()['unfulfilled']

def test_staffing_shortage_limits_capacity():
    base=operations();loss=operations(DATA,scenario_assumptions('technician-shortage'))
    assert loss['technicians']<base['technicians']
    assert loss['capacity_minutes']<base['capacity_minutes']
    assert loss['unfulfilled']>=base['unfulfilled']

def test_price_rise_contribution():
    assert operations(DATA,scenario_assumptions('baseline',price_multiplier=1.08))['contribution']>operations()['contribution']

def test_data_failure_removes_eligibility():
    bad=operations(DATA,scenario_assumptions('crm-data-failure'))
    assert bad['eligible']<operations()['eligible']

def test_solver_rejects_unqualified():
    j=[{'id':'a','skill':'specialty','start':480,'end':600,'minutes':50}]
    t=[{'id':'t','skills':['general'],'start':480,'end':960}]
    r=assign_jobs(j,t)
    assert r['jobs_assigned']==0 and r['unassigned']==['a']

def test_solver_nonoverlap():
    j=[{'id':k,'skill':'general','start':480,'end':600,'minutes':80} for k in ('a','b')]
    t=[{'id':'t','skills':['general'],'start':480,'end':960}]
    assert assign_jobs(j,t)['jobs_assigned']==1

def test_solver_respects_windows():
    j=[{'id':'a','skill':'general','start':480,'end':500,'minutes':40}]
    t=[{'id':'t','skills':['general'],'start':480,'end':960}]
    assert assign_jobs(j,t)['jobs_assigned']==0

def test_solver_inventory_exhaustion():
    j=[{'id':'a','skill':'general','start':480,'end':800,'minutes':30,'inventory_item':'kit'},
       {'id':'b','skill':'general','start':480,'end':800,'minutes':30,'inventory_item':'kit'}]
    t=[{'id':'t','skills':['general'],'start':480,'end':960}]
    assert assign_jobs(j,t,inventory={'kit':1})['jobs_assigned']==1

def test_solver_feasible_subset():
    result=demo_schedule()
    assert result['jobs_assigned']<=result['jobs_total']
    assert result['status'] in ('OPTIMAL_WITHIN_SUBSET','BEST_PARTIAL_WITHIN_SUBSET','FEASIBLE_UNPROVEN')

def test_program_cycle_detection():
    x=deepcopy(PROGRAM)
    x[0]['deps']=['ADOPTION']
    with pytest.raises(ValueError,match='cycle'):schedule_program(x)

def test_program_capacity_recalculation():
    assert schedule_program(technical_staff=2)['finish_day']>=schedule_program(technical_staff=4)['finish_day']

def test_program_release_gate():
    assert not schedule_program(migrate_quality=.83)['release_approved']
    assert schedule_program(migrate_quality=.97)['release_approved']

def test_risk_reproducible():
    assert risk_simulation(seed=3,samples=120)==risk_simulation(seed=3,samples=120)
    r=risk_simulation()
    assert r['p10_finish_day']<=r['p50_finish_day']<=r['p90_finish_day']

def test_investment_benefit_adjustment():
    r=investment_case(limit=30000)
    assert not r['mandatory_affordable']
    assert r['total_investment']==sum(p['investment'] for p in r['projects'])
    assert r['benefits_overlap_adjusted']

def test_integrated_scenarios():
    for scen in ('baseline','technician-shortage','crm-data-failure','demand-surge'):
        r=integrated(scen)
        assert r['operations']['scenario']==scen
        assert r['scenario_id'].startswith('JV-'+scen)
        assert r['service_command']['review_required']
    assert integrated('crm-data-failure')['service_command']['write_blocked']
    assert not integrated('baseline')['service_command']['write_blocked']
