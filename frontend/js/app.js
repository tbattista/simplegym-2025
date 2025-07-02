// Gym Log Template Editor - Frontend JavaScript

class GymLogApp {
    constructor() {
        this.apiBase = '';  // Same origin
        this.templates = [];
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
        this.generateExerciseGroups();
        await this.loadTemplates();
        this.showAlert('Application loaded successfully!', 'success');
    }

    setupEventListeners() {
        // Form submission
        document.getElementById('workoutForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Preview button
        document.getElementById('previewBtn').addEventListener('click', () => {
            this.showPreview();
        });

        // Form validation
        document.getElementById('workoutForm').addEventListener('input', () => {
            this.validateForm();
        });
    }

    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('workoutDate').value = today;
    }

    generateExerciseGroups() {
        const container = document.getElementById('exerciseGroups');
        container.innerHTML = '';

        for (let i = 1; i <= 6; i++) {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'exercise-group fade-in';
            groupDiv.innerHTML = `
                <div class="exercise-group-title">
                    <i class="bi bi-trophy-fill"></i>
                    Exercise Group ${i}
                </div>
                <div class="row mb-3">
                    ${['a', 'b', 'c'].map(letter => `
                        <div class="col-md-4 exercise-input-group">
                            <label for="exercise-${i}${letter}" class="form-label exercise-label">
                                Exercise ${i}${letter}
                            </label>
                            <input 
                                type="text" 
                                class="form-control" 
                                id="exercise-${i}${letter}" 
                                placeholder="e.g., ${this.exerciseDefaults[`${i}${letter}`] || 'Exercise name'}"
                                value="${this.exerciseDefaults[`${i}${letter}`] || ''}"
                            >
                        </div>
                    `).join('')}
                </div>
                <div class="row">
                    <div class="col-md-4">
                        <label for="sets-${i}" class="form-label exercise-label">Sets</label>
                        <input 
                            type="text" 
                            class="form-control" 
                            id="sets-${i}" 
                            placeholder="e.g., 3"
                            value="3"
                        >
                    </div>
                    <div class="col-md-4">
                        <label for="reps-${i}" class="form-label exercise-label">Reps</label>
                        <input 
                            type="text" 
                            class="form-control" 
                            id="reps-${i}" 
                            placeholder="e.g., 8-12"
                            value="8-12"
                        >
                    </div>
                    <div class="col-md-4">
                        <label for="rest-${i}" class="form-label exercise-label">Rest</label>
                        <input 
                            type="text" 
                            class="form-control" 
                            id="rest-${i}" 
                            placeholder="e.g., 60s"
                            value="60s"
                        >
                    </div>
                </div>
            `;
            container.appendChild(groupDiv);
        }
    }

    async loadTemplates() {
        try {
            const response = await fetch(`${this.apiBase}/api/templates`);
            const data = await response.json();
            
            if (response.ok) {
                this.templates = data.templates;
                this.populateTemplateSelect();
            } else {
                throw new Error(data.detail || 'Failed to load templates');
            }
        } catch (error) {
            console.error('Error loading templates:', error);
            this.showAlert('Failed to load templates. Please check if the server is running.', 'danger');
        }
    }

    populateTemplateSelect() {
        const select = document.getElementById('templateSelect');
        select.innerHTML = '';

        if (this.templates.length === 0) {
            select.innerHTML = '<option value="">No templates found</option>';
            return;
        }

        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select a template...';
        select.appendChild(defaultOption);

        // Add template options
        this.templates.forEach(template => {
            const option = document.createElement('option');
            option.value = template;
            option.textContent = template;
            select.appendChild(option);
        });

        // Auto-select first template if available
        if (this.templates.length > 0) {
            select.value = this.templates[0];
        }
    }

    validateForm() {
        const form = document.getElementById('workoutForm');
        const isValid = form.checkValidity();
        
        // Add Bootstrap validation classes
        form.classList.add('was-validated');
        
        return isValid;
    }

