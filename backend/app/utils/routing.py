"""
Complaint ID generator — GRIEVA/YYYY/XXXXXX
"""
import random
from datetime import datetime, timezone


def generate_complaint_id() -> str:
    year = datetime.now(timezone.utc).year
    number = random.randint(100000, 999999)
    return f"GRIEVA/{year}/{number}"
