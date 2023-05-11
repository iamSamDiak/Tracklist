class Effects{
    constructor(tracklist){
        this.tracklist = tracklist;
        this.options = this.options()
    }

    getDurationStart(funcName){
        return this.options.find(item => item.name === funcName).durationStart
    }

    getDurationEnd(funcName){
        return this.options.find(item => item.name === funcName).durationEnd
    }

    fadeInOut(track){
        if (track.audio.currentTime !== 0){
            // condition to call new Track(...).restoreAudio()
            return
        }
        
        const durationStart = this.getDurationStart("Fade in/out")
        const durationEnd = this.getDurationEnd("Fade in/out")
        let audioContext = new AudioContext()
        let mediaElementSource = audioContext.createMediaElementSource(track.audio);
        const gainNode = audioContext.createGain()

        mediaElementSource.connect(gainNode)
        gainNode.connect(audioContext.destination)

        let gain = 0.0
        gainNode.gain.value = gain

        const interval = 0.1
        const stepsStart = durationStart / interval
        const stepsEnd = durationEnd / interval
        const incrementStep = 1 / stepsStart; // Amount of gain increment for each step
        const decrementStep = 1 / stepsEnd; // Amount of gain increment for each step
        let delta = 1

        const fadeInOutInterval = setInterval(() => {

            let currentTime = Math.floor(track.getCurrentTime() / interval)

            // fade in
            if (currentTime >= stepsStart) {
                gainNode.gain.value = 1
            } else {
                gainNode.gain.value = currentTime * incrementStep;
            }

            // fade out
            if (currentTime >= track.getDuration() / interval - stepsEnd) {
                let decrease = track.getDuration() / interval - currentTime
                delta -= 0.007
                if (delta <= 0) {
                    delta = 0
                }
                gainNode.gain.value = (decrease * decrementStep) * delta
                console.log(gainNode.gain.value)
            }

            if (tracklist.trackPlaying != track.id){
                clearInterval(fadeInOutInterval)
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
                name: 'Fade in/out',
                enabled: true,
                durationStart: 10,
                durationEnd: 15,
                func: (track) => this.fadeInOut(track)
            }
        ]
    }
}