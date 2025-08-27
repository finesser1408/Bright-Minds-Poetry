import os
import django
import sys

# Set up Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'brightminds.settings')

try:
    django.setup()
    from django.db import connection
    
    # Check database connection
    with connection.cursor() as cursor:
        # Get list of all tables in the database
        if 'sqlite3' in connection.settings_dict['ENGINE']:
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        else:
            cursor.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public';
            """)
        
        tables = cursor.fetchall()
        
        print("\nDatabase Tables:")
        print("-" * 80)
        for i, table in enumerate(tables, 1):
            print(f"{i}. {table[0]}")
        
        # Check if auth_user table exists and has data
        if any('auth_user' in table[0].lower() for table in tables):
            cursor.execute("SELECT COUNT(*) FROM auth_user;")
            user_count = cursor.fetchone()[0]
            print(f"\nNumber of users in auth_user: {user_count}")
        
        # Check if api_galleryitem table exists
        gallery_table = next((t for t in tables if 'galleryitem' in t[0].lower()), None)
        if gallery_table:
            cursor.execute(f"SELECT COUNT(*) FROM {gallery_table[0]};")
            gallery_count = cursor.fetchone()[0]
            print(f"Number of gallery items: {gallery_count}")
        
        print("\nDatabase Settings:")
        print("-" * 80)
        print(f"Database Engine: {connection.settings_dict['ENGINE']}")
        print(f"Database Name: {connection.settings_dict.get('NAME', 'N/A')}")
        print(f"Database User: {connection.settings_dict.get('USER', 'N/A')}")
        print(f"Database Host: {connection.settings_dict.get('HOST', 'localhost')}")
        
except Exception as e:
    print(f"Error: {str(e)}")
    import traceback
    traceback.print_exc()
