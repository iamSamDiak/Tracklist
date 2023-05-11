class Track{
    constructor(audio, metadata, Tracklist, activeSelector, effects){
        this.id = (() => Math.random().toString(36).substring(2, 5))()
        this.path = audio.path
        this.metadata = metadata
        this.audio = new Audio(this.path);
        this.Tracklist = Tracklist
        this.activeSelector = activeSelector
        this.effects = effects
    }

    /*
        metadata :
            - title
            - artist
            - cover
            - duration
            - length
     */

    play(){
        if (this.Tracklist.tracks.length == 0){
            return
        }

        if (this.audio.currentTime == 0){
            this.restoreAudio()
        }

        const { selector, button} = this.activeSelector;

        this.Tracklist.setActiveTrack(this);
        this.audio.volume = this.Tracklist.volume

        //Effects
        for (const effect of this.effects.options){
            if (effect.enabled){
                effect.func(this)
            }
        }

        this.audio.play();

        selector.find("img").attr("src", button.pause);
        this.Tracklist.isPlaying = true;

        this.audio.addEventListener('ended', () => {
            this.stop()
            this.Tracklist.next()
        });

    }
    
    pause(){
        if (this.Tracklist.tracks.length == 0){
            return
        }
        
        const { selector, button} = this.activeSelector;
        this.Tracklist.isPlaying = false;
        this.audio.pause();
        selector.find("img").attr("src", button.play);
    }
    
    stop(){
        if (this.Tracklist.tracks.length == 0){
            return
        }
        
        const { selector, button} = this.activeSelector;
        this.Tracklist.isPlaying = false;
        this.audio.pause();
        this.audio.currentTime = 0;
        selector.find("img").attr("src", button.play);
    }
    
    repeat(){
        if (this.Tracklist.tracks.length == 0){
            return
        }
        
        this.audio.pause()
        this.audio.currentTime = 0;
        this.audio.addEventListener('canplay', () => {
            this.play()
        })
    }

    playAtThatPosition(time){
        if (this.Tracklist.tracks.length == 0){
            return
        }

        const { duration } = this.metadata;

        this.audio.currentTime = (duration / (1/time)) / 100;
    }

    getCurrentTime(){
        return this.audio.currentTime;
    }

    getDuration(){
        return this.audio.duration;
    }

    getCurrentMinutes(){
        const minutes = Math.floor(this.audio.currentTime / 60);
        const remainingSeconds = Math.floor(this.audio.currentTime % 60);
        const minutesFormatted = minutes < 10 ? `0${minutes}` : minutes;
        const secondsFormatted = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
        return `${minutesFormatted}:${secondsFormatted}`;
    }

    getProgress() {
        const { duration } = this.metadata;
        const currentTime = this.getCurrentTime();
        const progressPercentage = (currentTime / duration) * 100;
        return progressPercentage.toFixed(2);
    }

    restoreAudio(){
        this.audio = new Audio(this.path);
    }
}