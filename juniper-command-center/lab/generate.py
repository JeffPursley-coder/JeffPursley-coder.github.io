"""Regenerate linked, deterministic fictional dataset from the audited simulation source."""
from __future__ import annotations
import argparse, json
from pathlib import Path
from .engine import generate

def main():
    p=argparse.ArgumentParser();p.add_argument('--out',default='data/juniper_synthetic_v1.json');p.add_argument('--seed',type=int,default=20261014)
    a=p.parse_args();dest=Path(a.out);dest.parent.mkdir(parents=True,exist_ok=True)
    data=generate(a.seed);dest.write_text(json.dumps(data,indent=2),encoding='utf8');print(f'{len(data["orders"])} orders, {len(data["technicians"])} technicians -> {dest}')
if __name__=='__main__':main()
