"""OR-Tools and constrained capital-allocation integration checks."""
import pytest
from lab.advanced import (
    solve_cp_sat,greedy_baseline,validate_assignments,
    scheduling_sample,compare_solvers,investment_allocation,
)


def test_cp_sat_skills_windows_and_inventory():
    tech=[{'id':'T1','skills':['general'],'branch_id':'B01','start':480,'end':700},
          {'id':'T2','skills':['specialty'],'branch_id':'B01','start':480,'end':700}]
    jobs=[{'id':'A','skill':'specialty','branch_id':'B01','start':480,'end':600,'minutes':60,'travel_minutes':10,'inventory_item':'kit','zone':1},
          {'id':'B','skill':'specialty','branch_id':'B01','start':480,'end':600,'minutes':60,'travel_minutes':10,'inventory_item':'kit','zone':2}]
    result=solve_cp_sat(jobs,tech,{'kit':1},seconds=2)
    assert result['status']=='OPTIMAL'
    assert result['jobs_assigned']==1
    assert validate_assignments(jobs,tech,result,{'kit':1})


def test_cp_sat_interjob_travel_and_no_overlap():
    t=[{'id':'T1','skills':['general'],'branch_id':'B01','start':480,'end':800}]
    j=[{'id':k,'skill':'general','branch_id':'B01','minutes':50,'start':480,'end':660,'travel_minutes':10,'zone':zone}
       for k,zone in [('A',1),('B',6)]]
    r=solve_cp_sat(j,t,seconds=2)
    assert r['jobs_assigned']==2
    assert validate_assignments(j,t,r)


def test_cp_sat_infeasible_unqualified():
    t=[{'id':'T','skills':['general'],'branch_id':'B01','start':480,'end':960}]
    j=[{'id':'J','skill':'specialty','branch_id':'B01','minutes':80,'start':480,'end':600}]
    r=solve_cp_sat(j,t,seconds=2)
    assert r['jobs_assigned']==0 and r['unassigned']==['J']


def test_cp_sat_compares_same_input_to_greedy():
    jobs,tech,inv=scheduling_sample(12)
    baseline=greedy_baseline(jobs,tech,inv)
    optimized=solve_cp_sat(jobs,tech,inv,seconds=4)
    assert optimized['status'] in ('OPTIMAL','FEASIBLE')
    assert optimized['jobs_assigned']>=baseline['jobs_assigned']
    assert optimized['jobs_total']==baseline['jobs_total']
    assert validate_assignments(jobs,tech,optimized,inv)


def test_capital_allocation_under_budget():
    full=investment_allocation(202000)
    tight=investment_allocation(125000)
    assert full['status']=='FEASIBLE' and tight['status']=='FEASIBLE'
    assert full['recommended']['investment']<=202000
    assert tight['recommended']['investment']<=125000
    assert 'CRM' in tight['recommended']['selected']
    assert 'ADOPTION' in tight['recommended']['selected']
    assert len(tight['recommended']['selected'])<4


def test_capital_allocation_infeasible_mandatory():
    output=investment_allocation(20000)
    assert output['status']=='INFEASIBLE_MANDATORY_FUNDING'
    assert output['recommended'] is None


def test_capital_allocation_resource_impact():
    x=investment_allocation(202000,staff=2)
    y=investment_allocation(202000,staff=4)
    assert x['recommended']['finish_day']>=y['recommended']['finish_day']


def test_capital_allocation_is_reproducible():
    assert investment_allocation(160000)==investment_allocation(160000)


def test_reject_out_of_range_scenarios():
    with pytest.raises(ValueError): investment_allocation(-1)
    with pytest.raises(ValueError): investment_allocation(120000,staff=0)
