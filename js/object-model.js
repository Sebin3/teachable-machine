/**
 * Object Detection Module for Teachable Machine
 * Handles camera access, object detection, and real-time predictions
 */

class ObjectDetector {
    constructor() {
        this.isActive = false;
        this.video = null;
        this.canvas = null;
        this.context = null;
        this.model = null;
        this.webcam = null;
        this.maxPredictions = 0;
        this.animationId = null;
        
        // Teachable Machine model URL
        this.URL = "https://teachablemachine.withgoogle.com/models/yhk-ebUk5/";
        
        // UI elements
        this.button = document.getElementById('objectsBtn');
        this.status = document.getElementById('objectsStatus');
        this.video = document.getElementById('objectsVideo');
        this.canvas = document.getElementById('objectsCanvas');
        this.predictionsContainer = document.getElementById('objectsPredictions');
        
        this.init();
    }

    async init() {
        try {
            this.setupCanvas();
            this.setupEventListeners();
            console.log('Object Detector initialized');
        } catch (error) {
            window.teachableMachineApp?.handleError(error, 'Object Detector initialization');
        }
    }

    setupCanvas() {
        if (this.canvas && this.video) {
            this.context = this.canvas.getContext('2d');
            
            // Set canvas size to match video
            this.video.addEventListener('loadedmetadata', () => {
                this.canvas.width = this.video.videoWidth;
                this.canvas.height = this.video.videoHeight;
            });
        }
    }

    setupEventListeners() {
        if (this.button) {
            this.button.addEventListener('click', () => {
                if (this.isActive) {
                    this.stopDetection();
                } else {
                    this.startDetection();
                }
            });
        }
    }

    async startDetection() {
        try {
            window.teachableMachineApp?.updateButtonState(this.button, 'loading', 'Cargando modelo...');

            // Load the Teachable Machine model
            const modelURL = this.URL + "model.json";
            const metadataURL = this.URL + "metadata.json";
            
            this.model = await tmImage.load(modelURL, metadataURL);
            this.maxPredictions = this.model.getTotalClasses();

            window.teachableMachineApp?.updateButtonState(this.button, 'loading', 'Iniciando cámara...');

            // Setup Teachable Machine webcam
            const flip = true; // whether to flip the webcam
            this.webcam = new tmImage.Webcam(640, 480, flip);
            await this.webcam.setup(); // request access to the webcam
            await this.webcam.play();

            // Hide the original video element and show webcam canvas
            this.video.style.display = 'none';
            const cameraContainer = this.video.parentElement;
            cameraContainer.appendChild(this.webcam.canvas);
            this.webcam.canvas.style.width = '100%';
            this.webcam.canvas.style.height = '100%';
            this.webcam.canvas.style.objectFit = 'cover';
            this.webcam.canvas.style.borderRadius = '1rem';

            this.isActive = true;
            window.teachableMachineApp?.updateButtonState(this.button, 'active', 'Detener Cámara');
            
            // Start detection loop
            this.startDetectionLoop();
            
            window.teachableMachineApp?.showNotification('Detección de objetos iniciada', 'success');

        } catch (error) {
            window.teachableMachineApp?.handleError(error, 'Object detection start');
            window.teachableMachineApp?.updateButtonState(this.button, 'ready', 'Activar Cámara');
        }
    }

    stopDetection() {
        try {
            if (this.webcam) {
                this.webcam.stop();
                // Remove webcam canvas and show original video element
                if (this.webcam.canvas && this.webcam.canvas.parentElement) {
                    this.webcam.canvas.parentElement.removeChild(this.webcam.canvas);
                }
                this.video.style.display = 'block';
            }

            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
            }

            this.isActive = false;
            this.clearCanvas();
            
            window.teachableMachineApp?.updateButtonState(this.button, 'ready', 'Activar Cámara');
            window.teachableMachineApp?.showNotification('Detección de objetos detenida', 'info');

        } catch (error) {
            window.teachableMachineApp?.handleError(error, 'Object detection stop');
        }
    }

    startDetectionLoop() {
        const detect = async () => {
            if (!this.isActive) return;

            try {
                // Update webcam frame
                this.webcam.update();
                
                // Get predictions from Teachable Machine model
                const predictions = await this.predict();
                
                // Update predictions display
                window.teachableMachineApp?.displayPredictions('objectsPredictions', predictions);
                
            } catch (error) {
                console.error('Detection loop error:', error);
            }

            // Continue loop
            this.animationId = requestAnimationFrame(detect);
        };

        detect();
    }

    clearCanvas() {
        if (this.context && this.canvas) {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }


    async predict() {
        if (!this.model || !this.webcam) {
            return [];
        }

        try {
            // Run the webcam image through the Teachable Machine model
            const prediction = await this.model.predict(this.webcam.canvas);
            
            // Convert to our expected format
            const predictions = prediction.map(p => ({
                className: p.className,
                probability: p.probability
            }));
            
            // Sort by probability (highest first) and return top predictions
            predictions.sort((a, b) => b.probability - a.probability);
            return predictions.slice(0, 5);
            
        } catch (error) {
            window.teachableMachineApp?.handleError(error, 'Object prediction');
            return [];
        }
    }



    /**
     * Clean up resources
     */
    destroy() {
        if (this.isActive) {
            this.stopDetection();
        }
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.objectDetector = new ObjectDetector();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ObjectDetector;
}
