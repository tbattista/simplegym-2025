// Ghost Gym V2 Admin - Enhanced Frontend JavaScript

class GymLogAppV2Admin {
    constructor() {
        this.apiBase = '';  // Same origin
        this.selectedFormat = 'html';  // Default to HTML
        this.v2Available = false;
        this.pdfAvailable = false;
        
        // Exercise defaults (same as V1 for consistency)
        this.exerciseDefaults = {
            '1a': 'Bench Press', '1b': 'Incline Press', '1c': 'Flyes',
            '2a': 'Squats', '2b': 'Leg Press', '2c': 'Lunges',
            '3a': 'Deadlifts', '3b': 'Rows', '3c': 'Pull-ups',
            '4a': 'Shoulder Press', '4b': 'Lateral Raises', '4c': 'Rear Delts',
            '5a': 'Bicep Curls', '5b': 'Hammer Curls', '5c': 'Cable Curls',
            '6a': 'Tricep Dips', '6b': 'Overhead Extension', '6c': 'Pushdowns'
        };
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.setDefaultDate();
        this.generateExerciseAccordions();
        await this.checkV2Status();
        this.setupFormatSelection();
        this.showAlert('Admin panel loaded successfully! 👻', 'success');
        
        // Initialize admin-specific features
        this.initAdminFeatures();
    }

    initAdminFeatures() {
        // Listen for sidebar toggle events
        window.addEventListener('sidebarToggle', (e) => {
            this.handleSidebarToggle(e.detail.collapsed);
        });

        // Listen for theme change events
        window.addEventListener('themeChanged', (e) => {
            this.handleThemeChange(e.detail.theme);
        });

        // Add keyboard shortcuts for admin
        this.setupAdminKeyboardShortcuts();
    }

