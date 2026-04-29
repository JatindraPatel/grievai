"""
Tests — Complaints API
Run: pytest tests/ -v
"""
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.fixture(scope="session")
def anyio_backend():
    return "asyncio"


@pytest_asyncio.fixture(scope="session")
async def client():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as c:
        yield c


@pytest.mark.anyio
async def test_health(client):
    res = await client.get("/api/v1/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"


@pytest.mark.anyio
async def test_classify_electricity(client):
    res = await client.post("/api/v1/complaints/classify", json={"text": "mere area me bijli nahi aa rahi hai"})
    assert res.status_code == 200
    data = res.json()
    assert data["category"] == "Electricity"
    assert data["priority"] in ("High", "Medium", "Low")


@pytest.mark.anyio
async def test_classify_water_hindi(client):
    res = await client.post("/api/v1/complaints/classify", json={"text": "हमारे मोहल्ले में पानी नहीं आ रहा"})
    assert res.status_code == 200
    data = res.json()
    assert data["category"] == "Water"
    assert data["detected_language"] in ("Hindi", "Hinglish")


@pytest.mark.anyio
async def test_submit_complaint(client):
    payload = {
        "citizen_name": "Ramesh Kumar",
        "citizen_mobile": "9876543210",
        "citizen_email": "ramesh@example.com",
        "state": "Madhya Pradesh",
        "subject": "Electricity outage for 3 days",
        "description": "Mere area me 3 din se bijli nahi aa rahi. Transformer kharab ho gaya hai.",
    }
    res = await client.post("/api/v1/complaints", json=payload)
    assert res.status_code == 201
    data = res.json()
    assert data["complaint_id"].startswith("GRIEVA/")
    assert data["category"] == "Electricity"
    assert data["status"] == "Pending"
