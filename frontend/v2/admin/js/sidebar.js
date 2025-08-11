// Sidebar functionality for Ghost Gym Admin
class AdminSidebar {
    constructor() {
        this.sidebar = document.querySelector('.sidebar');
        this.pageContainer = document.querySelector('.page-container');
        this.sidebarToggle = document.getElementById('sidebar-toggle');
        this.mobileToggle = document.querySelector('.mobile-toggle a');
        this.isCollapsed = false;
        this.isMobile = window.innerWidth <= 768;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.handleResize();
        
        // Initialize mobile state
        if (this.isMobile) {
            this.sidebar.classList.remove('show');
        }
    }

    setupEventListeners() {
        // Desktop sidebar toggle
        if (this.sidebarToggle) {
            this.sidebarToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleSidebar();
            });
        }

        // Mobile sidebar toggle
        if (this.mobileToggle) {
            this.mobileToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMobileSidebar();
            });
        }

        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Close mobile sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMobile && 
                this.sidebar.classList.contains('show') && 
                !this.sidebar.contains(e.target) && 
                !this.sidebarToggle.contains(e.target)) {
                this.closeMobileSidebar();
            }
        });

        // Handle sidebar link clicks
        this.setupSidebarLinks();
    }

    toggleSidebar() {
        if (this.isMobile) {
            this.toggleMobileSidebar();
        } else {
            this.toggleDesktopSidebar();
        }
    }

    toggleDesktopSidebar() {
        this.isCollapsed = !this.isCollapsed;
        
        if (this.isCollapsed) {
            this.sidebar.classList.add('collapsed');
        } else {
            this.sidebar.classList.remove('collapsed');
        }

        // Store preference
        localStorage.setItem('sidebar-collapsed', this.isCollapsed);
        
        // Trigger custom event
        window.dispatchEvent(new CustomEvent('sidebarToggle', {
            detail: { collapsed: this.isCollapsed }
        }));
    }

    toggleMobileSidebar() {
        if (this.sidebar.classList.contains('show')) {
            this.closeMobileSidebar();
        } else {
            this.openMobileSidebar();
        }
    }

    openMobileSidebar() {
        this.sidebar.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    closeMobileSidebar() {
        this.sidebar.classList.remove('show');
        document.body.style.overflow = '';
    }

    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 768;

        if (wasMobile !== this.isMobile) {
            // Reset states when switching between mobile/desktop
            if (this.isMobile) {
                // Switching to mobile
                this.sidebar.classList.remove('collapsed');
                this.sidebar.classList.remove('show');
                document.body.style.overflow = '';
            } else {
                // Switching to desktop
                this.sidebar.classList.remove('show');
                document.body.style.overflow = '';
                
                // Restore collapsed state from localStorage
                const savedState = localStorage.getItem('sidebar-collapsed');
                if (savedState === 'true') {
                    this.isCollapsed = true;
                    this.sidebar.classList.add('collapsed');
                } else {
                    this.isCollapsed = false;
                    this.sidebar.classList.remove('collapsed');
                }
            }
        }
    }

    setupSidebarLinks() {
        const sidebarLinks = document.querySelectorAll('.sidebar-link');
        
        sidebarLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Remove active class from all links
                sidebarLinks.forEach(l => l.classList.remove('active'));
                
                // Add active class to clicked link
                link.classList.add('active');
                
                // Close mobile sidebar after clicking a link
                if (this.isMobile) {
                    setTimeout(() => {
                        this.closeMobileSidebar();
                    }, 150);
                }
            });
        });
    }

    // Public methods
    collapse() {
        if (!this.isMobile) {
            this.isCollapsed = true;
            this.sidebar.classList.add('collapsed');
            localStorage.setItem('sidebar-collapsed', 'true');
        }
    }

    expand() {
        if (!this.isMobile) {
            this.isCollapsed = false;
            this.sidebar.classList.remove('collapsed');
            localStorage.setItem('sidebar-collapsed', 'false');
        }
    }

    isCollapsedState() {
        return this.isCollapsed;
    }

    isMobileState() {
        return this.isMobile;
    }
}

// Theme Toggle Functionality
class ThemeToggle {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.setupEventListeners();
    }

    setupEventListeners() {
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleTheme();
            });
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        
        // Trigger custom event
        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: this.currentTheme }
        }));
    }

    applyTheme(theme) {
        const app = document.querySelector('.app');
        
        if (theme === 'dark') {
            app.classList.add('dark-theme');
            if (this.themeToggle) {
                this.themeToggle.innerHTML = '<i class="ti-sun"></i>';
                this.themeToggle.title = 'Switch to Light Mode';
            }
        } else {
            app.classList.remove('dark-theme');
            if (this.themeToggle) {
                this.themeToggle.innerHTML = '<i class="ti-palette"></i>';
                this.themeToggle.title = 'Switch to Dark Mode';
            }
        }
    }

    getCurrentTheme() {
        return this.currentTheme;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize sidebar
    window.adminSidebar = new AdminSidebar();
    
    // Initialize theme toggle
    window.themeToggle = new ThemeToggle();
    
    // Add smooth scrolling to sidebar
    const sidebarInner = document.querySelector('.sidebar-inner');
    if (sidebarInner) {
        sidebarInner.style.scrollBehavior = 'smooth';
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AdminSidebar, ThemeToggle };
}
