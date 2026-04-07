"""
Seed script - creates admin user on first run.
Run: python -m app.seed
"""
from app.database import SessionLocal, engine, Base
from app.domains.auth.models import User
from app.domains.patients.models import Patient
from app.domains.auth.service import AuthService

# Create tables
Base.metadata.create_all(bind=engine)

db = SessionLocal()
service = AuthService(db)

# Check if admin exists
existing = db.query(User).filter(User.email == "admin@cars.com").first()
if not existing:
    admin = service.create_user("Administrador", "admin@cars.com", "admin123", "admin")
    print(f"Created admin: {admin.email}")
else:
    print("Admin user already exists")

# Check if avaliador exists
avaliador = db.query(User).filter(User.email == "maria@cars.com").first()
if not avaliador:
    avaliador = service.create_user("Maria Silva", "maria@cars.com", "avaliador123", "avaliador")
    print(f"Created avaliador: {avaliador.email}")
else:
    print("Maria avaliador already exists")

# Seed patients
from app.domains.patients.schemas import PatientCreate
patient_service = __import__("app.domains.patients.service", fromlist=["PatientService"]).PatientService(db)

if db.query(Patient).count() == 0:
    patients = [
        PatientCreate(nome="Lucas Oliveira", idade=6),
        PatientCreate(nome="Ana Clara Souza", idade=4),
        PatientCreate(nome="Pedro Henrique Lima", idade=8),
        PatientCreate(nome="Isabella Rodrigues", idade=5),
    ]
    for p in patients:
        patient_service.create(p, avaliador_id=2)
        print(f"Created patient: {p.nome}")
else:
    print("Patients already exist")

db.close()
print("Seed complete!")
