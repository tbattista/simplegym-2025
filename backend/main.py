from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
import os
from pathlib import Path
from .models import WorkoutData
from .services.document_service import DocumentService
from .services.v2.document_service_v2 import DocumentServiceV2

# Initialize FastAPI app
app = FastAPI(
    title="Ghost Gym - Log Book API",
    description="API for generating customized gym log documents from templates. Part of the Ghost Gym series.",
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

# Initialize document services
document_service = DocumentService()  # V1 service
document_service_v2 = DocumentServiceV2()  # V2 service

# Create necessary directories
os.makedirs("backend/uploads", exist_ok=True)
os.makedirs("templates", exist_ok=True)

# Mount static files (frontend)
app.mount("/static", StaticFiles(directory="frontend"), name="static")

@app.get("/", response_class=HTMLResponse)
async def serve_frontend():
    """Serve the main frontend page (V1)"""
    try:
        with open("frontend/index.html", "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    except FileNotFoundError:
        return HTMLResponse(
            content="<h1>Frontend not found</h1><p>Please ensure frontend/index.html exists</p>",
            status_code=404
        )

@app.get("/v2", response_class=HTMLResponse)
async def serve_v2_frontend():
    """Serve the V2 frontend page"""
    try:
        with open("frontend/v2-index.html", "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    except FileNotFoundError:
        return HTMLResponse(
            content="<h1>V2 Frontend not found</h1><p>Please ensure frontend/v2-index.html exists</p>",
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

@app.post("/api/preview")
async def preview_document(workout_data: WorkoutData):
    """Generate a PDF preview of the filled document"""
    try:
        # Validate template exists
        template_path = Path("templates") / workout_data.template_name
        if not template_path.exists():
            raise HTTPException(
                status_code=404, 
                detail=f"Template '{workout_data.template_name}' not found"
            )
        
        # Generate the PDF preview
        pdf_path = document_service.generate_preview_pdf(workout_data, template_path)
        
        # Return the PDF for viewing
        return FileResponse(
            path=pdf_path,
            media_type="application/pdf",
            headers={"Content-Disposition": "inline"}  # Display in browser instead of download
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating preview: {str(e)}")

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

# V2 API Endpoints
@app.get("/api/v2/status")
async def v2_status():
    """Get V2 system status including Gotenberg availability"""
    try:
        gotenberg_available = document_service_v2.is_gotenberg_available()
        return {
            "version": "v2",
            "status": "available",
            "gotenberg_available": gotenberg_available,
            "features": {
                "html_templates": True,
                "pdf_generation": gotenberg_available,
                "instant_preview": True
            }
        }
    except Exception as e:
        return {
            "version": "v2",
            "status": "error",
            "error": str(e),
            "gotenberg_available": False
        }

@app.get("/api/v2/templates")
async def list_templates_v2():
    """List available HTML templates for V2"""
    try:
        templates_dir = Path("backend/templates/html")
        if not templates_dir.exists():
            return {"templates": [], "message": "HTML templates directory not found"}
        
        # Find all .html files in templates directory
        template_files = [
            f.name for f in templates_dir.glob("*.html") 
            if not f.name.startswith("~")  # Exclude temp files
        ]
        
        return {
            "templates": template_files,
            "count": len(template_files),
            "version": "v2",
            "template_type": "html"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing V2 templates: {str(e)}")

@app.post("/api/v2/preview-html")
async def preview_html_v2(workout_data: WorkoutData):
    """Generate HTML preview (instant, no PDF conversion)"""
    try:
        # Generate HTML content
        html_content = document_service_v2.generate_html_document(workout_data)
        
        # Return HTML content directly
        return HTMLResponse(content=html_content)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating HTML preview: {str(e)}")

@app.post("/api/v2/preview-pdf")
async def preview_pdf_v2(workout_data: WorkoutData):
    """Generate PDF preview using Gotenberg (V2 system)"""
    try:
        # Check if Gotenberg is available
        if not document_service_v2.is_gotenberg_available():
            raise HTTPException(
                status_code=503,
                detail="PDF generation is not available. Gotenberg service is not running."
            )
        
        # Generate PDF preview
        pdf_path = document_service_v2.generate_pdf_preview(workout_data)
        
        # Return the PDF for viewing
        return FileResponse(
            path=pdf_path,
            media_type="application/pdf",
            headers={"Content-Disposition": "inline"}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating PDF preview: {str(e)}")

@app.post("/api/v2/generate-html")
async def generate_html_v2(workout_data: WorkoutData):
    """Generate and download HTML file"""
    try:
        # Generate HTML file
        html_path = document_service_v2.generate_html_file(workout_data)
        
        # Return the file for download
        filename = f"gym_log_{workout_data.workout_name.replace(' ', '_')}_{workout_data.workout_date}.html"
        
        return FileResponse(
            path=html_path,
            filename=filename,
            media_type="text/html"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating HTML document: {str(e)}")

@app.post("/api/v2/generate-pdf")
async def generate_pdf_v2(workout_data: WorkoutData):
    """Generate and download PDF file using Gotenberg"""
    try:
        # Check if Gotenberg is available
        if not document_service_v2.is_gotenberg_available():
            raise HTTPException(
                status_code=503,
                detail="PDF generation is not available. Gotenberg service is not running."
            )
        
        # Generate PDF file
        pdf_path = document_service_v2.generate_pdf_preview(workout_data)
        
        # Return the file for download
        filename = f"gym_log_{workout_data.workout_name.replace(' ', '_')}_{workout_data.workout_date}.pdf"
        
        return FileResponse(
            path=pdf_path,
            filename=filename,
            media_type="application/pdf"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating PDF document: {str(e)}")

@app.get("/api/v2/template-info")
async def get_template_info_v2():
    """Get information about the V2 HTML template"""
    try:
        template_info = document_service_v2.get_template_info()
        return template_info
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting template info: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