    collectFormData() {
        const formData = {
            workout_name: document.getElementById('workoutName').value.trim(),
            workout_date: document.getElementById('workoutDate').value,
            template_name: document.getElementById('templateSelect').value,
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
            formData.bonus_sets['sets-bonus-1'] = bonus2Sets; // Note: template has sets-bonus-1 for both
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

        const formData = this.collectFormData();
        
        // Validate template selection
        if (!formData.template_name) {
            this.showAlert('Please select a template.', 'warning');
            return;
        }

        this.showLoading(true);

        try {
            const response = await fetch(`${this.apiBase}/api/generate`, {
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
                a.download = `gym_log_${formData.workout_name.replace(/\s+/g, '_')}_${formData.workout_date}.docx`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);

                this.showAlert('Document generated and downloaded successfully!', 'success');
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
        
        if (!formData.template_name) {
            this.showAlert('Please select a template first.', 'warning');
            return;
        }

        // Show modal first
        const modal = new bootstrap.Modal(document.getElementById('previewModal'));
        modal.show();

        // Show loading state
        this.showPreviewLoading(true);

        try {
            // Try to generate PDF preview
            const response = await fetch(`${this.apiBase}/api/preview`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                // PDF generation successful
                const blob = await response.blob();
                const pdfUrl = URL.createObjectURL(blob);
                
                // Show PDF viewer
                document.getElementById('pdfViewer').src = pdfUrl;
                this.showPdfPreview();
                
                // Clean up the blob URL after a delay to allow loading
                setTimeout(() => {
                    URL.revokeObjectURL(pdfUrl);
                }, 30000); // Clean up after 30 seconds
                
            } else {
                // PDF generation failed, fall back to text preview
                const errorData = await response.json();
                console.warn('PDF preview failed, falling back to text preview:', errorData);
                this.showTextPreview(formData);
            }
        } catch (error) {
            console.error('Error generating preview:', error);
            // Fall back to text preview
            this.showTextPreview(formData);
        } finally {
            this.showPreviewLoading(false);
        }
    }

    showPreviewLoading(show) {
        const loading = document.getElementById('previewLoading');
        const pdfContainer = document.getElementById('pdfPreviewContainer');
        const textContainer = document.getElementById('textPreviewContainer');
        const errorContainer = document.getElementById('previewError');
        
        if (show) {
            loading.classList.remove('d-none');
            pdfContainer.classList.add('d-none');
            textContainer.classList.add('d-none');
            errorContainer.classList.add('d-none');
        } else {
            loading.classList.add('d-none');
        }
    }

    showPdfPreview() {
        const pdfContainer = document.getElementById('pdfPreviewContainer');
        const textContainer = document.getElementById('textPreviewContainer');
        const errorContainer = document.getElementById('previewError');
        
        pdfContainer.classList.remove('d-none');
        textContainer.classList.add('d-none');
        errorContainer.classList.add('d-none');
    }

    showTextPreview(formData) {
        const pdfContainer = document.getElementById('pdfPreviewContainer');
        const textContainer = document.getElementById('textPreviewContainer');
        const errorContainer = document.getElementById('previewError');
        
        // Generate text preview content
        let previewContent = 'REPLACEMENTS THAT WILL BE MADE:\n';
        previewContent += '='.repeat(50) + '\n\n';

        // Basic info
        previewContent += `Workout Name: "${formData.workout_name}"\n`;
        previewContent += `Date: "${formData.workout_date}"\n`;
        previewContent += `Template: "${formData.template_name}"\n\n`;

        // Main exercises
        previewContent += 'MAIN EXERCISES:\n';
        previewContent += '-'.repeat(30) + '\n';
        for (const [key, value] of Object.entries(formData.exercises)) {
            previewContent += `${key} → "${value}"\n`;
        }

        // Sets, reps, and rest
        previewContent += '\nSETS, REPS & REST:\n';
        previewContent += '-'.repeat(30) + '\n';
        for (const [key, value] of Object.entries(formData.sets)) {
            previewContent += `${key} → "${value}"\n`;
        }
        for (const [key, value] of Object.entries(formData.reps)) {
            previewContent += `${key} → "${value}"\n`;
        }
        for (const [key, value] of Object.entries(formData.rest)) {
            previewContent += `${key} → "${value}"\n`;
        }

        // Bonus exercises
        if (Object.keys(formData.bonus_exercises).length > 0) {
            previewContent += '\nBONUS EXERCISES:\n';
            previewContent += '-'.repeat(30) + '\n';
            for (const [key, value] of Object.entries(formData.bonus_exercises)) {
                previewContent += `${key} → "${value}"\n`;
            }
            
            // Bonus sets, reps, and rest
            for (const [key, value] of Object.entries(formData.bonus_sets)) {
                previewContent += `${key} → "${value}"\n`;
            }
            for (const [key, value] of Object.entries(formData.bonus_reps)) {
                previewContent += `${key} → "${value}"\n`;
            }
            for (const [key, value] of Object.entries(formData.bonus_rest)) {
                previewContent += `${key} → "${value}"\n`;
            }
        }

        document.getElementById('previewContent').textContent = previewContent;
        
        // Show text preview
        pdfContainer.classList.add('d-none');
        textContainer.classList.remove('d-none');
        errorContainer.classList.add('d-none');
    }

    showPreviewError(message) {
        const pdfContainer = document.getElementById('pdfPreviewContainer');
        const textContainer = document.getElementById('textPreviewContainer');
        const errorContainer = document.getElementById('previewError');
        
        document.getElementById('previewErrorMessage').textContent = message;
        
        pdfContainer.classList.add('d-none');
        textContainer.classList.add('d-none');
        errorContainer.classList.remove('d-none');
    }

    showLoading(show) {
        const spinner = document.getElementById('loadingSpinner');
        const form = document.getElementById('workoutForm');
        
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
        alertDiv.className = `alert alert-${type} alert-dismissible fade show slide-in`;
        alertDiv.innerHTML = `
            <i class="bi bi-${this.getAlertIcon(type)} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
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

    // Utility method to clear all alerts
    clearAlerts() {
        const alertContainer = document.getElementById('alertContainer');
        alertContainer.innerHTML = '';
    }

    // Method to reset form to defaults
    resetForm() {
        document.getElementById('workoutForm').reset();
        this.setDefaultDate();
        this.generateExerciseGroups();
        document.getElementById('templateSelect').value = this.templates[0] || '';
        this.clearAlerts();
        this.showAlert('Form reset to defaults.', 'info');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.gymLogApp = new GymLogApp();
});

// Add keyboard shortcuts
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

// Add service worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker registration would go here
        // navigator.serviceWorker.register('/sw.js');
    });
}
