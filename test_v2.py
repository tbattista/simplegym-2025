#!/usr/bin/env python3
"""
Test script for V2 HTML generation
"""

import requests
import json

# Test data - same format as the frontend sends
test_workout_data = {
    "workout_name": "Push Day",
    "workout_date": "2025-01-07",
    "template_name": "master_doc.docx",  # This won't be used in V2 but required by model
    "exercises": {
        "exercise-1a": "Bench Press",
        "exercise-1b": "Incline Press", 
        "exercise-1c": "Flyes",
        "exercise-2a": "Squats",
        "exercise-2b": "Leg Press",
        "exercise-2c": "Lunges"
    },
    "sets": {
        "sets-1": "3",
        "sets-2": "4"
    },
    "reps": {
        "reps-1": "8-12",
        "reps-2": "10-15"
    },
    "rest": {
        "rest-1": "60s",
        "rest-2": "90s"
    },
    "bonus_exercises": {
        "exercise-bonus-1": "Push-ups",
        "exercise-bonus-2": "Planks"
    },
    "bonus_sets": {
        "sets-bonus-1": "2"
    },
    "bonus_reps": {
        "reps-bonus-1": "15-20",
        "reps-bonus-2": "30s hold"
    },
    "bonus_rest": {
        "rest_bonus-1": "45s",
        "rest_bonus-2": "60s"
    }
}

def test_v2_status():
    """Test V2 status endpoint"""
    print("🔍 Testing V2 Status...")
    try:
        response = requests.get("http://localhost:8000/api/v2/status")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ V2 Status: {data['status']}")
            print(f"📄 HTML Templates: {data['features']['html_templates']}")
            print(f"📋 Instant Preview: {data['features']['instant_preview']}")
            print(f"📄 PDF Generation: {data['features']['pdf_generation']}")
            return True
        else:
            print(f"❌ Status check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error testing status: {e}")
        return False

def test_html_preview():
    """Test HTML preview generation"""
    print("\n🔍 Testing HTML Preview...")
    try:
        response = requests.post(
            "http://localhost:8000/api/v2/preview-html",
            json=test_workout_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            html_content = response.text
            print("✅ HTML Preview generated successfully!")
            print(f"📏 HTML Length: {len(html_content)} characters")
            
            # Check if key elements are present
            checks = [
                ("Workout Name", "Push Day" in html_content),
                ("Date", "2025-01-07" in html_content),
                ("Exercise", "Bench Press" in html_content),
                ("Sets", "3" in html_content),
                ("CSS Styles", "<style>" in html_content),
                ("Table Structure", "<table" in html_content)
            ]
            
            for check_name, result in checks:
                status = "✅" if result else "❌"
                print(f"  {status} {check_name}: {'Found' if result else 'Missing'}")
            
            # Save HTML for inspection
            with open("test_output.html", "w", encoding="utf-8") as f:
                f.write(html_content)
            print("💾 HTML saved to test_output.html")
            
            return True
        else:
            print(f"❌ HTML preview failed: {response.status_code}")
            print(f"Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing HTML preview: {e}")
        return False

def test_template_info():
    """Test template info endpoint"""
    print("\n🔍 Testing Template Info...")
    try:
        response = requests.get("http://localhost:8000/api/v2/template-info")
        if response.status_code == 200:
            data = response.json()
            print("✅ Template info retrieved successfully!")
            print(f"📄 Template: {data['template_name']}")
            print(f"🔧 Type: {data['template_type']}")
            print(f"📋 Version: {data['version']}")
            print(f"🏷️  Variables found: {len(data['template_variables'])}")
            return True
        else:
            print(f"❌ Template info failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error testing template info: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Testing V2 System")
    print("=" * 50)
    
    # Run tests
    status_ok = test_v2_status()
    html_ok = test_html_preview()
    template_ok = test_template_info()
    
    print("\n" + "=" * 50)
    print("📊 Test Results:")
    print(f"  Status Endpoint: {'✅ PASS' if status_ok else '❌ FAIL'}")
    print(f"  HTML Preview: {'✅ PASS' if html_ok else '❌ FAIL'}")
    print(f"  Template Info: {'✅ PASS' if template_ok else '❌ FAIL'}")
    
    if all([status_ok, html_ok, template_ok]):
        print("\n🎉 All V2 tests passed! System is ready.")
    else:
        print("\n⚠️  Some tests failed. Check the output above.")
