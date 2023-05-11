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
            // condition to call new Track(...).restoreAudio()
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

        const fadeInInterval = setInterval(() => {

            let currentTime = Math.floor(track.getCurrentTime() / interval)

            gainNode.gain.value = currentTime * incrementStep;

            if (currentTime >= steps) {
                //clearInterval(fadeInInterval);
                gainNode.gain.value = 1
            }

            if (tracklist.trackPlaying != track.id){
                clearInterval(fadeInInterval)
            }

        }, interval * 1000)

        track.audio.addEventListener("pause", () => {
            if (!this.tracklist.isPlaying){
                return
            }
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