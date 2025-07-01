from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
import os
from pathlib import Path
from .models import WorkoutData
from .services.document_service import DocumentService

# Initialize FastAPI app
app = FastAPI(
    title="Gym Log Template Editor API",
    description="API for generating customized gym log documents from templates",
    version="1.0.0"
)

# Add CORS middleware for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize document service
document_service = DocumentService()

# Create necessary directories
os.makedirs("backend/uploads", exist_ok=True)
os.makedirs("templates", exist_ok=True)

# Mount static files (frontend)
app.mount("/static", StaticFiles(directory="frontend"), name="static")

@app.get("/", response_class=HTMLResponse)
async def serve_frontend():
    """Serve the main frontend page"""
    try:
        with open("frontend/index.html", "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    except FileNotFoundError:
        return HTMLResponse(
            content="<h1>Frontend not found</h1><p>Please ensure frontend/index.html exists</p>",
            status_code=404
        )

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "message": "Gym Log API is running"}

@app.get("/api/templates")
async def list_templates():
    """List available Word document templates"""
    try:
        templates_dir = Path("templates")
        if not templates_dir.exists():
            return {"templates": [], "message": "Templates directory not found"}
        
        # Find all .docx files in templates directory
        template_files = [
            f.name for f in templates_dir.glob("*.docx") 
            if not f.name.startswith("~")  # Exclude temp files
        ]
        
        return {
            "templates": template_files,
            "count": len(template_files)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing templates: {str(e)}")

@app.post("/api/generate")
async def generate_document(workout_data: WorkoutData):
    """Generate a filled Word document from template and workout data"""
    try:
        # Validate template exists
        template_path = Path("templates") / workout_data.template_name
        if not template_path.exists():
            raise HTTPException(
                status_code=404, 
                detail=f"Template '{workout_data.template_name}' not found"
            )
        
        # Generate the document
        output_path = document_service.generate_document(workout_data, template_path)
        
        # Return the file for download
        filename = f"gym_log_{workout_data.workout_name.replace(' ', '_')}_{workout_data.workout_date}.docx"
        
        return FileResponse(
            path=output_path,
            filename=filename,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating document: {str(e)}")

@app.post("/api/upload-template")
async def upload_template(file: UploadFile = File(...)):
    """Upload a new template file (future feature)"""
    if not file.filename.endswith('.docx'):
        raise HTTPException(status_code=400, detail="Only .docx files are allowed")
    
    try:
        # Save uploaded file to templates directory
        template_path = Path("templates") / file.filename
        
        with open(template_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        return {
            "message": f"Template '{file.filename}' uploaded successfully",
            "filename": file.filename
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading template: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
