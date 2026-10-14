"""FastAPI server: local synthetic-only application. No public multi-tenant deployment."""
from __future__ import annotations
from dataclasses import asdict
import os
from pathlib import Path
from fastapi import FastAPI, HTTPException, Header, Query
from fastapi.responses import HTMLResponse
from pydantic import BaseModel, Field
from .engine import (DATA, scenario_assumptions,operations,branch_comparison,
                     demo_schedule,integrated, schedule_program,risk_simulation,investment_case)
from .workflow import WorkflowStore
from .advanced import compare_solvers, investment_allocation
from .security import authenticated_role, require_role
from .llm import interpret_incident, ModelError
import time

app=FastAPI(title='Juniper Vale Transformation Command Center',version='2026.10.v2',description='Fictional operations scenario lab. No real CRM write access.')
DB_PATH=os.environ.get('JUNIPER_DB','/tmp/juniper-vale-demo.sqlite3')
store=WorkflowStore(DB_PATH)

class ScenarioInputs(BaseModel):
    scenario:str='baseline'
    available_delta:int|None=None
    demand_multiplier:float|None=None
    wage_multiplier:float|None=None
    price_multiplier:float|None=None
    travel_multiplier:float|None=None
    overtime_minutes:int|None=None
    data_quality:float|None=None
    funding_multiplier:float|None=None

class IncidentInput(BaseModel):
    note:str=Field(min_length=3,max_length=1500)
    incident_id:str|None=None

class TransitionInput(BaseModel):
    action:str
    expected_version:int=Field(ge=1)
    data_quality:float=Field(default=.985,ge=0,le=1)

def role(authorization:str|None):
    return authenticated_role(authorization)

@app.get('/health')
def health():return {'status':'ready','release':'2026.10.v2','data_version':DATA['version'],'mode':'synthetic_only'}

@app.get('/api/catalog')
def catalog():return {'branches':DATA['branches'],'services':DATA['service_types'],'dates':[DATA['days'][0],DATA['days'][-1]],'historical_rows':len(DATA['orders']),'technicians':len(DATA['technicians']),'seed':DATA['seed']}

@app.get('/api/operations')
def get_operations(scenario:str='baseline',branch:str|None=None,service:str|None=None):
    try:return operations(DATA,scenario_assumptions(scenario),branch,service)
    except ValueError as e:raise HTTPException(400,str(e))

@app.get('/api/branches')
def get_branches(scenario:str='baseline'):
    try:return branch_comparison(scenario_assumptions(scenario))
    except ValueError as e:raise HTTPException(400,str(e))

@app.post('/api/scenario')
def post_scenario(input:ScenarioInputs):
    try:return integrated(input.scenario,**{k:v for k,v in input.model_dump(exclude={'scenario'}).items() if v is not None})
    except ValueError as e:raise HTTPException(400,str(e))

@app.get('/api/program')
def program():return {'schedule':schedule_program(),'risk':risk_simulation(),'investment':investment_case()}

@app.get('/api/optimizer')
def optimizer(scenario:str='baseline'):
    try:return demo_schedule(scenario_assumptions(scenario))
    except ValueError as e:raise HTTPException(400,str(e))

@app.post('/api/incidents',status_code=201)
def create_incident(input:IncidentInput,authorization:str|None=Header(default=None)):
    try:return store.create(input.note,role(authorization),input.incident_id)
    except PermissionError as e:raise HTTPException(403,str(e))
    except ValueError as e:raise HTTPException(409 if 'duplicate' in str(e) else 400,str(e))

@app.get('/api/incidents/{incident_id}')
def incident(incident_id:str):
    try:return store.get(incident_id)
    except KeyError as e:raise HTTPException(404,str(e))

@app.get('/api/incidents/{incident_id}/audit')
def audit(incident_id:str):return store.audit(incident_id)

@app.post('/api/incidents/{incident_id}/transition')
def transition(incident_id:str,input:TransitionInput,authorization:str|None=Header(default=None)):
    try:return store.transition(incident_id,input.action,role(authorization),input.expected_version,data_quality=input.data_quality)
    except PermissionError as e:raise HTTPException(403,str(e))
    except KeyError as e:raise HTTPException(404,str(e))
    except ValueError as e:raise HTTPException(409,str(e))

@app.get('/',response_class=HTMLResponse)
def landing():return '''<!doctype html><html lang="en"><meta charset="utf-8"><title>Juniper Vale API</title><body style="font:17px system-ui;max-width:720px;margin:5em auto;color:#17324d"><h1>Juniper Vale | Transformation Lab</h1><p>Running a synthetic-only FastAPI service. Explore the <a href="/docs">API documentation</a>, <a href="/api/catalog">scenario catalog</a>, and <a href="/api/program">program calculations</a>.</p><p>This local API does not authenticate real users or connect to a production CRM. The X-Role header is a demonstration role switch, not enterprise authentication.</p></body></html>'''

class OptimizationInputs(BaseModel):
    count:int=Field(default=15,ge=1,le=28)
    available_delta:int=Field(default=0,ge=-7,le=3)
    seconds:float=Field(default=3,gt=0,le=5)

class FundingInputs(BaseModel):
    budget:float=Field(default=202000,ge=0,le=1000000)
    staff:int=Field(default=4,ge=1,le=8)
    adoption:float=Field(default=.70,ge=0,le=1)
    discount:float=Field(default=.11,ge=0,lt=1)

class InterpretInputs(BaseModel):
    note:str=Field(min_length=3,max_length=1500)
    incident_id:str=Field(default='public-replay',min_length=3,max_length=80)
    live:bool=False

_LIVE_CALLS=[]

@app.post('/api/optimize')
def optimize(input:OptimizationInputs):
    try:return compare_solvers(input.count,input.available_delta,input.seconds)
    except ValueError as e:raise HTTPException(400,str(e))
    except RuntimeError as e:raise HTTPException(503,str(e))

@app.post('/api/portfolio')
def portfolio(input:FundingInputs):
    try:return investment_allocation(input.budget,input.staff,input.discount,input.adoption)
    except ValueError as e:raise HTTPException(400,str(e))

@app.post('/api/interpret')
def interpret_note(input:InterpretInputs, authorization:str|None=Header(default=None)):
    if input.live:
        require_role(authorization,{'manager'})
        now=time.monotonic()
        _LIVE_CALLS[:]=[t for t in _LIVE_CALLS if now-t<60]
        if len(_LIVE_CALLS)>=5:raise HTTPException(429,'live AI limit: five requests per minute per demo process')
        _LIVE_CALLS.append(now)
    try:return interpret_incident(input.note,input.incident_id,live=input.live)
    except (ValueError,ModelError) as e:raise HTTPException(503 if isinstance(e,ModelError) else 400,str(e))

@app.post('/api/reset')
def reset_demo(authorization:str|None=Header(default=None)):
    require_role(authorization,{'manager'})
    store.reset()
    return {'status':'RESET','detail':'synthetic incidents and audit reset; baseline dataset is unchanged'}

@app.get('/api/appointments/{order_id}')
def read_appointment(order_id:str):
    try:return store.get_appointment(order_id)
    except KeyError as e:raise HTTPException(404,str(e))
