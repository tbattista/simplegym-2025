# V2 Frontend/Backend Connection Debug Prompt

## Current Status
✅ **V1 Application**: Working correctly on Railway at https://simplegym-v2-production.up.railway.app
✅ **Backend API**: Responding correctly (templates endpoint working)
✅ **Gotenberg Service**: Deployed separately at https://simplegym-gotenberg-production.up.railway.app

## Issue to Debug
The V2 frontend/backend connection needs verification and potential fixes.

## Debug Steps Needed

### 1. Test V2 Frontend Access
- Navigate to: https://simplegym-v2-production.up.railway.app/v2
- Check if V2 interface loads correctly
- Verify browser console for any JavaScript errors
- Check network tab for failed API calls

### 2. Test V2 API Endpoints
Test these V2 endpoints directly:
- `GET /api/v2/status` - Should return service status
- `GET /api/v2/templates` - Should return available templates
- `POST /api/v2/generate` - Should accept workout data and return PDF

### 3. Check V2 Frontend JavaScript
Verify `frontend/js/v2/app-v2.js`:
- API base URL configuration
- Error handling for API calls
- Form submission logic
- PDF generation workflow

### 4. Verify Backend V2 Routes
Check `backend/main.py`:
- V2 routes are properly registered
- CORS settings allow frontend requests
- Static file serving for V2 assets

### 5. Test Gotenberg Integration
- Verify GOTENBERG_URL environment variable is set correctly
- Test connection from V2 backend to Gotenberg service
- Check Gotenberg service logs for any errors

## Key Files to Examine

### Frontend V2
- `frontend/v2-index.html` - V2 interface structure
- `frontend/js/v2/app-v2.js` - V2 JavaScript logic
- `frontend/css/v2/style-v2.css` - V2 styling

### Backend V2
- `backend/services/v2/document_service_v2.py` - V2 document generation
- `backend/services/v2/gotenberg_client.py` - Gotenberg integration
- `backend/main.py` - V2 route registration

### Configuration
- `railway.toml` - Environment variables
- `backend/services/v2/gotenberg_client.py` - Gotenberg URL configuration

## Expected Behavior
1. V2 frontend should load at `/v2` endpoint
2. Form submission should call V2 API endpoints
3. V2 backend should generate HTML from template
4. V2 backend should call Gotenberg to convert HTML to PDF
5. PDF should be returned to user for download

## Common Issues to Check
1. **CORS Issues**: Frontend can't call backend APIs
2. **Environment Variables**: GOTENBERG_URL not set correctly
3. **Static File Serving**: V2 assets not being served
4. **Route Registration**: V2 routes not properly mounted
5. **Gotenberg Connection**: Backend can't reach Gotenberg service

## Testing Commands
```bash
# Test V2 status endpoint
curl https://simplegym-v2-production.up.railway.app/api/v2/status

# Test V2 templates endpoint
curl https://simplegym-v2-production.up.railway.app/api/v2/templates

# Test Gotenberg service
curl https://simplegym-gotenberg-production.up.railway.app/health
```

## Next Steps
1. Run through each debug step systematically
2. Document any errors or unexpected behavior
3. Fix issues one by one, testing after each fix
4. Verify end-to-end workflow works correctly
