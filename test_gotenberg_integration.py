#!/usr/bin/env python3
"""
Test script to validate Gotenberg integration after Railway deployment.
This script tests the complete V2 system including PDF generation.
"""

import requests
import json
import os
import sys
from datetime import datetime

# Configuration
BASE_URL = os.getenv('GHOST_GYM_URL', 'http://localhost:8000')
GOTENBERG_URL = os.getenv('GOTENBERG_SERVICE_URL', '')

def print_header(title):
    print(f"\n🔍 {title}")
    print("=" * 50)

def print_success(message):
    print(f"✅ {message}")

def print_error(message):
    print(f"❌ {message}")

def print_info(message):
    print(f"ℹ️  {message}")

def test_v2_status():
    """Test V2 system status and Gotenberg availability"""
    print_header("Testing V2 System Status")
    
    try:
        response = requests.get(f"{BASE_URL}/api/v2/status", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print_success(f"V2 Status: {data.get('status', 'unknown')}")
            print_info(f"Version: {data.get('version', 'unknown')}")
            print_info(f"HTML Templates: {data.get('html_templates_available', False)}")
            print_info(f"Instant Preview: {data.get('instant_preview', False)}")
            
            gotenberg_available = data.get('gotenberg_available', False)
            if gotenberg_available:
                print_success(f"Gotenberg Available: {gotenberg_available}")
                print_info(f"Gotenberg URL: {data.get('gotenberg_url', 'Not specified')}")
                return True
            else:
                print_error(f"Gotenberg Available: {gotenberg_available}")
                print_info("PDF generation will not work without Gotenberg")
                return False
        else:
            print_error(f"Status check failed: {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print_error(f"Connection failed: {e}")
        return False

def test_html_preview():
    """Test HTML preview generation"""
    print_header("Testing HTML Preview")
    
    test_data = {
        "workout_name": "Gotenberg Test Workout",
        "workout_date": datetime.now().strftime("%Y-%m-%d"),
        "exercises": {
            "exercise-1a": "Bench Press",
            "exercise-1b": "Incline Dumbbell Press",
            "exercise-1c": "Push-ups",
            "exercise-2a": "Shoulder Press",
            "exercise-2b": "Lateral Raises",
            "exercise-2c": "Front Raises"
        },
        "bonus_exercises": {
            "exercise-bonus-1": "Face Pulls",
            "exercise-bonus-2": "Tricep Dips"
        }
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/v2/preview-html",
            json=test_data,
            timeout=15
        )
        
        if response.status_code == 200:
            html_content = response.text
            print_success(f"HTML Preview generated successfully!")
            print_info(f"HTML Length: {len(html_content)} characters")
            
            # Validate HTML content
            checks = [
                ("Workout Name", test_data["workout_name"] in html_content),
                ("Date", test_data["workout_date"] in html_content),
                ("Exercise", "Bench Press" in html_content),
                ("CSS Styles", "<style>" in html_content),
                ("Table Structure", "<table" in html_content)
            ]
            
            for check_name, check_result in checks:
                if check_result:
                    print_success(f"{check_name}: Found")
                else:
                    print_error(f"{check_name}: Missing")
            
            # Save HTML for inspection
            with open("test_gotenberg_output.html", "w", encoding="utf-8") as f:
                f.write(html_content)
            print_info("HTML saved to test_gotenberg_output.html")
            
            return True
        else:
            print_error(f"HTML preview failed: {response.status_code}")
            try:
                error_data = response.json()
                print_error(f"Error: {error_data}")
            except:
                print_error(f"Response: {response.text[:200]}...")
            return False
            
    except requests.exceptions.RequestException as e:
        print_error(f"Request failed: {e}")
        return False

def test_pdf_generation():
    """Test PDF generation via Gotenberg"""
    print_header("Testing PDF Generation")
    
    test_data = {
        "workout_name": "PDF Test Workout",
        "workout_date": datetime.now().strftime("%Y-%m-%d"),
        "exercises": {
            "exercise-1a": "Deadlift",
            "exercise-1b": "Romanian Deadlift",
            "exercise-1c": "Sumo Deadlift",
            "exercise-2a": "Barbell Row",
            "exercise-2b": "T-Bar Row",
            "exercise-2c": "Cable Row"
        },
        "bonus_exercises": {
            "exercise-bonus-1": "Bicep Curls",
            "exercise-bonus-2": "Hammer Curls"
        }
    }
    
    try:
        # Test PDF preview first
        print_info("Testing PDF preview...")
        response = requests.post(
            f"{BASE_URL}/api/v2/preview-pdf",
            json=test_data,
            timeout=30
        )
        
        if response.status_code == 200:
            print_success("PDF preview generated successfully!")
            print_info(f"PDF Size: {len(response.content)} bytes")
            
            # Save PDF for inspection
            with open("test_gotenberg_output.pdf", "wb") as f:
                f.write(response.content)
            print_info("PDF saved to test_gotenberg_output.pdf")
            
            # Test PDF download endpoint
            print_info("Testing PDF download...")
            response = requests.post(
                f"{BASE_URL}/api/v2/generate-pdf",
                json=test_data,
                timeout=30
            )
            
            if response.status_code == 200:
                print_success("PDF download endpoint working!")
                return True
            else:
                print_error(f"PDF download failed: {response.status_code}")
                return False
                
        else:
            print_error(f"PDF generation failed: {response.status_code}")
            try:
                error_data = response.json()
                print_error(f"Error: {error_data}")
            except:
                print_error(f"Response: {response.text[:200]}...")
            return False
            
    except requests.exceptions.RequestException as e:
        print_error(f"Request failed: {e}")
        return False

def test_performance():
    """Test system performance"""
    print_header("Testing Performance")
    
    test_data = {
        "workout_name": "Performance Test",
        "workout_date": datetime.now().strftime("%Y-%m-%d"),
        "exercises": {f"exercise-{i}a": f"Exercise {i}A" for i in range(1, 7)},
        "bonus_exercises": {"exercise-bonus-1": "Bonus 1", "exercise-bonus-2": "Bonus 2"}
    }
    
    # Test HTML generation speed
    try:
        start_time = datetime.now()
        response = requests.post(f"{BASE_URL}/api/v2/preview-html", json=test_data, timeout=10)
        html_time = (datetime.now() - start_time).total_seconds()
        
        if response.status_code == 200:
            print_success(f"HTML Generation: {html_time:.2f} seconds")
        else:
            print_error(f"HTML generation failed: {response.status_code}")
            
    except Exception as e:
        print_error(f"HTML performance test failed: {e}")
    
    # Test PDF generation speed (if Gotenberg is available)
    if GOTENBERG_URL:
        try:
            start_time = datetime.now()
            response = requests.post(f"{BASE_URL}/api/v2/preview-pdf", json=test_data, timeout=30)
            pdf_time = (datetime.now() - start_time).total_seconds()
            
            if response.status_code == 200:
                print_success(f"PDF Generation: {pdf_time:.2f} seconds")
            else:
                print_error(f"PDF generation failed: {response.status_code}")
                
        except Exception as e:
            print_error(f"PDF performance test failed: {e}")

def main():
    """Run all tests"""
    print("🚀 Ghost Gym V2 + Gotenberg Integration Test")
    print("=" * 60)
    print_info(f"Testing URL: {BASE_URL}")
    print_info(f"Gotenberg URL: {GOTENBERG_URL or 'Not configured'}")
    
    results = []
    
    # Run tests
    results.append(("V2 Status", test_v2_status()))
    results.append(("HTML Preview", test_html_preview()))
    
    # Only test PDF if Gotenberg URL is configured
    if GOTENBERG_URL:
        results.append(("PDF Generation", test_pdf_generation()))
    else:
        print_info("Skipping PDF tests - GOTENBERG_SERVICE_URL not configured")
    
    test_performance()
    
    # Summary
    print_header("Test Results Summary")
    passed = 0
    total = len(results)
    
    for test_name, result in results:
        if result:
            print_success(f"{test_name}: PASS")
            passed += 1
        else:
            print_error(f"{test_name}: FAIL")
    
    print(f"\n📊 Results: {passed}/{total} tests passed")
    
    if passed == total:
        print_success("🎉 All tests passed! V2 system is ready for production.")
        return 0
    else:
        print_error("⚠️  Some tests failed. Check the output above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
