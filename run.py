#!/usr/bin/env python3
"""
Development server launcher for Gym Log Template Editor
"""

import uvicorn
import os
import sys
from pathlib import Path

def main():
    """Launch the development server"""
    
    # Ensure we're in the correct directory
    project_root = Path(__file__).parent
    os.chdir(project_root)
    
    # Check if required directories exist
    required_dirs = ['backend', 'frontend', 'templates']
    for dir_name in required_dirs:
        if not Path(dir_name).exists():
            print(f"Error: Required directory '{dir_name}' not found!")
            print(f"Please ensure you're running this from the project root directory.")
            sys.exit(1)
    
    # Check if templates exist
    templates_dir = Path('templates')
    template_files = list(templates_dir.glob('*.docx'))
    if not template_files:
        print("Warning: No .docx template files found in the templates/ directory.")
        print("Please add your Word document templates to the templates/ folder.")
    else:
        print(f"Found {len(template_files)} template(s):")
        for template in template_files:
            print(f"  - {template.name}")
    
    print("\n" + "="*60)
    print("🏋️  GYM LOG TEMPLATE EDITOR - DEVELOPMENT SERVER")
    print("="*60)
    print(f"📁 Project Directory: {project_root}")
    print(f"🌐 Server URL: http://localhost:8000")
    print(f"📚 API Documentation: http://localhost:8000/docs")
    print(f"🔄 Auto-reload: Enabled")
    print("="*60)
    print("\n🚀 Starting server...")
    print("💡 Press Ctrl+C to stop the server")
    print("\n")
    
    try:
        # Launch the FastAPI server with uvicorn
        uvicorn.run(
            "backend.main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            reload_dirs=["backend", "frontend"],
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n\n🛑 Server stopped by user")
    except Exception as e:
        print(f"\n❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
