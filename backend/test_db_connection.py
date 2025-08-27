import os
import sys
import django

# Add the parent directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'brightminds.settings')

try:
    django.setup()
    from django.db import connection
    
    print("Successfully connected to Django!")
    
    # Check if we can access the database
    with connection.cursor() as cursor:
        print("\nDatabase connection successful!")
        cursor.execute("SELECT sqlite_version();")
        version = cursor.fetchone()
        print(f"SQLite version: {version[0]}")
        
        # List all tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        
        print("\nDatabase Tables:")
        for table in tables:
            print(f"- {table[0]}")
            
except Exception as e:
    print(f"Error: {str(e)}")
    import traceback
    traceback.print_exc()

# List all files in the current directory
print("\nFiles in backend directory:")
for item in os.listdir('.'):
    print(f"- {item}")

# Check for db.sqlite3 file
db_path = os.path.join(os.path.dirname(__file__), 'db.sqlite3')
print(f"\nDatabase file exists: {os.path.exists(db_path)}")
print(f"Database file path: {db_path}")
