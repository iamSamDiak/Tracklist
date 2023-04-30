class Track{
    constructor(audio, metadata, Tracklist){
        this.id = (() => Math.random().toString(36).substring(2, 5))()
        this.metadata = metadata
        this.audio = new Audio(audio.path);
        this.playing = false;
        this.Tracklist = Tracklist
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

        this.Tracklist.setActiveTrack(this);

        this.audio.play();
        this.Tracklist.isPlaying = this.playing = true;

        this.audio.addEventListener('ended', () => {
            this.Tracklist.next()
        });
    }

    pause(){
        if (this.Tracklist.tracks.length == 0){
            return
        }

        this.Tracklist.isPlaying = this.playing = false;
        this.audio.pause();
    }

    stop(){
        if (this.Tracklist.tracks.length == 0){
            return
        }

        this.Tracklist.isPlaying = this.playing = false;
        this.audio.pause();
        this.audio.currentTime = 0;
    }

    repeat(){
        if (this.Tracklist.tracks.length == 0){
            return
        }

        this.audio.currentTime = 0;
        this.play()
    }

    playAtThatPosition(time){
        if (this.Tracklist.tracks.length == 0){
            return
        }

        const { duration } = this.metadata;

        this.audio.currentTime = (duration / (1/time)) / 100;
    }

    getCurrentSeconds(){
        return this.audio.currentTime;
    }

    getCurrentTime(){
        const minutes = Math.floor(this.audio.currentTime / 60);
        const remainingSeconds = Math.floor(this.audio.currentTime % 60);
        const minutesFormatted = minutes < 10 ? `0${minutes}` : minutes;
        const secondsFormatted = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
        return `${minutesFormatted}:${secondsFormatted}`;
    }

    getProgress() {
        const { duration } = this.metadata;
        const currentTime = this.getCurrentSeconds();
        const progressPercentage = (currentTime / duration) * 100;
        return progressPercentage.toFixed(2);
    }

}

module.exports = { Track };