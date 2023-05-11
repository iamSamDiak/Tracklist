class Effects{
    constructor(tracklist){
        this.tracklist = tracklist;
        this.options = this.options()
    }

    getDuration(funcName){
        return this.options.find(item => item.name === funcName).duration
    }

    fadeIn(track){
        if (track.audio.currentTime !== 0){
            return
        }
        
        const duration = this.getDuration("Fade in")
        let audioContext = new AudioContext()
        let mediaElementSource = audioContext.createMediaElementSource(track.audio);
        const gainNode = audioContext.createGain()

        mediaElementSource.connect(gainNode)
        gainNode.connect(audioContext.destination)

        let gain = 0.0
        gainNode.gain.value = gain;

        const interval = 0.1
        const steps = duration / interval
        const incrementStep = 1 / steps; // Amount of gain increment for each step
        let currentStep = 0;

        const fadeInInterval = setInterval(() => {

            currentStep++

            gainNode.gain.value = currentStep * incrementStep;
            console.log("interval")

            if (currentStep >= steps || !this.tracklist.isPlaying) {
                clearInterval(fadeInInterval);
                gainNode.gain.value = 1
            }
        }, interval * 1000)

        track.audio.addEventListener("pause", () => {
            console.log("cleaning up")
            // Clean up the connection
            mediaElementSource.disconnect();
            mediaElementSource = null;
            audioContext.close();
            audioContext = null;
        })

    }

    options(){
        return [
            {
                name: 'Fade in',
                enabled: true,
                duration: 10,
                func: (track) => this.fadeIn(track)
            },
            {
                name: 'Fade out',
                enabled: false,
                duration: 10,
                func: () => console.log('Fade out')
            }
        ]
    }
}