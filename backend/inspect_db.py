import sqlite3
import os
import sys

def print_header(text, width=80):
    print("\n" + "=" * width)
    print(f"{text:^{width}}")
    print("=" * width)

def inspect_database():
    db_path = os.path.join(os.path.dirname(__file__), 'db.sqlite3')
    
    if not os.path.exists(db_path):
        print(f"Error: Database file not found at {db_path}")
        return
    
    try:
        # Connect to the SQLite database
        conn = sqlite3.connect(db_path)
        conn.row_factory = sqlite3.Row  # This enables column access by name
        cursor = conn.cursor()
        
        # Get list of tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;")
        tables = [row[0] for row in cursor.fetchall()]
        
        if not tables:
            print("No tables found in the database.")
            return
        
        print_header("DATABASE INSPECTION TOOL")
        print(f"Database: {db_path}")
        print(f"Size: {os.path.getsize(db_path) / (1024*1024):.2f} MB")
        print(f"Last modified: {os.path.getmtime(db_path)}")
        
        # Check for GalleryItem table specifically first
        gallery_tables = [t for t in tables if 'galleryitem' in t.lower()]
        if gallery_tables:
            print("\nFound GalleryItem table(s):", ", ".join(gallery_tables))
        else:
            print("\nWARNING: No GalleryItem table found in the database!")
            print("This explains why no gallery items are showing up.")
            print("Make sure you've created and run migrations for the GalleryItem model.")
        
        print_header("TABLES IN DATABASE")
        print("\n".join(f"- {table}" for table in tables))
        
        # For each table, show its structure and row count
        for table_name in tables:
            try:
                # Skip system tables
                if table_name.startswith('sqlite_'):
                    continue
                    
                # Get table info
                cursor.execute(f"PRAGMA table_info({table_name});")
                columns = cursor.fetchall()
                
                # Get row count
                cursor.execute(f"SELECT COUNT(*) as count FROM {table_name};")
                row_count = cursor.fetchone()['count']
                
                print_header(f"TABLE: {table_name.upper()} ({row_count} ROWS)", 60)
                
                # Print column information
                print("\nCOLUMNS:")
                for col in columns:
                    col_id, col_name, col_type, not_null, default_val, is_pk = col
                    constraints = []
                    if is_pk: constraints.append("PRIMARY KEY")
                    if not_null: constraints.append("NOT NULL")
                    if default_val is not None: constraints.append(f"DEFAULT {default_val}")
                    
                    print(f"  {col_name:20} {str(col_type or 'TEXT'):10} {' '.join(constraints)}")
                
                # If the table has rows, show samples
                if row_count > 0 and table_name != 'django_migrations':
                    print(f"\nSAMPLE DATA (first of {row_count} rows):")
                    cursor.execute(f"SELECT * FROM {table_name} LIMIT 1;")
                    sample = cursor.fetchone()
                    
                    if sample:
                        for col in columns:
                            col_name = col[1]
                            value = sample[col_name] if col_name in sample.keys() else None
                            print(f"  {col_name:20}: {str(value)[:100]}" + ('...' if value and len(str(value)) > 100 else ''))
                
                print()  # Add space between tables
                
            except Exception as e:
                print(f"  Error inspecting table {table_name}: {e}")
                continue
        
        # Additional checks for gallery functionality
        if gallery_tables:
            print_header("GALLERY ITEMS CHECK")
            for table_name in gallery_tables:
                try:
                    cursor.execute(f"SELECT COUNT(*) as count FROM {table_name} WHERE media_file IS NOT NULL;")
                    with_media = cursor.fetchone()['count']
                    
                    cursor.execute(f"SELECT COUNT(*) as count FROM {table_name} WHERE thumbnail IS NOT NULL;")
                    with_thumbnails = cursor.fetchone()['count']
                    
                    print(f"\n{table_name}:")
                    print(f"- Total items: {row_count}")
                    print(f"- Items with media files: {with_media}")
                    print(f"- Items with thumbnails: {with_thumbnails}")
                    
                    # Check for missing files
                    if with_media > 0:
                        print("\nChecking for missing media files...")
                        cursor.execute(f"SELECT id, title, media_file FROM {table_name} WHERE media_file IS NOT NULL;")
                        missing_count = 0
                        
                        for row in cursor.fetchall():
                            file_path = os.path.join(os.path.dirname(db_path), 'media', row['media_file'])
                            if not os.path.exists(file_path):
                                if missing_count == 0:
                                    print("\nMissing media files:")
                                missing_count += 1
                                print(f"  - ID {row['id']}: {row['title']} - {row['media_file']}")
                        
                        if missing_count == 0:
                            print("All media files exist.")
                        else:
                            print(f"\nTotal missing media files: {missing_count}")
                    
                except Exception as e:
                    print(f"  Error checking gallery items: {e}")
        
        conn.close()
        
    except Exception as e:
        print(f"Error inspecting database: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    print(f"Inspecting database at: {os.path.join(os.path.dirname(__file__), 'db.sqlite3')}")
    inspect_database()
