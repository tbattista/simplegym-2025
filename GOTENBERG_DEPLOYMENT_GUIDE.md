# Gotenberg Railway Deployment Guide

This guide will walk you through deploying the Gotenberg service on Railway to enable V2 PDF generation for Ghost Gym.

## Prerequisites

- Railway account (free tier is sufficient for testing)
- Railway CLI installed (optional but recommended)
- Access to your existing Ghost Gym Railway project

## Step-by-Step Deployment

### Step 1: Deploy Gotenberg Service

#### Option A: Railway CLI (Recommended)

1. **Install Railway CLI** (if not already installed):
   ```bash
   # Windows (PowerShell)
   iwr https://railway.app/install.ps1 | iex
   
   # macOS/Linux
   curl -fsSL https://railway.app/install.sh | sh
   ```

2. **Login to Railway**:
   ```bash
   railway login
   ```

3. **Navigate to gotenberg-service directory**:
   ```bash
   cd gotenberg-service
   ```

4. **Create new Railway service**:
   ```bash
   railway service create gotenberg-pdf-service
   ```

5. **Deploy the service**:
   ```bash
   railway up
   ```

#### Option B: Railway Dashboard

1. **Go to Railway Dashboard**: https://railway.app/dashboard
2. **Create New Service**:
   - Click "New Project" or go to your existing Ghost Gym project
   - Click "Add Service" → "Empty Service"
   - Name it `gotenberg-pdf-service`

3. **Upload Files**:
   - In the service dashboard, go to "Settings" → "Source"
   - Upload the `gotenberg-service` folder contents
   - Or connect to a GitHub repository containing these files

4. **Deploy**:
   - Railway will automatically detect the Dockerfile
   - Click "Deploy" to start the build process

### Step 2: Get Service URL

After deployment completes (usually 2-5 minutes):

1. **Find the URL**:
   - In Railway dashboard, go to your Gotenberg service
   - Click on "Settings" → "Domains"
   - Copy the generated URL (e.g., `https://gotenberg-pdf-service-production-xxxx.up.railway.app`)

2. **Test the Service**:
   ```bash
   # Test health endpoint
   curl https://your-gotenberg-url.up.railway.app/health
   
   # Should return: {"status":"up"}
   ```

### Step 3: Configure Main Application

1. **Add Environment Variable**:
   - Go to your main Ghost Gym service in Railway
   - Navigate to "Variables" tab
   - Add new variable:
     - **Name**: `GOTENBERG_SERVICE_URL`
     - **Value**: `https://your-gotenberg-url.up.railway.app`

2. **Redeploy Main Application**:
   - Railway should automatically redeploy when you add the environment variable
   - If not, trigger a manual deployment

### Step 4: Test V2 System

1. **Check V2 Status**:
   ```bash
   curl https://your-main-app.up.railway.app/api/v2/status
   ```
   
   Expected response:
   ```json
   {
     "status": "healthy",
     "version": "2.0",
     "gotenberg_available": true,
     "gotenberg_url": "https://your-gotenberg-url.up.railway.app",
     "capabilities": ["html_preview", "pdf_generation"]
   }
   ```

2. **Test HTML Preview** (should work immediately):
   ```bash
   curl -X POST https://your-main-app.up.railway.app/api/v2/preview-html \
     -H "Content-Type: application/json" \
     -d '{"workout_name": "Test", "workout_date": "2025-01-07", "exercises": {}}'
   ```

3. **Test PDF Generation**:
   ```bash
   curl -X POST https://your-main-app.up.railway.app/api/v2/preview-pdf \
     -H "Content-Type: application/json" \
     -d '{"workout_name": "Test", "workout_date": "2025-01-07", "exercises": {}}' \
     --output test.pdf
   ```

### Step 5: Frontend Integration (Optional)

To enable V2 in the frontend, you can add a toggle switch. For now, you can test V2 endpoints directly via API calls.

## Troubleshooting

### Common Issues

#### 1. Gotenberg Service Won't Start
**Symptoms**: Service shows "Crashed" or "Failed" status

**Solutions**:
- Check Railway logs for error messages
- Verify Dockerfile syntax
- Ensure sufficient memory allocation (Gotenberg needs ~512MB)

#### 2. Main App Can't Connect to Gotenberg
**Symptoms**: `/api/v2/status` shows `gotenberg_available: false`

**Solutions**:
- Verify `GOTENBERG_SERVICE_URL` environment variable is set correctly
- Check if Gotenberg service is running and accessible
- Test Gotenberg health endpoint directly

#### 3. PDF Generation Fails
**Symptoms**: HTML preview works but PDF generation returns errors

**Solutions**:
- Check Gotenberg service logs
- Verify HTML content is valid
- Check timeout settings (increase if needed)

#### 4. Slow PDF Generation
**Symptoms**: PDF generation takes >30 seconds or times out

**Solutions**:
- Upgrade Railway plan for more CPU/memory
- Optimize HTML template size
- Increase timeout settings

### Monitoring

1. **Railway Logs**:
   - Monitor both services' logs in Railway dashboard
   - Look for error messages or performance issues

2. **Resource Usage**:
   - Check CPU and memory usage
   - Gotenberg can be resource-intensive for complex documents

3. **Response Times**:
   - Monitor API response times
   - PDF generation should typically take 1-5 seconds

## Cost Estimation

### Railway Pricing (as of 2025)
- **Hobby Plan**: $5/month per service
- **Pro Plan**: $20/month per service (better performance)

### Expected Usage
- **Gotenberg Service**: ~$5-10/month (depending on usage)
- **Total Additional Cost**: $5-10/month for PDF generation capability

## Success Criteria

✅ **Gotenberg service deployed and running**
✅ **Health endpoint responding**
✅ **Main app can connect to Gotenberg**
✅ **V2 status shows Gotenberg available**
✅ **HTML preview working**
✅ **PDF generation working**
✅ **PDF quality meets requirements**

## Next Steps After Deployment

1. **Test with Real Data**: Use actual workout templates and data
2. **Performance Testing**: Test with multiple concurrent users
3. **Frontend Integration**: Add V2 toggle to user interface
4. **User Migration**: Gradually roll out V2 to users
5. **Monitoring Setup**: Set up alerts for service health

## Support

If you encounter issues:

1. **Check Railway Status**: https://status.railway.app/
2. **Railway Documentation**: https://docs.railway.app/
3. **Gotenberg Documentation**: https://gotenberg.dev/
4. **Ghost Gym V2 Logs**: Check your main application logs for V2-specific errors

## Rollback Plan

If something goes wrong:

1. **V1 System Still Works**: Your original system is unchanged
2. **Remove Environment Variable**: Remove `GOTENBERG_SERVICE_URL` to disable V2
3. **Delete Gotenberg Service**: Remove the service to stop costs
4. **No Data Loss**: All user data and functionality preserved

The deployment is low-risk because V2 is completely additive to your existing system.
