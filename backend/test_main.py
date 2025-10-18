import io
import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from database import Base, get_db
from main import app

# Use an in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Override the get_db dependency to use the test database
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="function")
def db_session():
    # Create the database tables
    Base.metadata.create_all(bind=engine)
    yield
    # Drop the database tables after the test
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def test_client(db_session):
    """
    Create a test client that uses the override_get_db dependency.
    """
    client = TestClient(app)
    yield client

def test_summarize_whitespace_text_is_rejected(test_client):
    """Test that sending whitespace-only text to summarize returns a 400 error."""
    response = test_client.post("/summarize", data={"text": "   \t\n"})
    assert response.status_code == 400
    assert response.json() == {"detail": "Text cannot be empty"}

def test_upload_file_no_filename(test_client):
    """Test uploading a file with no filename is rejected."""
    file_content = b"some content"
    files = {"file": ("", file_content, "text/plain")}
    response = test_client.post("/upload", files=files)
    assert response.status_code == 422

def test_upload_file_with_filename(test_client):
    """Test a successful file upload."""
    file_content = b"This is a test file."
    files = {"file": ("test.txt", file_content, "text/plain")}
    response = test_client.post("/upload", files=files)
    assert response.status_code == 200
    assert response.json()["message"] == "File 'test.txt' uploaded and processed successfully!"
    assert response.json()["document_id"] is not None
