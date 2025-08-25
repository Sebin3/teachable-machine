/**
 * Pose Recognition Module for Teachable Machine
 * Handles pose detection, body tracking, and posture classification
 */

class PoseRecognizer {
    constructor() {
        this.isActive = false;
        this.model = null;
        this.webcam = null;
        this.ctx = null;
        this.maxPredictions = 0;
        this.animationId = null;
        
        // Teachable Machine model URL
        this.URL = "https://teachablemachine.withgoogle.com/models/eInUTCIv8/";
        
        // UI elements
        this.button = document.getElementById('posesBtn');
        this.status = document.getElementById('posesStatus');
        this.video = document.getElementById('posesVideo');
        this.canvas = document.getElementById('posesCanvas');
        this.predictionsContainer = document.getElementById('posesPredictions');
        
        this.init();
    }

    async init() {
        try {
            this.setupCanvas();
            this.setupEventListeners();
            console.log('Pose Recognizer initialized');
        } catch (error) {
            window.teachableMachineApp?.handleError(error, 'Pose Recognizer initialization');
        }
    }

    setupCanvas() {
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
            this.canvas.width = 640;
            this.canvas.height = 480;
        }
    }

    setupEventListeners() {
        if (this.button) {
            this.button.addEventListener('click', () => {
                if (this.isActive) {
                    this.stopRecognition();
                } else {
                    this.startRecognition();
                }
            });
        }
    }

    async startRecognition() {
        try {
            window.teachableMachineApp?.updateButtonState(this.button, 'loading', 'Cargando modelo...');

            // Load the Teachable Machine pose model
            const modelURL = this.URL + "model.json";
            const metadataURL = this.URL + "metadata.json";
            
            this.model = await tmPose.load(modelURL, metadataURL);
            this.maxPredictions = this.model.getTotalClasses();

            window.teachableMachineApp?.updateButtonState(this.button, 'loading', 'Iniciando cámara...');

            // Setup Teachable Machine webcam for pose
            const size = 480;
            const flip = true;
            this.webcam = new tmPose.Webcam(size, size, flip);
            await this.webcam.setup();
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
            window.teachableMachineApp?.updateButtonState(this.button, 'active', 'Detener Análisis');
            
            // Start recognition loop
            this.startRecognitionLoop();
            
            window.teachableMachineApp?.showNotification('Reconocimiento de posturas iniciado', 'success');

        } catch (error) {
            window.teachableMachineApp?.handleError(error, 'Pose recognition start');
            window.teachableMachineApp?.updateButtonState(this.button, 'ready', 'Iniciar Análisis');
        }
    }

    stopRecognition() {
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
            
            window.teachableMachineApp?.updateButtonState(this.button, 'ready', 'Iniciar Análisis');
            window.teachableMachineApp?.showNotification('Reconocimiento de posturas detenido', 'info');

        } catch (error) {
            window.teachableMachineApp?.handleError(error, 'Pose recognition stop');
        }
    }

    startRecognitionLoop() {
        const recognize = async () => {
            if (!this.isActive) return;

            try {
                // Update webcam frame
                this.webcam.update();
                
                // Get pose predictions
                const predictions = await this.predict();
                
                // Update predictions display
                window.teachableMachineApp?.displayPredictions('posesPredictions', predictions);
                
            } catch (error) {
                console.error('Recognition loop error:', error);
            }

            // Continue loop
            this.animationId = requestAnimationFrame(recognize);
        };

        recognize();
    }

    clearCanvas() {
        if (this.ctx && this.canvas) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    async predict() {
        if (!this.model || !this.webcam) {
            return [];
        }

        try {
            // Run pose estimation and classification
            const { pose, posenetOutput } = await this.model.estimatePose(this.webcam.canvas);
            const prediction = await this.model.predict(posenetOutput);
            
            // Draw pose on overlay canvas
            this.drawPose(pose);
            
            // Convert to our expected format
            const predictions = prediction.map(p => ({
                className: p.className,
                probability: p.probability
            }));
            
            // Sort by probability (highest first) and return top predictions
            predictions.sort((a, b) => b.probability - a.probability);
            return predictions.slice(0, 5);
            
        } catch (error) {
            window.teachableMachineApp?.handleError(error, 'Pose prediction');
            return [];
        }
    }

    drawPose(pose) {
        if (!this.ctx || !this.webcam.canvas) return;

        // Clear canvas and draw webcam frame
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.webcam.canvas, 0, 0, this.canvas.width, this.canvas.height);

        // Draw pose keypoints and skeleton if pose is detected
        if (pose) {
            const minPartConfidence = 0.5;
            tmPose.drawKeypoints(pose.keypoints, minPartConfidence, this.ctx);
            tmPose.drawSkeleton(pose.keypoints, minPartConfidence, this.ctx);
        }
    }

    /**
     * Clean up resources
     */
    destroy() {
        if (this.isActive) {
            this.stopRecognition();
        }
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.poseRecognizer = new PoseRecognizer();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PoseRecognizer;
}
