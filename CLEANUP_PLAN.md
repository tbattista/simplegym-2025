# 🧹 Project Cleanup Plan

## Current Project Analysis
**Project:** Ghost Gym Log Book V2  
**Status:** Successfully deployed to Railway  
**Branch:** v2-development  

---

## 📋 Complete Cleanup Checklist

### **PHASE 1: IMMEDIATE CLEANUP (Safe Deletions)**

#### 1.1 Word Temporary Files ⚠️ **HIGH PRIORITY**
**Location:** `templates/`
- [ ] `~$ster_doc.docx` - Word temp file (auto-generated)
- [ ] `~$ster_doc.htm` - Word temp file (auto-generated)
- [ ] `master_doc_files/` - Entire folder (Word HTML export artifacts)
  - Contains: XML files, theme data, headers - all auto-generated

**Impact:** ✅ Safe to delete - these are temporary/generated files

#### 1.2 Old Test Files
**Location:** `backend/uploads/`
- [ ] `gym_log_Push_Day_20250702_081222.docx` (July test)
- [ ] `gym_log_Push_Day_20250702_081222.pdf` (July test)
- [ ] `gym_log_Push_Day_20250703_225128.docx` (July test)
- [ ] `gym_log_Push_Day_20250703_225128.pdf` (July test)
- [ ] `gym_log_Push_Day_20250805_124334.docx` (August test)
- [ ] `gym_log_Push_Day_20250805_124334.pdf` (August test)
- [ ] `gym_log_Push_Day_20250809_212351.html` (August test)
- [ ] `gym_log_Push_Day_20250809_212438.html` (August test)
- [ ] `gym_log_Push_Day_20250809_212927.html` (August test)
- [x] **KEEP:** `.gitkeep` (required for git)

**Impact:** ✅ Safe to delete - old test files taking up space

#### 1.3 Empty/Unused Directories
- [ ] `frontend/v2/admin/assets/` - Empty directory

**Impact:** ✅ Safe to delete if truly empty

---

### **PHASE 2: DOCKER CLEANUP (Requires Verification)**

#### 2.1 Duplicate Dockerfiles ⚠️ **VERIFY FIRST**
**Current State:**
- `Dockerfile` (root) - Contains Gotenberg configuration
- `Dockerfile.python` (root) - Contains Python app configuration  
- `gotenberg-service/Dockerfile` - Contains Gotenberg configuration

**Analysis Needed:**
- [ ] Check which Dockerfile Railway is actually using
- [ ] Verify if root `Dockerfile` should be moved to `gotenberg-service/`
- [ ] Confirm `Dockerfile.python` is the main app Dockerfile

**Recommended Action:**
- Move root `Dockerfile` to `gotenberg-service/` (if not duplicate)
- OR delete root `Dockerfile` if it's a duplicate of `gotenberg-service/Dockerfile`

---

### **PHASE 3: DOCUMENTATION ORGANIZATION**

#### 3.1 Keep & Organize
**Essential Documentation:**
- [x] `README.md` - Main project documentation
- [x] `CHANGELOG.md` - Version history
- [x] `DEPLOYMENT_ARCHITECTURE.md` - Deployment reference
- [x] `railway.toml` - Railway configuration

**Development Documentation:**
- [x] `V2_DEBUG_PROMPT.md` - V2 debugging guide
- [x] `V2_IMPLEMENTATION_SUMMARY.md` - V2 implementation notes
- [x] `NEXT_STEPS_PROMPT.md` - Development roadmap
- [x] `DEPLOYMENT_READY_SUMMARY.md` - Deployment status

**Service Documentation:**
- [x] `gotenberg-service/README.md` - Gotenberg service docs
- [x] `GOTENBERG_DEPLOYMENT_GUIDE.md` - Gotenberg deployment
- [x] `RAILWAY_DEPLOYMENT_GUIDE.md` - Railway deployment

#### 3.2 Potential Consolidation
- [ ] Consider moving all deployment guides to a `docs/` folder
- [ ] Consider consolidating V2 documentation files

---

### **PHASE 4: VSCODE CLEANUP**

#### 4.1 Orphaned File References ⚠️ **MANUAL ACTION REQUIRED**
**VSCode Tabs Open (but files don't exist in project):**
- `pythonanywhere_wsgi_enhanced.py`
- `pythonanywhere_wsgi_fixed.py`
- `pythonanywhere_wsgi_simple.py`
- `pythonanywhere_wsgi_final.py`
- `pythonanywhere_wsgi_minimal.py`
- `pythonanywhere_wsgi_basic.py`
- `PROJECT_PLAN.md` (referenced but missing)

**Action Required:** Close these tabs manually in VSCode

---

### **PHASE 5: OPTIONAL OPTIMIZATIONS**

#### 5.1 Template Files Review
**Current Templates:**
- [x] `master_doc.docx` - Main template (KEEP)
- [x] `master_doc_og.docx` - Original template (KEEP as backup)
- [x] `master_doc-test.docx` - Test template (KEEP for testing)
- [ ] `master_doc.htm` - HTML version (evaluate if needed)

#### 5.2 Project Structure Optimization
- [ ] Consider creating `docs/` folder for documentation
- [ ] Consider creating `scripts/` folder for deployment scripts
- [ ] Evaluate if `test_*.py` files should be in a `tests/` folder

---

## 🎯 **RECOMMENDED EXECUTION ORDER**

### **Step 1: Safe Deletions (No Risk)**
1. Delete Word temporary files
2. Clean old test files from uploads
3. Remove empty directories

### **Step 2: Docker Verification & Cleanup**
1. Verify which Dockerfile Railway uses
2. Consolidate/organize Docker files
3. Test deployment still works

### **Step 3: Documentation Organization**
1. Create docs folder if desired
2. Move/organize documentation files
3. Update any broken references

### **Step 4: Manual VSCode Cleanup**
1. Close orphaned file tabs
2. Clean up workspace

---

## 📊 **CLEANUP IMPACT SUMMARY**

**Files to Delete:** ~15-20 files
**Space Saved:** Estimated 5-10MB (mostly from old PDFs/Word docs)
**Risk Level:** Low (mostly temporary/test files)
**Time Required:** 10-15 minutes
**Deployment Impact:** None (files not used in production)

---

## ⚠️ **SAFETY NOTES**

**Before Starting:**
- [ ] Ensure Railway deployment is working
- [ ] Create git commit of current state
- [ ] Have backup of any files you're unsure about

**During Cleanup:**
- [ ] Test after each phase
- [ ] Commit changes incrementally
- [ ] Verify Railway deployment still works

**After Cleanup:**
- [ ] Run final deployment test
- [ ] Update documentation if needed
- [ ] Close this cleanup plan or archive it

---

*Generated: January 11, 2025*
*Project: Ghost Gym Log Book V2*
*Branch: v2-development*
