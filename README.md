# 👻 Ghost Gym - Log Book V2

A modern web-based application for creating personalized gym workout logs with dual-system support. Part of the Ghost Gym series of fitness web applications. Built with FastAPI backend, responsive frontend, and cloud-based PDF generation.

## ✨ Features

### V2 System (HTML + PDF Generation)
- **🚀 Instant HTML Preview** - Real-time HTML generation with no delays
- **📄 Professional PDF Generation** - Cloud-based PDF conversion via Gotenberg
- **⚡ Lightning Fast** - HTML templates render instantly
- **🎨 Print-Optimized Design** - Perfect formatting for 8.5" x 11" documents
- **☁️ Cloud-Powered** - Gotenberg service deployed on Railway for reliable PDF generation

### V1 System (Word Document Processing)
- **📄 Word Document Processing** - Fill in Word templates with workout data
- **🔄 Clean Output** - Professional Word documents with no template artifacts

### Universal Features
- **📱 Mobile-Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **🎯 Complete Exercise Management** - 6 exercise groups with 3 exercises each (1a, 1b, 1c format)
- **📊 Sets, Reps & Rest** - Full workout parameter inputs for each exercise group
- **⭐ Bonus Exercises** - Additional exercises section with complete data
- **👁️ Live Preview** - Preview all changes before generating documents
- **⌨️ Keyboard Shortcuts** - Ctrl+Enter to generate, Ctrl+P for preview
- **🎨 Modern UI** - Bootstrap 5 with custom styling and animations

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- pip package manager
- Modern web browser

### Installation

1. **Clone or download the project**
   ```bash
   cd simplegym_2025
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Add your Word templates**
   - Place your `.docx` template files in the `templates/` directory
   - Templates should contain variables like `{{ workout_name }}`, `{{ exercise-1a }}`, etc.

4. **Start the development server**
   ```bash
   python run.py
   ```

5. **Open your browser**
   - Navigate to: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## 📁 Project Structure

```
simplegym_2025/
├── README.md                # This file
├── CHANGELOG.md             # Version history and updates
├── requirements.txt         # Python dependencies
├── run.py                   # Development server launcher
├── test_v2.py              # V2 system test suite
├── Dockerfile              # Container configuration
├── Procfile                # Railway deployment config
├── railway.toml            # Railway service configuration
├── backend/                # FastAPI backend
│   ├── main.py             # API endpoints (V1 + V2)
│   ├── models.py           # Data models and validation
│   ├── services/           # Business logic
│   │   ├── __init__.py
│   │   ├── document_service.py     # V1: Word document processing
│   │   └── v2/                     # V2 system
│   │       ├── __init__.py
│   │       ├── document_service_v2.py  # V2: HTML/PDF processing
│   │       └── gotenberg_client.py     # Gotenberg integration
│   ├── templates/          # V2 HTML templates
│   │   └── html/
│   │       └── gym_log_template.html   # V2 HTML template
│   └── uploads/            # Generated files storage
├── frontend/               # Web interface
│   ├── index.html          # Main application page
│   ├── css/
│   │   └── style.css       # Custom styles and responsive design
│   └── js/
│       └── app.js          # Frontend application logic
├── gotenberg-service/      # Gotenberg deployment (Railway)
│   ├── Dockerfile          # Gotenberg container
│   ├── railway.toml        # Gotenberg service config
│   ├── deploy.sh           # Deployment script (Unix)
│   ├── deploy.ps1          # Deployment script (Windows)
│   └── README.md           # Gotenberg service documentation
└── templates/              # V1 Word document templates
    ├── master_doc.docx     # Main template
    ├── master_doc-test.docx # Test template
    └── master_doc_og.docx  # Original template
```

## 🎯 Usage

### Creating a Workout Log

1. **Select Template** - Choose from available Word document templates
2. **Enter Workout Details** - Add workout name and date
3. **Fill Exercise Groups** - Complete the 6 exercise groups (1a-6c)
4. **Add Bonus Exercises** - Optional additional exercises
5. **Preview** - Review changes before generating (Ctrl+P)
6. **Generate** - Create and download your personalized document (Ctrl+Enter)

### Template Variables

Your Word documents should include these variables for replacement:

#### Basic Information
- `{{ workout_name }}` - Workout name (e.g., "Push Day")
- `today's date:` - Will be replaced with selected date

#### Exercise Groups (1-6)
- `{{ exercise-1a }}`, `{{ exercise-1b }}`, `{{ exercise-1c }}`
- `{{ exercise-2a }}`, `{{ exercise-2b }}`, `{{ exercise-2c }}`
- ... continuing through `{{ exercise-6a }}`, `{{ exercise-6b }}`, `{{ exercise-6c }}`

