"""Local API bearer-token boundary. All public reads are guest-only."""
from __future__ import annotations
import os, secrets
from fastapi import HTTPException

def authenticated_role(authorization: str|None) -> str:
    if not authorization:
        return 'viewer'
    if not authorization.startswith('Bearer '):
        raise HTTPException(401,'Bearer authentication required')
    token=authorization[7:].strip()
    if len(token)<24:
        raise HTTPException(401,'invalid credentials')
    candidates=(('manager',os.getenv('JUNIPER_MANAGER_TOKEN','')),
                ('dispatcher',os.getenv('JUNIPER_DISPATCHER_TOKEN','')))
    for role,known in candidates:
        if len(known)>=24 and secrets.compare_digest(token,known):
            return role
    raise HTTPException(401,'invalid credentials')

def require_role(authorization:str|None, allowed:set[str])->str:
    role=authenticated_role(authorization)
    if role not in allowed:
        raise HTTPException(403,'insufficient permissions')
    return role
