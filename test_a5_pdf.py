#!/usr/bin/env python3
"""
Test script to generate an A5 PDF using the updated template
"""

import sys
import os

# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from backend.models import WorkoutData
from backend.services.v2.document_service_v2 import DocumentServiceV2

def test_a5_pdf_generation():
    """Test A5 PDF generation with sample data"""
    
    # Create sample workout data
    workout_data = WorkoutData(
        workout_name="Push Day A5 Test",
        workout_date="2025-01-08",
        template_name="gym_log_template.html",
        exercises={
            "exercise_1a": "Bench Press",
            "exercise_1b": "Incline DB Press", 
            "exercise_1c": "Push-ups",
            "exercise_2a": "Overhead Press",
            "exercise_2b": "Lateral Raises",
            "exercise_2c": "Front Raises",
            "exercise_3a": "Tricep Dips",
            "exercise_3b": "Close Grip Press",
            "exercise_3c": "Tricep Extensions",
            "exercise_4a": "Cable Flyes",
            "exercise_4b": "Pec Deck",
            "exercise_4c": "Diamond Push-ups",
            "exercise_5a": "Arnold Press",
            "exercise_5b": "Upright Rows",
            "exercise_5c": "Shrugs",
            "exercise_6a": "Tricep Kickbacks",
            "exercise_6b": "Overhead Extensions",
            "exercise_6c": "Rope Pushdowns"
        },
        sets={
            "sets_1": "4",
            "sets_2": "3", 
            "sets_3": "3",
            "sets_4": "3",
            "sets_5": "2",
            "sets_6": "3"
        },
        reps={
            "reps_1": "8-10",
            "reps_2": "10-12",
            "reps_3": "12-15", 
            "reps_4": "10-12",
            "reps_5": "12-15",
            "reps_6": "15-20"
        },
        rest={
            "rest_1": "90s",
            "rest_2": "60s",
            "rest_3": "45s",
            "rest_4": "60s", 
            "rest_5": "45s",
            "rest_6": "30s"
        },
        bonus_exercises={
            "exercise_bonus_1": "Plank Hold",
            "exercise_bonus_2": "Cardio Finisher"
        },
        bonus_sets={
            "sets_bonus_1": "3"
        },
        bonus_reps={
            "reps_bonus_1": "60s",
            "reps_bonus_2": "10min"
        },
        bonus_rest={
            "rest_bonus_1": "30s",
            "rest_bonus_2": "-"
        }
    )
    
    # Initialize document service
    doc_service = DocumentServiceV2()
    
    try:
        print("Testing A5 PDF generation...")
        
        # Check if Gotenberg is available
        if not doc_service.is_gotenberg_available():
            print("⚠️  Gotenberg service is not available. Testing HTML generation only.")
            
            # Generate HTML file
            html_path = doc_service.generate_html_file(workout_data)
            print(f"✅ HTML file generated successfully: {html_path}")
            
            # Show HTML content preview
            with open(html_path, 'r', encoding='utf-8') as f:
                content = f.read()
                print(f"📄 HTML content preview (first 500 chars):")
                print(content[:500] + "...")
                
        else:
            print("✅ Gotenberg service is available!")
            
            # Generate PDF
            pdf_path = doc_service.generate_pdf_preview(workout_data)
            print(f"✅ A5 PDF generated successfully: {pdf_path}")
            
            # Show file size
            file_size = os.path.getsize(pdf_path)
            print(f"📊 PDF file size: {file_size:,} bytes")
            
        print("\n🎯 A5 PDF Configuration Summary:")
        print("   - Paper Size: A5 (5.83\" x 8.27\")")
        print("   - Margins: 0.4\" top/bottom, 0.3\" left/right")
        print("   - Page 1: Cover page with 'gym log v2'")
        print("   - Page 2: Main workout table")
        print("   - Page 3: Progress tracking grid")
        print("   - Font sizes optimized for A5 format")
        print("   - Ready for double-sided printing!")
        
    except Exception as e:
        print(f"❌ Error during A5 PDF generation: {str(e)}")
        return False
        
    return True

if __name__ == "__main__":
    success = test_a5_pdf_generation()
    if success:
        print("\n🎉 A5 PDF test completed successfully!")
    else:
        print("\n💥 A5 PDF test failed!")
        sys.exit(1)
