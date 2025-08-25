/**
 * Main JavaScript file for Teachable Machine Platform
 * Handles global functionality, navigation, and notifications
 */

class TeachableMachineApp {
    constructor() {
        this.notifications = document.getElementById('notifications');
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupScrollEffects();
        this.checkBrowserSupport();
        console.log('Teachable Machine App initialized');
    }

    /**
     * Setup smooth navigation between sections
     */
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Update active nav link
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                    
                    // Smooth scroll to section
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Add highlight effect to target section
                    this.highlightSection(targetSection);
                }
            });
        });
    }

    /**
     * Add highlight effect to section
     */
    highlightSection(section) {
        section.style.transform = 'scale(1.02)';
        section.style.transition = 'transform 0.3s ease';
        
        setTimeout(() => {
            section.style.transform = 'scale(1)';
        }, 300);
    }

    /**
     * Setup scroll effects for header
     */
    setupScrollEffects() {
        const header = document.querySelector('.header');
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = 'none';
            }
            
            // Hide/show header on scroll
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        });
    }

    /**
     * Check browser support for required features
     */
    checkBrowserSupport() {
        const features = {
            getUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
            webgl: !!document.createElement('canvas').getContext('webgl'),
            audioContext: !!(window.AudioContext || window.webkitAudioContext)
        };

        if (!features.getUserMedia) {
            this.showNotification('Tu navegador no soporta acceso a cámara/micrófono', 'error');
        }

        if (!features.webgl) {
            this.showNotification('WebGL no está disponible. Algunas funciones pueden no funcionar correctamente', 'warning');
        }

        if (!features.audioContext) {
            this.showNotification('Audio Web API no está disponible', 'warning');
        }
    }

    /**
     * Show notification to user
     */
    showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icon = this.getNotificationIcon(type);
        
        notification.innerHTML = `
            <i class="${icon}"></i>
            <span class="notification-text">${message}</span>
        `;
        
        this.notifications.appendChild(notification);
        
        // Auto remove notification
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
        
        // Allow manual close
        notification.addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    }

    /**
     * Get appropriate icon for notification type
     */
    getNotificationIcon(type) {
        const icons = {
            info: 'fas fa-info-circle',
            success: 'fas fa-check-circle',
            warning: 'fas fa-exclamation-triangle',
            error: 'fas fa-times-circle'
        };
        return icons[type] || icons.info;
    }

    /**
     * Update button state with visual feedback
     */
    updateButtonState(button, state, text = null) {
        if (!button) return;
        
        button.setAttribute('data-state', state);
        const btnText = button.querySelector('.btn-text');
        const statusDot = button.closest('.controls-panel')?.querySelector('.status-dot');
        const statusText = button.closest('.controls-panel')?.querySelector('.status-text');
        
        if (btnText && text) {
            btnText.textContent = text;
        }
        
        if (statusDot) {
            statusDot.className = `status-dot ${state}`;
        }
        
        // Update status text based on state
        if (statusText) {
            const statusMessages = {
                ready: 'Listo',
                loading: 'Cargando...',
                active: 'Activo',
                processing: 'Procesando...',
                error: 'Error'
            };
            statusText.textContent = statusMessages[state] || 'Desconocido';
        }
    }

    /**
     * Request camera permission
     */
    async requestCameraPermission() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: true, 
                audio: false 
            });
            stream.getTracks().forEach(track => track.stop());
            return true;
        } catch (error) {
            console.error('Camera permission denied:', error);
            this.showNotification('Acceso a la cámara denegado. Por favor, permite el acceso para usar esta función.', 'error');
            return false;
        }
    }

    /**
     * Display predictions in the UI
     */
    displayPredictions(containerId, predictions) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Clear placeholder
        container.innerHTML = '';

        if (!predictions || predictions.length === 0) {
            container.innerHTML = `
                <div class="predictions-placeholder">
                    <i class="fas fa-search"></i>
                    <p>No se detectaron resultados</p>
                </div>
            `;
            return;
        }

        predictions.forEach(prediction => {
            const predictionElement = document.createElement('div');
            predictionElement.className = 'prediction-item';
            
            const confidence = Math.round(prediction.probability * 100);
            
            predictionElement.innerHTML = `
                <span class="prediction-label">${prediction.className}</span>
                <div class="prediction-confidence">
                    <div class="confidence-bar">
                        <div class="confidence-fill" style="width: ${confidence}%"></div>
                    </div>
                    <span class="confidence-text">${confidence}%</span>
                </div>
            `;
            
            container.appendChild(predictionElement);
        });
    }

    /**
     * Handle errors gracefully
     */
    handleError(error, context = '') {
        console.error(`Error in ${context}:`, error);
        
        let message = 'Ha ocurrido un error inesperado';
        
        if (error.name === 'NotAllowedError') {
            message = 'Permisos denegados. Por favor, permite el acceso a la cámara/micrófono.';
        } else if (error.name === 'NotFoundError') {
            message = 'No se encontró cámara o micrófono disponible.';
        } else if (error.name === 'NotReadableError') {
            message = 'Error al acceder al dispositivo. Puede estar siendo usado por otra aplicación.';
        } else if (error.message) {
            message = error.message;
        }
        
        this.showNotification(message, 'error');
    }

}

// Add slideOut animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.teachableMachineApp = new TeachableMachineApp();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TeachableMachineApp;
}
