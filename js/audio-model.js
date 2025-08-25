/**
 * Audio Classification Module for Teachable Machine
 * Handles audio recording, processing, and model predictions
 */

class AudioClassifier {
    constructor() {
        this.isListening = false;
        this.recognizer = null;
        this.classLabels = [];
        this.canvas = null;
        this.canvasContext = null;
        this.animationId = null;
        
        // Teachable Machine model URL
        this.URL = "https://teachablemachine.withgoogle.com/models/gsG07BTw4/";
        
        // UI elements
        this.button = document.getElementById('audioBtn');
        this.status = document.getElementById('audioStatus');
        this.canvas = document.getElementById('audioCanvas');
        this.predictionsContainer = document.getElementById('audioPredictions');
        
        this.init();
    }

    async init() {
        try {
            this.setupCanvas();
            this.setupEventListeners();
            console.log('Audio Classifier initialized');
        } catch (error) {
            window.teachableMachineApp?.handleError(error, 'Audio Classifier initialization');
        }
    }

    setupCanvas() {
        if (this.canvas) {
            this.canvasContext = this.canvas.getContext('2d');
            this.canvas.width = 300;
            this.canvas.height = 100;
        }
    }

    setupEventListeners() {
        if (this.button) {
            this.button.addEventListener('click', () => {
                if (this.isListening) {
                    this.stopListening();
                } else {
                    this.startListening();
                }
            });
        }
    }

    async startListening() {
        try {
            window.teachableMachineApp?.updateButtonState(this.button, 'loading', 'Cargando modelo...');

            // Create the Teachable Machine audio model
            this.recognizer = await this.createModel();
            this.classLabels = this.recognizer.wordLabels();

            window.teachableMachineApp?.updateButtonState(this.button, 'loading', 'Iniciando escucha...');

            // Start listening
            this.recognizer.listen(result => {
                const scores = result.scores;
                
                // Convert to our expected format
                const predictions = this.classLabels.map((label, index) => ({
                    className: label,
                    probability: scores[index]
                }));

                // Sort by probability and display
                predictions.sort((a, b) => b.probability - a.probability);
                window.teachableMachineApp?.displayPredictions('audioPredictions', predictions.slice(0, 5));
                
                // Update visualization
                this.updateVisualization(scores);
                
            }, {
                includeSpectrogram: true,
                probabilityThreshold: 0.75,
                invokeCallbackOnNoiseAndUnknown: true,
                overlapFactor: 0.50
            });

            this.isListening = true;
            window.teachableMachineApp?.updateButtonState(this.button, 'active', 'Detener Escucha');
            this.startVisualization();
            
            window.teachableMachineApp?.showNotification('Reconocimiento de audio iniciado', 'success');

        } catch (error) {
            window.teachableMachineApp?.handleError(error, 'Audio listening start');
            window.teachableMachineApp?.updateButtonState(this.button, 'ready', 'Iniciar Grabación');
        }
    }

    stopListening() {
        try {
            if (this.recognizer && this.isListening) {
                this.recognizer.stopListening();
            }

            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
            }

            this.isListening = false;
            this.clearCanvas();
            
            window.teachableMachineApp?.updateButtonState(this.button, 'ready', 'Iniciar Grabación');
            window.teachableMachineApp?.showNotification('Reconocimiento de audio detenido', 'info');

        } catch (error) {
            window.teachableMachineApp?.handleError(error, 'Audio listening stop');
            window.teachableMachineApp?.updateButtonState(this.button, 'ready', 'Iniciar Grabación');
        }
    }

    startVisualization() {
        if (!this.canvasContext) return;

        const draw = () => {
            if (!this.isListening) return;

            this.animationId = requestAnimationFrame(draw);
            
            // Simple animated visualization for audio listening
            this.canvasContext.fillStyle = 'rgba(30, 41, 59, 0.3)';
            this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Draw animated listening indicator
            const time = Date.now() * 0.005;
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;
            
            for (let i = 0; i < 5; i++) {
                const radius = 10 + i * 8 + Math.sin(time + i * 0.5) * 5;
                const alpha = 0.8 - i * 0.15;
                
                this.canvasContext.beginPath();
                this.canvasContext.arc(centerX, centerY, radius, 0, 2 * Math.PI);
                this.canvasContext.strokeStyle = `rgba(79, 70, 229, ${alpha})`;
                this.canvasContext.lineWidth = 2;
                this.canvasContext.stroke();
            }
        };
        
        draw();
    }

    clearCanvas() {
        if (this.canvasContext) {
            this.canvasContext.fillStyle = 'rgba(30, 41, 59, 0.1)';
            this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Draw placeholder waveform
            this.canvasContext.strokeStyle = 'rgba(79, 70, 229, 0.3)';
            this.canvasContext.lineWidth = 2;
            this.canvasContext.beginPath();
            this.canvasContext.moveTo(0, this.canvas.height / 2);
            this.canvasContext.lineTo(this.canvas.width, this.canvas.height / 2);
            this.canvasContext.stroke();
        }
    }

    async createModel() {
        const checkpointURL = this.URL + "model.json";
        const metadataURL = this.URL + "metadata.json";

        const recognizer = speechCommands.create(
            "BROWSER_FFT",
            undefined,
            checkpointURL,
            metadataURL
        );

        await recognizer.ensureModelLoaded();
        return recognizer;
    }

    updateVisualization(scores) {
        if (!this.canvasContext || !scores) return;

        // Clear canvas
        this.canvasContext.fillStyle = 'rgba(30, 41, 59, 0.3)';
        this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw bars for each class prediction
        const barWidth = this.canvas.width / scores.length;
        
        scores.forEach((score, index) => {
            const barHeight = score * this.canvas.height * 0.8;
            const x = index * barWidth;
            const y = this.canvas.height - barHeight;

            const gradient = this.canvasContext.createLinearGradient(0, this.canvas.height, 0, y);
            gradient.addColorStop(0, '#f59e0b');
            gradient.addColorStop(1, '#f97316');

            this.canvasContext.fillStyle = gradient;
            this.canvasContext.fillRect(x, y, barWidth - 2, barHeight);
        });
    }


    /**
     * Clean up resources
     */
    destroy() {
        if (this.isListening) {
            this.stopListening();
        }
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.recognizer) {
            this.recognizer.stopListening();
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.audioClassifier = new AudioClassifier();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioClassifier;
}