#### Bonus Exercises
- `{{ exercise-bonus-1 }}` - First bonus exercise
- `{{ exercise-bonus-2 }}` - Second bonus exercise

### Example Template Content

```
{{ workout_name }}
today's date: 

Exercise Group 1:
a) {{ exercise-1a }}
b) {{ exercise-1b }}
c) {{ exercise-1c }}

Bonus Exercises:
{{ exercise-bonus-1 }}
{{ exercise-bonus-2 }}
```

## 🔧 API Endpoints

### V1 Endpoints (Word Documents)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Serve main web interface |
| GET | `/api/health` | Health check |
| GET | `/api/templates` | List available Word templates |
| POST | `/api/preview` | Generate PDF preview from Word template |
| POST | `/api/generate` | Generate filled Word document |
| POST | `/api/upload-template` | Upload new template (future) |

### V2 Endpoints (HTML + PDF)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v2/status` | V2 system status and Gotenberg availability |
| POST | `/api/v2/preview-html` | Generate instant HTML preview |
| POST | `/api/v2/preview-pdf` | Generate PDF preview via Gotenberg |
| POST | `/api/v2/generate-html` | Generate and download HTML file |
| POST | `/api/v2/generate-pdf` | Generate and download PDF file |
| GET | `/api/v2/template-info` | Get HTML template information |

## 🛠️ Development

### Running in Development Mode

```bash
python run.py
```

This starts the server with:
- Auto-reload on file changes
- Debug logging
- CORS enabled for development
- Serves frontend at root path

### Adding New Templates

1. Create a Word document with template variables
2. Save as `.docx` format
3. Place in the `templates/` directory
4. Restart the server (or it will auto-detect)

### Customizing Exercise Defaults

Edit the `exerciseDefaults` object in `frontend/js/app.js`:

```javascript
this.exerciseDefaults = {
    '1a': 'Your Exercise', '1b': 'Another Exercise', '1c': 'Third Exercise',
    // ... customize as needed
};
```

## 📱 Mobile Support

The application is fully responsive and optimized for mobile devices:

- Touch-friendly interface
- Optimized form layouts
- Mobile-specific styling
- Gesture support for modals

## ⌨️ Keyboard Shortcuts

- **Ctrl+Enter** - Generate and download document
- **Ctrl+P** - Show preview modal
- **Escape** - Close open modals

## 🔒 Security Considerations

### Development
- CORS is enabled for all origins
- No authentication required
- Files stored locally

### Production Recommendations
- Configure specific CORS origins
- Add authentication if needed
- Use HTTPS
- Implement file cleanup
- Add rate limiting

## 🚀 Deployment

### Local Production

```bash
# Install dependencies
pip install -r requirements.txt

# Run with production settings
uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

### Docker (Optional)

```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Cloud Deployment

The application can be deployed to:
- **Railway** - **RECOMMENDED** - See `RAILWAY_DEPLOYMENT_GUIDE.md` for complete instructions
- **Heroku** - Add `Procfile`: `web: uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
- **DigitalOcean App Platform** - Container or buildpack deployment
- **AWS/GCP/Azure** - Container services

For detailed Railway deployment instructions (recommended platform), see the comprehensive `RAILWAY_DEPLOYMENT_GUIDE.md`.

#### Why Railway?
Railway is the recommended platform because it:
- **Native FastAPI Support** - No WSGI wrappers needed
- **Full Feature Support** - All endpoints including `/docs` and PDF preview work perfectly
- **Automatic HTTPS** - Free SSL certificates
- **Git Integration** - Automatic deployments from your repository
- **Real-time Monitoring** - Built-in logs and metrics

## 🐛 Troubleshooting

### Common Issues

**Templates not loading**
- Ensure `.docx` files are in `templates/` directory
- Check file permissions
- Restart the server

**Document generation fails**
- Verify template variables match expected format
- Check Word document isn't corrupted
- Ensure python-docx is installed

**Frontend not loading**
- Check if server is running on port 8000
- Verify `frontend/` directory exists
- Check browser console for errors

**Mobile display issues**
- Clear browser cache
- Check viewport meta tag
- Verify Bootstrap CSS is loading

### Debug Mode

Add debug logging by setting environment variable:
```bash
export LOG_LEVEL=DEBUG
python run.py
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source. See the project files for details.

## 🙏 Acknowledgments

- **FastAPI** - Modern Python web framework
- **Bootstrap** - Responsive CSS framework
- **python-docx** - Word document processing
- **Bootstrap Icons** - Icon library

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the project plan in `PROJECT_PLAN.md`
3. Check the API documentation at `/docs`
4. Create an issue in the project repository

---

**Built with ❤️ for fitness enthusiasts who love organized workout tracking!**