    setupEventListeners() {
        // Form submission
        document.getElementById('workoutFormV2').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Preview button
        document.getElementById('previewBtn').addEventListener('click', () => {
            this.showPreview();
        });

        // Form validation
        document.getElementById('workoutFormV2').addEventListener('input', () => {
            this.validateForm();
        });

        // Format selection
        document.querySelectorAll('.format-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.selectFormat(e.currentTarget.dataset.format);
            });
        });
    }

    setupAdminKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+Enter to submit form
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                document.getElementById('generateBtn').click();
            }
            
            // Ctrl+P to show preview
            if (e.ctrlKey && e.key === 'p') {
                e.preventDefault();
                document.getElementById('previewBtn').click();
            }
            
            // Ctrl+B to toggle sidebar
            if (e.ctrlKey && e.key === 'b') {
                e.preventDefault();
                if (window.adminSidebar) {
                    window.adminSidebar.toggleSidebar();
                }
            }
            
            // Ctrl+T to toggle theme
            if (e.ctrlKey && e.key === 't') {
                e.preventDefault();
                if (window.themeToggle) {
                    window.themeToggle.toggleTheme();
                }
            }
            
            // Escape to close modals
            if (e.key === 'Escape') {
                const modals = document.querySelectorAll('.modal.show');
                modals.forEach(modal => {
                    const modalInstance = bootstrap.Modal.getInstance(modal);
                    if (modalInstance) {
                        modalInstance.hide();
                    }
                });
            }
        });
    }

    handleSidebarToggle(collapsed) {
        // Adjust layout or perform actions when sidebar is toggled
        console.log('Sidebar toggled:', collapsed ? 'collapsed' : 'expanded');
        
        // You can add specific logic here if needed
        // For example, adjusting chart sizes, etc.
    }

    handleThemeChange(theme) {
        console.log('Theme changed to:', theme);
        
        // Update any theme-specific elements
        this.updateThemeSpecificElements(theme);
    }

    updateThemeSpecificElements(theme) {
        // Update format options for theme
        const formatOptions = document.querySelectorAll('.format-option');
        formatOptions.forEach(option => {
            if (theme === 'dark') {
                option.style.borderColor = 'rgba(255,255,255,0.1)';
            } else {
                option.style.borderColor = '#e9ecef';
            }
        });
    }

    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('workoutDate').value = today;
    }

    generateExerciseAccordions() {
        const container = document.getElementById('exerciseAccordions');
        container.innerHTML = '';

        for (let i = 1; i <= 6; i++) {
            const accordionDiv = document.createElement('div');
            accordionDiv.className = 'fade-in';
            accordionDiv.innerHTML = `
                <div class="layers bd bgc-white mB-20">
                    <div class="layer w-100 p-20 bdB">
                        <h6 class="lh-1 mb-0" id="accordionTitle${i}">
                            <span class="exercise-number me-2">${i}</span>
                            Exercise Group ${i}
                        </h6>
                    </div>
                    <div class="layer w-100 p-20" id="exerciseGroup${i}">
                        <div class="exercise-group-content">
                            <!-- Exercise Inputs -->
                            <div class="exercise-inputs">
                                <h6>
                                    <span class="exercise-number me-2">${i}</span>
                                    Exercises
                                </h6>
                                <div class="row">
                                    ${['a', 'b', 'c'].map((letter, index) => `
                                        <div class="col-md-4 mb-3">
                                            <label for="exercise-${i}${letter}" class="form-label">
                                                <span class="exercise-number me-1">${i}.${index + 1}</span>Exercise ${i}${letter}
                                            </label>
                                            <input 
                                                type="text" 
                                                class="form-control exercise-input" 
                                                id="exercise-${i}${letter}" 
                                                data-group="${i}"
                                                placeholder="${this.exerciseDefaults[`${i}${letter}`] || 'Exercise name'}"
                                                value="${this.exerciseDefaults[`${i}${letter}`] || ''}"
                                            >
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <!-- Sets, Reps, Rest -->
                            <div class="exercise-inputs">
                                <h6>
                                    <i class="bi bi-stopwatch me-2"></i>
                                    Sets, Reps & Rest
                                </h6>
                                <div class="row">
                                    <div class="col-md-4 mb-3">
                                        <label for="sets-${i}" class="form-label">Sets</label>
                                        <input 
                                            type="text" 
                                            class="form-control" 
                                            id="sets-${i}" 
                                            placeholder="e.g., 3"
                                            value="3"
                                        >
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <label for="reps-${i}" class="form-label">Reps</label>
                                        <input 
                                            type="text" 
                                            class="form-control" 
                                            id="reps-${i}" 
                                            placeholder="e.g., 8-12"
                                            value="8-12"
                                        >
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <label for="rest-${i}" class="form-label">Rest</label>
                                        <input 
                                            type="text" 
                                            class="form-control" 
                                            id="rest-${i}" 
                                            placeholder="e.g., 60s"
                                            value="60s"
                                        >
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(accordionDiv);
        }

        // Set up event listeners for dynamic header updates
        this.setupExerciseInputListeners();
        
        // Initialize accordion headers with current values
        for (let i = 1; i <= 6; i++) {
            this.updateAccordionHeader(i);
        }
    }

    async checkV2Status() {
        try {
            const response = await fetch(`${this.apiBase}/api/v2/status`);
            const data = await response.json();
            
            if (response.ok) {
                this.v2Available = data.status === 'available';
                this.pdfAvailable = data.gotenberg_available;
                
                // Update status indicators
                this.updateStatusBadge('v2Status', this.v2Available);
                this.updateStatusBadge('pdfStatus', this.pdfAvailable);
                
                // Update format options based on availability
                this.updateFormatOptions();
                
            } else {
                throw new Error(data.detail || 'Failed to check V2 status');
            }
        } catch (error) {
            console.error('Error checking V2 status:', error);
            this.v2Available = false;
            this.pdfAvailable = false;
            this.updateStatusBadge('v2Status', false);
            this.updateStatusBadge('pdfStatus', false);
            this.showAlert('V2 backend is not available. Some features may be limited.', 'warning');
        }
    }

    updateStatusBadge(elementId, available) {
        const badge = document.getElementById(elementId);
        if (available) {
            badge.textContent = 'Available';
            badge.className = 'status-badge available';
        } else {
            badge.textContent = 'Unavailable';
            badge.className = 'status-badge unavailable';
        }
    }

    updateFormatOptions() {
        const pdfOption = document.getElementById('formatPdf');
        
        if (!this.pdfAvailable) {
            pdfOption.style.opacity = '0.5';
            pdfOption.style.cursor = 'not-allowed';
            pdfOption.innerHTML = `
                <i class="bi bi-file-earmark-pdf"></i>
                <h6>PDF Document</h6>
                <small>Requires Gotenberg service</small>
            `;
            
            // Auto-select HTML if PDF was selected but unavailable
            if (this.selectedFormat === 'pdf') {
                this.selectFormat('html');
            }
        }
    }

    setupFormatSelection() {
        // Default to HTML
        this.selectFormat('html');
    }

    selectFormat(format) {
        // Don't allow PDF selection if not available
        if (format === 'pdf' && !this.pdfAvailable) {
            this.showAlert('PDF generation is not available. Gotenberg service is required.', 'warning');
            return;
        }

        this.selectedFormat = format;
        
        // Update UI
        document.querySelectorAll('.format-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        document.getElementById(`format${format.charAt(0).toUpperCase() + format.slice(1)}`).classList.add('selected');
        
        // Update button text
        const generateBtn = document.getElementById('generateBtn');
        const icon = format === 'pdf' ? 'file-earmark-pdf' : 'code-slash';
        generateBtn.innerHTML = `
            <i class="bi bi-${icon} me-2"></i>
            Generate ${format.toUpperCase()}
        `;
    }

    validateForm() {
        const form = document.getElementById('workoutFormV2');
        const isValid = form.checkValidity();
        
        // Add Bootstrap validation classes
        form.classList.add('was-validated');
        
        return isValid;
    }

    collectFormData() {
        const formData = {
            workout_name: document.getElementById('workoutName').value.trim(),
            workout_date: document.getElementById('workoutDate').value,
            template_name: 'gym_log_template.html', // V2 uses HTML template
            exercises: {},
            sets: {},
            reps: {},
            rest: {},
            bonus_exercises: {},
            bonus_sets: {},
            bonus_reps: {},
            bonus_rest: {}
        };

        // Collect main exercises
        for (let i = 1; i <= 6; i++) {
            for (const letter of ['a', 'b', 'c']) {
                const input = document.getElementById(`exercise-${i}${letter}`);
                if (input && input.value.trim()) {
                    formData.exercises[`exercise-${i}${letter}`] = input.value.trim();
                }
            }
            
            // Collect sets, reps, and rest for each group
            const setsInput = document.getElementById(`sets-${i}`);
            const repsInput = document.getElementById(`reps-${i}`);
            const restInput = document.getElementById(`rest-${i}`);
            
            if (setsInput && setsInput.value.trim()) {
                formData.sets[`sets-${i}`] = setsInput.value.trim();
            }
            if (repsInput && repsInput.value.trim()) {
                formData.reps[`reps-${i}`] = repsInput.value.trim();
            }
            if (restInput && restInput.value.trim()) {
                formData.rest[`rest-${i}`] = restInput.value.trim();
            }
        }

        // Collect bonus exercises
        const bonus1 = document.getElementById('bonus1').value.trim();
        const bonus2 = document.getElementById('bonus2').value.trim();
        
        if (bonus1) {
            formData.bonus_exercises['exercise-bonus-1'] = bonus1;
        }
        if (bonus2) {
            formData.bonus_exercises['exercise-bonus-2'] = bonus2;
        }
        
        // Collect bonus sets, reps, and rest
        const bonus1Sets = document.getElementById('bonus1-sets').value.trim();
        const bonus1Reps = document.getElementById('bonus1-reps').value.trim();
        const bonus1Rest = document.getElementById('bonus1-rest').value.trim();
        const bonus2Sets = document.getElementById('bonus2-sets').value.trim();
        const bonus2Reps = document.getElementById('bonus2-reps').value.trim();
        const bonus2Rest = document.getElementById('bonus2-rest').value.trim();
        
        if (bonus1Sets) {
            formData.bonus_sets['sets-bonus-1'] = bonus1Sets;
        }
        if (bonus1Reps) {
            formData.bonus_reps['reps-bonus-1'] = bonus1Reps;
        }
        if (bonus1Rest) {
            formData.bonus_rest['rest_bonus-1'] = bonus1Rest;
        }
        if (bonus2Sets) {
            formData.bonus_sets['sets-bonus-1'] = bonus2Sets; // Note: template uses sets-bonus-1 for both
        }
        if (bonus2Reps) {
            formData.bonus_reps['reps-bonus-2'] = bonus2Reps;
        }
        if (bonus2Rest) {
            formData.bonus_rest['rest_bonus-2'] = bonus2Rest;
        }

        return formData;
    }

    async handleFormSubmit() {
        if (!this.validateForm()) {
            this.showAlert('Please fill in all required fields correctly.', 'warning');
            return;
        }

        if (!this.v2Available) {
            this.showAlert('V2 backend is not available. Please try again later.', 'danger');
            return;
        }

        const formData = this.collectFormData();
        this.showLoading(true);

        try {
            let endpoint, filename;
            
            if (this.selectedFormat === 'pdf') {
                endpoint = '/api/v2/generate-pdf';
                filename = `gym_log_${formData.workout_name.replace(/\s+/g, '_')}_${formData.workout_date}.pdf`;
            } else {
                endpoint = '/api/v2/generate-html';
                filename = `gym_log_${formData.workout_name.replace(/\s+/g, '_')}_${formData.workout_date}.html`;
            }

            const response = await fetch(`${this.apiBase}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                // Handle file download
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);

                this.showAlert(`${this.selectedFormat.toUpperCase()} document generated and downloaded successfully! 🎉`, 'success');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to generate document');
            }
        } catch (error) {
            console.error('Error generating document:', error);
            this.showAlert(`Error generating document: ${error.message}`, 'danger');
        } finally {
            this.showLoading(false);
        }
    }

    async showPreview() {
        const formData = this.collectFormData();

        if (!this.v2Available) {
            this.showAlert('V2 backend is not available for preview.', 'warning');
            return;
        }

        // Show modal first
        const modal = new bootstrap.Modal(document.getElementById('previewModal'));
        modal.show();

        // Show loading state
        this.showPreviewLoading(true);

        try {
            // Always try HTML preview first (instant)
            const htmlResponse = await fetch(`${this.apiBase}/api/v2/preview-html`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (htmlResponse.ok) {
                const htmlContent = await htmlResponse.text();
                
                // Create blob URL for HTML content
                const blob = new Blob([htmlContent], { type: 'text/html' });
                const htmlUrl = URL.createObjectURL(blob);
                
                // Show HTML preview
                document.getElementById('htmlViewer').src = htmlUrl;
                this.showHtmlPreview();
                
                // Clean up after delay
                setTimeout(() => {
                    URL.revokeObjectURL(htmlUrl);
                }, 30000);
                
                // If PDF is available and selected format is PDF, also try PDF preview
                if (this.pdfAvailable && this.selectedFormat === 'pdf') {
                    this.tryPdfPreview(formData);
                }
                
            } else {
                const errorData = await htmlResponse.json();
                throw new Error(errorData.detail || 'Failed to generate preview');
            }
        } catch (error) {
            console.error('Error generating preview:', error);
            this.showPreviewError(error.message);
        } finally {
            this.showPreviewLoading(false);
        }
    }

    async tryPdfPreview(formData) {
        try {
            const pdfResponse = await fetch(`${this.apiBase}/api/v2/preview-pdf`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (pdfResponse.ok) {
                const blob = await pdfResponse.blob();
                const pdfUrl = URL.createObjectURL(blob);
                
                // Show PDF preview instead of HTML
                document.getElementById('pdfViewer').src = pdfUrl;
                this.showPdfPreview();
                
                // Clean up after delay
                setTimeout(() => {
                    URL.revokeObjectURL(pdfUrl);
                }, 30000);
            }
        } catch (error) {
            console.warn('PDF preview failed, showing HTML preview instead:', error);
            // HTML preview is already shown, so no action needed
        }
    }

    showPreviewLoading(show) {
        const loading = document.getElementById('previewLoading');
        const htmlContainer = document.getElementById('htmlPreviewContainer');
        const pdfContainer = document.getElementById('pdfPreviewContainer');
        const errorContainer = document.getElementById('previewError');
        
        if (show) {
            loading.classList.remove('d-none');
            htmlContainer.classList.add('d-none');
            pdfContainer.classList.add('d-none');
            errorContainer.classList.add('d-none');
        } else {
            loading.classList.add('d-none');
        }
    }

    showHtmlPreview() {
        const htmlContainer = document.getElementById('htmlPreviewContainer');
        const pdfContainer = document.getElementById('pdfPreviewContainer');
        const errorContainer = document.getElementById('previewError');
        
        htmlContainer.classList.remove('d-none');
        pdfContainer.classList.add('d-none');
        errorContainer.classList.add('d-none');
    }

    showPdfPreview() {
        const htmlContainer = document.getElementById('htmlPreviewContainer');
        const pdfContainer = document.getElementById('pdfPreviewContainer');
        const errorContainer = document.getElementById('previewError');
        
        htmlContainer.classList.add('d-none');
        pdfContainer.classList.remove('d-none');
        errorContainer.classList.add('d-none');
    }

    showPreviewError(message) {
        const htmlContainer = document.getElementById('htmlPreviewContainer');
        const pdfContainer = document.getElementById('pdfPreviewContainer');
        const errorContainer = document.getElementById('previewError');
        
        document.getElementById('previewErrorMessage').textContent = message;
        
        htmlContainer.classList.add('d-none');
        pdfContainer.classList.add('d-none');
        errorContainer.classList.remove('d-none');
    }

    showLoading(show) {
        const spinner = document.getElementById('loadingSpinner');
        const form = document.getElementById('workoutFormV2');
        
        if (show) {
            spinner.classList.remove('d-none');
            form.style.opacity = '0.5';
            form.style.pointerEvents = 'none';
        } else {
            spinner.classList.add('d-none');
            form.style.opacity = '1';
            form.style.pointerEvents = 'auto';
        }
    }

    showAlert(message, type = 'info') {
        const alertContainer = document.getElementById('alertContainer');
        
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert-v2 alert-${type} fade-in`;
        alertDiv.innerHTML = `
            <i class="bi bi-${this.getAlertIcon(type)} me-2"></i>
            ${message}
            <button type="button" class="btn-close btn-close-white ms-auto" onclick="this.parentElement.remove()"></button>
        `;
        
        alertContainer.appendChild(alertDiv);
        
        // Auto-dismiss success and info alerts after 5 seconds
        if (type === 'success' || type === 'info') {
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    alertDiv.remove();
                }
            }, 5000);
        }
    }

    getAlertIcon(type) {
        const icons = {
            'success': 'check-circle-fill',
            'danger': 'exclamation-triangle-fill',
            'warning': 'exclamation-triangle-fill',
            'info': 'info-circle-fill'
        };
        return icons[type] || 'info-circle-fill';
    }

    // Set up event listeners for exercise input fields to update accordion headers
    setupExerciseInputListeners() {
        document.querySelectorAll('.exercise-input').forEach(input => {
            input.addEventListener('input', (e) => {
                const groupNumber = parseInt(e.target.dataset.group);
                this.updateAccordionHeader(groupNumber);
            });
        });
    }

    // Update accordion header with current exercise names
    updateAccordionHeader(groupNumber) {
        const titleElement = document.getElementById(`accordionTitle${groupNumber}`);
        if (!titleElement) return;

        const exercises = [];
        
        // Get current values for the three exercises in this group
        for (const letter of ['a', 'b', 'c']) {
            const input = document.getElementById(`exercise-${groupNumber}${letter}`);
            if (input) {
                const value = input.value.trim();
                if (value) {
                    // Truncate long exercise names
                    const truncated = this.truncateExerciseName(value);
                    exercises.push(truncated);
                } else {
                    // Use placeholder or default format if empty
                    exercises.push(`Exercise ${groupNumber}${letter}`);
                }
            }
        }

        // Join exercises with bullet points
        const headerText = exercises.join(' • ');
        
        // Update the accordion title (preserve the exercise number)
        const exerciseNumber = titleElement.querySelector('.exercise-number');
        titleElement.innerHTML = '';
        titleElement.appendChild(exerciseNumber);
        titleElement.appendChild(document.createTextNode(headerText));
        
        // Add tooltip with full names if any were truncated
        const fullNames = [];
        for (const letter of ['a', 'b', 'c']) {
            const input = document.getElementById(`exercise-${groupNumber}${letter}`);
            if (input && input.value.trim()) {
                fullNames.push(input.value.trim());
            }
        }
        
        if (fullNames.length > 0) {
            const fullText = fullNames.join(' • ');
            if (fullText !== headerText) {
                titleElement.setAttribute('title', fullText);
            } else {
                titleElement.removeAttribute('title');
            }
        }
    }

    // Truncate exercise name if too long
    truncateExerciseName(name, maxLength = 18) {
        if (name.length <= maxLength) {
            return name;
        }
        
        // Try to truncate at word boundary
        const truncated = name.substring(0, maxLength);
        const lastSpace = truncated.lastIndexOf(' ');
        
        if (lastSpace > maxLength * 0.6) {
            // If we can find a good word boundary, use it
            return truncated.substring(0, lastSpace) + '...';
        } else {
            // Otherwise just truncate and add ellipsis
            return truncated + '...';
        }
    }

    // Utility method to clear all alerts
    clearAlerts() {
        const alertContainer = document.getElementById('alertContainer');
        alertContainer.innerHTML = '';
    }

    // Method to reset form to defaults
    resetForm() {
        document.getElementById('workoutFormV2').reset();
        this.setDefaultDate();
        this.generateExerciseAccordions();
        this.selectFormat('html');
        this.clearAlerts();
        this.showAlert('Form reset to defaults.', 'info');
    }
}

// Initialize the V2 Admin application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.gymLogAppV2Admin = new GymLogAppV2Admin();
});

// Add performance monitoring
window.addEventListener('load', () => {
    // Log performance metrics
    if (window.performance && window.performance.timing) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        console.log(`V2 Admin Frontend loaded in ${loadTime}ms`);
    }
});
