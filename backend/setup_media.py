import os
import sys
import shutil
from pathlib import Path

def setup_media_directories():
    """Set up the required media directories and verify their permissions."""
    # Base directory
    base_dir = Path(__file__).parent
    media_root = base_dir / 'media'
    
    # Required subdirectories
    required_dirs = [
        media_root / 'gallery_media',
        media_root / 'gallery_thumbnails',
        media_root / 'avatars',
        media_root / 'poem_media'
    ]
    
    print("Setting up media directories...\n")
    
    # Create directories if they don't exist
    for directory in required_dirs:
        try:
            directory.mkdir(parents=True, exist_ok=True)
            print(f"✓ Created directory: {directory.relative_to(base_dir)}")
        except Exception as e:
            print(f"✗ Failed to create {directory.relative_to(base_dir)}: {e}")
    
    # Verify directory permissions
    print("\nVerifying directory permissions...")
    for directory in [media_root] + required_dirs:
        try:
            # Try to create a test file to check write permissions
            test_file = directory / '.permissions_test'
            with open(test_file, 'w') as f:
                f.write('test')
            os.remove(test_file)
            print(f"✓ Write permissions OK: {directory.relative_to(base_dir)}")
        except Exception as e:
            print(f"✗ No write permissions in {directory.relative_to(base_dir)}: {e}")
    
    # Create a sample .gitkeep file in each directory to ensure they're tracked in git
    print("\nCreating .gitkeep files...")
    for directory in required_dirs:
        gitkeep = directory / '.gitkeep'
        if not gitkeep.exists():
            try:
                gitkeep.touch()
                print(f"✓ Created {gitkeep.relative_to(base_dir)}")
            except Exception as e:
                print(f"✗ Failed to create {gitkeep.relative_to(base_dir)}: {e}")
    
    # Create a sample image file for testing if the gallery_media directory is empty
    gallery_media = media_root / 'gallery_media'
    if not any(gallery_media.iterdir()):
        try:
            # Create a simple SVG image as a placeholder
            sample_image = gallery_media / 'sample_image.svg'
            with open(sample_image, 'w') as f:
                f.write('''<?xml version="1.0" encoding="UTF-8"?>
<svg width="400" height="200" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#f0f0f0"/>
  <text x="50%" y="50%" font-family="Arial" font-size="24" text-anchor="middle" dominant-baseline="middle" fill="#666">
    Sample Gallery Image
  </text>
  <line x1="50" y1="100" x2="350" y2="100" stroke="#999" stroke-width="2"/>
  <text x="200" y="140" font-family="Arial" font-size="14" text-anchor="middle" fill="#999">
    400 × 200
  </text>
</svg>''')
            print(f"\n✓ Created sample image: {sample_image.relative_to(base_dir)}")
        except Exception as e:
            print(f"\n✗ Failed to create sample image: {e}")
    
    print("\nMedia directory setup complete!")
    print(f"Media root: {media_root.absolute()}")

if __name__ == "__main__":
    setup_media_directories()
