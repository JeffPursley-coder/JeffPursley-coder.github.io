"""Generate executive and technical PDF evidence directly from the current model."""
from __future__ import annotations
from pathlib import Path
from xml.sax.saxutils import escape
import re
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet,ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer,Table,TableStyle,KeepTogether
from .engine import DATA, operations,integrated,PROGRAM,SEED, risk_simulation
from .advanced import compare_solvers, investment_allocation
from .llm_evaluate import EVAL_VERSION,CASES

NAVY=colors.HexColor('#17324d')
TEAL=colors.HexColor('#2b7a78')
EDGE=colors.HexColor('#d9e4e8')
BACKGROUND=colors.HexColor('#f2f6f6')

def dollars(v):return f'${v:,.0f}'
styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name='JVTitle',parent=styles['Title'],fontName='Helvetica-Bold',fontSize=23,leading=28,textColor=NAVY,spaceAfter=12))
styles.add(ParagraphStyle(name='JVHeader',parent=styles['Heading2'],fontName='Helvetica-Bold',fontSize=12,leading=17,textColor=NAVY,spaceBefore=13,spaceAfter=7))
styles.add(ParagraphStyle(name='JVBody',parent=styles['BodyText'],fontSize=9.2,leading=14.3,spaceAfter=8,textColor=colors.HexColor('#2b3c47')))
styles.add(ParagraphStyle(name='JVCaveat',parent=styles['BodyText'],fontSize=8,leading=12,textColor=colors.HexColor('#5a6d75'),spaceAfter=8))
styles.add(ParagraphStyle(name='JVSmall',parent=styles['BodyText'],fontSize=8,leading=10.4,textColor=NAVY))
def p(text,style='JVBody'):return Paragraph(escape(str(text)),styles[style])
def heading(text):return p(text,'JVHeader')
def grid(rows,widths):
    table=Table([[p(v,'JVSmall') for v in row] for row in rows],colWidths=widths,repeatRows=1,hAlign='LEFT')
    table.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),BACKGROUND),('GRID',(0,0),(-1,-1),.35,EDGE),('VALIGN',(0,0),(-1,-1),'TOP'),('TOPPADDING',(0,0),(-1,-1),8),('BOTTOMPADDING',(0,0),(-1,-1),8),('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.white,colors.HexColor('#f8faf9')])]))
    return table
def build(path,title,elements):
    doc=SimpleDocTemplate(str(path),pagesize=(612,792),leftMargin=49,rightMargin=49,topMargin=52,bottomMargin=48)
    story=[p('JUNIPER VALE  /  INDEPENDENT TRANSFORMATION LAB','JVCaveat'),p(title,'JVTitle'),p('Release 2026.10.v2  |  Synthetic data  |  Seed 20261014','JVCaveat')]+elements
    def footer(c,d):
        c.saveState();c.setStrokeColor(EDGE);c.line(49,40,563,40)
        c.setFont('Helvetica',8);c.setFillColor(colors.HexColor('#617581'))
        c.drawString(49,28,'Jeff Pursley  |  Juniper Vale Transformation Command Center')
        c.drawRightString(563,28,str(d.page))
        c.restoreState()
    doc.build(story,onFirstPage=footer,onLaterPages=footer)

def make_reports(destination):
    dest=Path(destination);dest.mkdir(parents=True,exist_ok=True)
    baseline=operations()
    states={name:integrated(name) for name in ('baseline','technician-shortage','crm-data-failure','demand-surge')}
    full=investment_allocation(202000)
    tight=investment_allocation(125000)
    risk=risk_simulation()
    tests=Path('test-current-run.txt')
    result=tests.read_text() if tests.exists() else ''
    m=re.search(r'(\d+) passed',result)
    test_count=m.group(1) if m else 'unavailable'
    scenario_rows=[['Condition','Requested','Completed','Unfulfilled','Operating profit']]
    for name,s in states.items():
        o=s['operations'];scenario_rows.append([name.replace('-',' ').title(),f"{o['requested']:,}",f"{o['completed']:,}",f"{o['unfulfilled']:,}",dollars(o['operating_profit'])])
    main=[
        p('Executive decision brief','JVHeader'),
        p('Juniper Vale Service Group is a fictional eight-branch recurring-services organization with 60 modeled field technicians, recurring appointments, customer time windows and four interdependent transformation initiatives. The model illustrates management trade-offs; it is not observed client performance.'),
        heading('Operating baseline'),
        p(f"The fixed-seed scenario includes {baseline['requested']:,} modeled service orders over 15 operating days. Of these, {baseline['completed']:,} are projected complete and {baseline['unfulfilled']:,} are unfulfilled under the stated aggregate capacity and data-eligibility assumptions. Recognized revenue is {dollars(baseline['revenue'])}; direct costs {dollars(baseline['direct_cost'])}; contribution {dollars(baseline['contribution'])}; fixed branch operating costs {dollars(baseline['fixed_operating_cost'])}; operating profit {dollars(baseline['operating_profit'])}."),
        p('Financial definitions: contribution equals revenue minus modeled direct materials, burdened labor and travel. Operating profit deducts branch fixed expenses. No EBITDA or realized cash-flow claim is made.','JVCaveat'),
        heading('Integrated management disruptions'),
        grid(scenario_rows,[124,87,87,89,126]),
        heading('Strategic investment allocation'),
        p(f"The modeled full transformation costs {dollars(full['recommended']['investment'])} and generates discounted NPV of {dollars(full['recommended']['npv'])} under an 11% discount rate, 70% assumed benefit adoption, and three modeled benefit years. With a {dollars(tight['budget'])} funding cap, the preferred feasible portfolio is {', '.join(tight['recommended']['selected'])}; modeled NPV becomes {dollars(tight['recommended']['npv'])}. Mandatory CRM modernization and adoption remain included."),
        p('Benefits are synthetic annual estimates; first-year benefit realization is discounted by a 50% ramp. AI and adoption benefits are reduced for overlap where other initiatives contribute to the same outcomes.'),
        heading('Executive decision'),
        p('Protect customer commitments and eligibility constraints before seeking maximum throughput. When CRM data quality falls below 95%, block release and simulated record writes. Under staffing pressure, compare resource options against unmet demand and contribution. Under funding constraints, protect mandatory work and defer the least valuable permissible initiatives.'),
        heading('Decision controls and limitations'),
        p('The public website recalculates aggregate finance and portfolio selections in the browser using version-controlled synthetic branch inputs. The Python application runs constrained technician optimization, schedule risk, optional AI interpretation and an authenticated synthetic SQLite workflow. These components are not publicly hosted as a multi-tenant service. No live-model accuracy was measured.'),
    ]
    build(dest/'JuniperVale_Executive_Transformation_Brief.pdf','Executive Transformation Brief',main)
    solver=compare_solvers(12,seconds=4)
    cp=solver['cp_sat'];heur=solver['heuristic']
    tech=[
        heading('Release and reproducibility'),
        p(f"Application release 2026.10.v2; dataset version {DATA['version']}; synthetic generator seed {SEED}; {len(DATA['branches'])} branches, {len(DATA['technicians'])} technicians, {len(DATA['orders']):,} orders. Automated tests verified in the current CI run: {test_count} passing. The exact CI log is published under juniper-command-center/docs/current-tests.txt."),
        heading('Calculation boundaries'),
        p('Branch-level financial statements reconcile by construction to consolidated totals. Each branch applies demand, available labor minutes, average service duration, travel time and data eligibility before projecting completed services. Revenue and direct costs derive from projected completed counts and modeled unit economics. Branch fixed costs are deducted once.'),
        heading('Mathematical optimization'),
        p(f"The bounded OR-Tools CP-SAT solver evaluated {solver['jobs']} first-day orders with {solver['technicians']} branch technicians. Status: {cp['status']}. It assigned {cp['jobs_assigned']} work orders compared with {heur['jobs_assigned']} assigned by the reproducible greedy baseline; elapsed solver time {cp['solve_seconds']} seconds. The model enforces technician skills, windows, shift limits, inventory and time between jobs. It uses a synthetic neighborhood travel proxy rather than live road-network time; no full-fleet VRPTW benchmark is claimed."),
        heading('Program scheduling and quantitative risk'),
        p(f"The program scheduler uses day-level dependency precedence and shared technical resource slots. The seeded Monte Carlo model has {risk['runs']} draws, with P10/P50/P90 finish days {risk['p10_finish_day']}/{risk['p50_finish_day']}/{risk['p90_finish_day']}. Inputs are independently sampled triangular task-duration and cost multipliers; real dependencies between risk drivers are not estimated."),
        heading('Investment and benefits'),
        p(f"Four initiatives: {', '.join(p['id'] for p in PROGRAM)}. CRM and adoption are mandatory; available funds and resource capacity constrain eligible combinations. Under the complete {dollars(full['budget'])} budget, recommended portfolio NPV is {dollars(full['recommended']['npv'])}. Discounts, adoption assumptions and overlap adjustments are source-controlled. NPV is not booked savings."),
        heading('Workflow transaction integrity'),
        p('Synthetic appointments and incident proposals persist to SQLite. Mutations require a server-verified bearer token and an approved state transition. Execution checks CRM quality, incident completeness, an eligible target record and the recorded appointment version. Updates and audit events commit together; stale proposals are rejected. The public site has no anonymous privileged writes.'),
        heading('AI interpretation and evaluation'),
        p(f"Optional OpenAI chat-completion integration validates structured JSON against a required schema and forces human review for ambiguous or injected instructions. Credentials remain server-side. The {len(CASES)}-case reference evaluation (version {EVAL_VERSION}) has NOT been run against a live provider in this release because no authorized API credential or usage budget was supplied. A distinct 20-case deterministic replay set is not presented as LLM accuracy."),
        heading('Deployment and known limitations'),
        p('Backend is locally runnable via FastAPI, not currently deployed to a public host. The public calculator implements aggregate scenario math; it does not host OR-Tools or execute CRM transactions. Token authentication is suitable for a controlled local demonstration but not a full identity platform. Synthetic data, independent risk draws, limited route size and generic travel proxies restrict external validity.'),
        heading('Reproduction'),
        p('From juniper-command-center: pip install -r requirements.txt; python -m lab.web_export; pytest -q; uvicorn lab.api:app --reload. Privileged actions require JUNIPER_MANAGER_TOKEN or JUNIPER_DISPATCHER_TOKEN configured as a sufficiently long secret.'),
    ]
    build(dest/'JuniperVale_Technical_Evaluation_Report.pdf','Technical Evaluation Report',tech)
    print('Generated two current-model PDF reports; suite:',test_count,'tests; solver:',cp['status'])

if __name__=='__main__':
    import argparse
    parser=argparse.ArgumentParser();parser.add_argument('--out',default='../../assets/files')
    a=parser.parse_args();make_reports(a.out)
