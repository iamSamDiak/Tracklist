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

        console.log(( duration / (1/time)) / 100)
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

    spectrum(){
        // Wait for audio to be loaded
        this.audio.addEventListener('loadeddata', () => {
            // Get audio context
            const audioContext = new AudioContext();

            // Create audio source node
            const sourceNode = audioContext.createMediaElementSource(audio);

            // Create analyser node
            const analyserNode = audioContext.createAnalyser();
            analyserNode.fftSize = 2048;

            // Connect audio source node to analyser node
            sourceNode.connect(analyserNode);

            // Connect analyser node to audio context destination
            analyserNode.connect(audioContext.destination);

            // Get frequency data
            const bufferLength = analyserNode.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            analyserNode.getByteFrequencyData(dataArray);

            // Create canvas
            const canvas = document.querySelector('canvas');
            canvas.width = bufferLength;
            canvas.height = 100;
            const ctx = canvas.getContext('2d');

        // Draw spectrum on canvas
            function draw() {
                requestAnimationFrame(draw);
                analyserNode.getByteFrequencyData(dataArray);
                ctx.fillStyle = '#e4e4e4';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                const barWidth = canvas.width / bufferLength;
                let x = 0;
                for (let i = 0; i < bufferLength; i++) {
                    const barHeight = dataArray[i] / 2;
                    ctx.fillStyle = `rgba(50, 50, 50, 0.${barHeight})`;
                    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                    x += barWidth;
                }
            }
            draw();
        })
    }
}

module.exports = { Track };