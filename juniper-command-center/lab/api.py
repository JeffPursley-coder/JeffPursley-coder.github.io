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

app=FastAPI(title='Juniper Vale Transformation Command Center',version='0.1.0',description='Fictional operations scenario lab. No real CRM write access.')
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

def role(x_role:str):
    if x_role not in ('viewer','dispatcher','manager'):raise HTTPException(403,'invalid role')
    return x_role

@app.get('/health')
def health():return {'status':'ready','data_version':DATA['version'],'mode':'synthetic_only'}

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
def create_incident(input:IncidentInput,x_role:str=Header(default='viewer')):
    try:return store.create(input.note,role(x_role),input.incident_id)
    except PermissionError as e:raise HTTPException(403,str(e))
    except ValueError as e:raise HTTPException(409 if 'duplicate' in str(e) else 400,str(e))

@app.get('/api/incidents/{incident_id}')
def incident(incident_id:str):
    try:return store.get(incident_id)
    except KeyError as e:raise HTTPException(404,str(e))

@app.get('/api/incidents/{incident_id}/audit')
def audit(incident_id:str):return store.audit(incident_id)

@app.post('/api/incidents/{incident_id}/transition')
def transition(incident_id:str,input:TransitionInput,x_role:str=Header(default='viewer')):
    try:return store.transition(incident_id,input.action,role(x_role),input.expected_version,data_quality=input.data_quality)
    except PermissionError as e:raise HTTPException(403,str(e))
    except KeyError as e:raise HTTPException(404,str(e))
    except ValueError as e:raise HTTPException(409,str(e))

@app.get('/',response_class=HTMLResponse)
def landing():return '''<!doctype html><html lang="en"><meta charset="utf-8"><title>Juniper Vale API</title><body style="font:17px system-ui;max-width:720px;margin:5em auto;color:#17324d"><h1>Juniper Vale | Transformation Lab</h1><p>Running a synthetic-only FastAPI service. Explore the <a href="/docs">API documentation</a>, <a href="/api/catalog">scenario catalog</a>, and <a href="/api/program">program calculations</a>.</p><p>This local API does not authenticate real users or connect to a production CRM. The X-Role header is a demonstration role switch, not enterprise authentication.</p></body></html>'''
