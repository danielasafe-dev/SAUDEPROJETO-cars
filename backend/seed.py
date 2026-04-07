"""
Seed script - cria banco, tabelas e admin.
Executar: cd backend && python seed.py
"""
import pyodbc
from app.config import get_settings

settings = get_settings()

# --- Passo 1: Criar banco se nao existir ---
print("Verificando banco de dados...")

conn_str_master = (
    f"DRIVER={{ODBC Driver 17 for SQL Server}};"
    f"SERVER={settings.db_server},{settings.db_port};"
    f"UID={settings.db_user};PWD={settings.db_password};"
    f"DATABASE=master"
)

try:
    conn = pyodbc.connect(conn_str_master, autocommit=True)
    cursor = conn.cursor()
    cursor.execute(f"""
        IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = '{settings.db_name}')
        BEGIN
            CREATE DATABASE [{settings.db_name}]
            PRINT 'Banco "{settings.db_name}" criado!'
        END
        ELSE
            PRINT 'Banco ja existe.'
    """)
    cursor.close()
    conn.close()
except Exception as e:
    print(f"ERRO ao criar banco: {e}")
    print("Dica: confira usuario, senha e se o SQL Server esta rodando")
    exit(1)

# --- Passo 2: Criar tabelas (agora que o banco existe) ---
from app.database import engine, Base, SessionLocal
from app.domains.auth.models import User
from app.domains.patients.models import Patient
from app.domains.evaluations.models import Evaluation
from app.domains.auth.service import AuthService

print("Criando tabelas...")
Base.metadata.create_all(bind=engine)
print("Tabelas criadas!")

# --- Passo 3: Criar admin ---
print("Criando admin...")
db = SessionLocal()
service = AuthService(db)

existing = db.query(User).filter(User.email == "admin@cars.com").first()
if not existing:
    admin = service.create_user("Administrador", "admin@cars.com", "admin123", "admin")
    print(f"Admin criado: admin@cars.com / admin123")
else:
    print("Admin ja existe")

db.close()
print("\nSeed concluido!")
