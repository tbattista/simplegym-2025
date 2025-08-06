# Ghost Gym - Log Book - Project Plan

## Overview
A web-based gym log template editor that allows users to fill in workout details and generate customized Word documents from templates. Part of the Ghost Gym series of fitness web applications. Built with a FastAPI backend and mobile-responsive frontend.

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework with automatic API documentation
- **python-docx** - Word document manipulation library
- **uvicorn** - ASGI server for development and production
- **Pydantic** - Data validation and serialization

### Frontend
- **HTML5/CSS3/JavaScript** - Core web technologies
- **Bootstrap 5** - Mobile-responsive CSS framework
- **Vanilla JavaScript** - No framework dependencies, lightweight

### File Handling
- Local file system storage
- Temporary uploads directory
- Direct file download via browser

## Project Structure

```
simplegym_2025/
├── PROJECT_PLAN.md          # This plan document
├── README.md                # Setup and usage instructions
├── requirements.txt         # Python dependencies
├── run.py                   # Development server launcher
├── backend/
│   ├── main.py              # FastAPI application entry point
│   ├── models.py            # Pydantic data models for API
│   ├── services/
│   │   ├── __init__.py
│   │   └── document_service.py  # Word document processing logic
│   ├── static/              # Static file serving (frontend)
│   └── uploads/             # Temporary file storage
├── frontend/
│   ├── index.html           # Main user interface
│   ├── css/
│   │   └── style.css        # Custom styles and responsive design
│   ├── js/
│   │   └── app.js           # Frontend application logic
│   └── assets/              # Images, icons, etc.
└── templates/               # Word document templates
    ├── master_doc.docx      # Main template (existing)
    ├── master_doc-test.docx # Test template (existing)
    └── master_doc_og.docx   # Original template (existing)
```

## API Design

### Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/` | Serve main frontend page | - | HTML page |
| GET | `/api/templates` | List available templates | - | `{"templates": ["name1", "name2"]}` |
| POST | `/api/generate` | Generate filled document | WorkoutData JSON | File download |
| GET | `/api/health` | Health check endpoint | - | `{"status": "healthy"}` |
| POST | `/api/upload-template` | Upload new template (future) | File upload | Success/error |

### Data Models

```python
class WorkoutData(BaseModel):
    workout_name: str
    workout_date: str
    template_name: str
    exercises: Dict[str, str]  # e.g., {"exercise-1a": "Bench Press"}
    bonus_exercises: Dict[str, str]  # e.g., {"exercise-bonus-1": "Face Pulls"}
```

## Development Phases

### Phase 1: Core Backend (Priority 1) ✅ COMPLETED
- [x] Plan architecture
- [x] Setup FastAPI application
- [x] Create data models
- [x] Implement document processing service
- [x] Create API endpoints
- [x] Test document generation

### Phase 2: Frontend Interface (Priority 1) ✅ COMPLETED
- [x] Create responsive HTML structure
- [x] Implement Bootstrap styling
- [x] Build exercise form with 6 groups
- [x] Add bonus exercises section
- [x] Implement JavaScript API calls
- [x] Handle file downloads

### Phase 3: Integration & Testing (Priority 2) ✅ COMPLETED
- [x] End-to-end testing
- [x] Error handling and validation
- [x] UI/UX improvements
- [x] Template variable replacement fixes
- [x] Mobile device testing

### Phase 4: Deployment Ready (Priority 3) ✅ COMPLETED
- [x] Production configuration
- [x] Environment variables
- [x] Git repository setup
- [x] Complete documentation

## Key Features

### Core Functionality
- ✅ Template selection from existing Word documents
- ✅ Mobile-responsive form interface
- ✅ Exercise input for 6 groups (1a, 1b, 1c format)
- ✅ Bonus exercises section
- ✅ Date picker for workout date
- ✅ One-click document generation
- ✅ Automatic file download

### User Experience
- Clean, intuitive interface
- Mobile-first responsive design
- Real-time form validation
- Loading states and feedback
- Error handling with user-friendly messages

### Technical Features
- RESTful API design
- Automatic API documentation (FastAPI)
- CORS support for development
- File upload/download handling
- Template variable replacement

## Template Variables

Based on existing Word documents, the following variables will be replaced:

### Basic Info
- `{{ workout_name }}` - User-defined workout name
- `today's date:` - Will be replaced with formatted date

### Exercise Groups (1-6)
- `{{ exercise-1a }}`, `{{ exercise-1b }}`, `{{ exercise-1c }}`
- `{{ exercise-2a }}`, `{{ exercise-2b }}`, `{{ exercise-2c }}`
- ... (continuing through exercise-6c)

### Bonus Exercises
- `{{ exercise-bonus-1 }}` - First bonus exercise
- `{{ exercise-bonus-2 }}` - Second bonus exercise

## Development Setup

### Prerequisites
- Python 3.8+
- pip package manager
- Modern web browser

### Installation
```bash
# Clone/navigate to project directory
cd simplegym_2025

# Install Python dependencies
pip install -r requirements.txt

# Run development server
python run.py
```

### Development Workflow
1. Backend changes: FastAPI auto-reloads on file changes
2. Frontend changes: Served statically, refresh browser
3. Template changes: Place in templates/ directory

## Deployment Considerations

### Local Development
- Single command startup (`python run.py`)
- Hot reload for development
- CORS enabled for frontend/backend communication

### Production Options
- **Simple**: Run uvicorn directly
- **Docker**: Containerized deployment
- **Cloud**: Deploy to Heroku, Railway, or similar

## Risk Assessment & Mitigation

### Low Risk
- ✅ FastAPI is mature and well-documented
- ✅ python-docx is stable and widely used
- ✅ Bootstrap provides reliable responsive design
- ✅ Vanilla JavaScript avoids framework complexity

### Medium Risk
- ⚠️ File handling in browsers (mitigated by proper MIME types)
- ⚠️ Large document processing (mitigated by async handling)

### Mitigation Strategies
- Comprehensive error handling
- File size limits
- Input validation
- Graceful degradation

## Success Criteria

### Minimum Viable Product (MVP)
- [ ] User can select a template
- [ ] User can fill in workout details
- [ ] User can generate and download filled document
- [ ] Interface works on mobile devices

### Full Feature Set
- [ ] All template variables are replaceable
- [ ] Clean, professional UI
- [ ] Fast document generation (<5 seconds)
- [ ] Error handling for edge cases
- [ ] Cross-browser compatibility

## Timeline Estimate

- **Day 1**: Backend setup and core API (4-6 hours)
- **Day 2**: Frontend interface and integration (4-6 hours)
- **Day 3**: Testing, polish, and documentation (2-4 hours)

**Total Estimated Time**: 10-16 hours over 3 days

## Confidence Level: 95%

This plan uses proven technologies and established patterns. The architecture is simple enough to implement quickly while being extensible for future enhancements.
