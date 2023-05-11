class Tracklist{
    constructor(activeTrackSelector, tracklistSelector){
        this.tracks = [];
        this.volume = 1
        this.isPlaying = false;
        this.mouseOnProgress = false;
        this.trackPlaying = ''
        this.activeTrackSelector = activeTrackSelector,
        this.tracklistSelector = tracklistSelector
    }

    /*
        tracklistSelector :
            - track
            - item
            - active
            - cover
            - title
            - duration
        activeTrackSelector :
            - _id
            - cover
            - title
            - progress
            - start
            - end
    */

    addTrack(track, setActive = false){
        this.tracks.push(track);
        this.addToTracklist(track, setActive)
    }

    getTracks(){
        return this.tracks;
    }

    deleteTrack(index){
        const { track, item } = this.tracklistSelector;

        this.tracks.splice(index, 1);
        track.find(item).eq(index).remove();
    }

    addToTracklist(track, setActive = false){
        const { artist, cover, title, length } = track.metadata;
        this.tracklistSelector.track.append(`
        <div id="${track.id}" class="playlist-tracklist-item">
            <div class="playlist-tracklist-item-infos">
                <div class="playlist-tracklist-item-cover" style="background-image: url('${cover}')">
                </div>
                <div class="playlist-tracklist-item-title">
                    <p>${title}${artist ? " - " + artist : ''}</p>
                </div>
                <div class="playlist-tracklist-item-duration">
                    <p>${length}</p>
                </div>
            </div>
            <div class="playlist-tracklist-item-delete-track">
                <img src="./assets/close_track.png" alt="">
            </div>
        </div>
        `)

        if (setActive){
            this.setActiveTrack(track)
        }
    }


    setActiveTrack(_track, crossover = false){
        // If the id of the active track has changed
        // And if fade in/out crossover enabled
        if (this.trackPlaying != _track.id && !crossover){   
            for (const t of this.tracks) {
                t.stop()
            }
        }

        this.trackPlaying = _track.id;

        const { _id, cover, title, progress, start, end } = this.activeTrackSelector;
        const { track, item, active } = this.tracklistSelector;
        const { metadata } = this.tracks.find(t => t.id === _track.id);

        /*************** Setting UI  ****************/
        
        // Set id selector
        _id[0].id = _track.id
        //Remove the "active" class to all elements
        track.find(item).removeClass(active);
        //Add the "active" class
        track.find(`#${_id[0].id}`).addClass(active);
        // Set cover in Element background
        cover.css("background-image", `url( ${metadata.cover} )`);
        // Set the track title in the HTML
        title.text(`${metadata.title}`);
        if (metadata.artist){
            // Set the track title and the artist if it is set
            title.text(`${metadata.title} - ${metadata.artist}`);
        }

        // Get current time
        _track.audio.addEventListener("timeupdate", () => {
            if (!this.mouseOnProgress && _id[0].id == _track.id){
                progress.val(`${_track.getProgress()}`);
                start.text(_track.getCurrentMinutes());
            }
        })

        // Set the track length
        end.text(metadata.length);
    }

    setVolume(volume){
        for (const t of this.tracks) {
            t.audio.volume = this.volume = volume/100
        }
    }

    deleteOnTrackList(index){
        const track = this.tracks[index];
        const { _id } = this.activeTrackSelector;

        if (this.tracks.length == 1){
            this.empty();
            return;
        }
        
        if (_id[0].id == track.id && this.tracks.length > 1){
            if (this.tracks[0].id == track.id) {
                this.next()
            } else {
                this.previous(true)
            }
        }

        this.deleteTrack(index);
    }

    previous(afterDelete = false){
        let active;
        const { _id } = this.activeTrackSelector;
        for (let i = 0; i < this.tracks.length; i++){
            if (this.tracks[i].id == _id[0].id){
                if (this.tracks[i].getCurrentTime() >= 2 && !afterDelete){
                    this.tracks[i].repeat();
                    return
                } else if (i > 0) {
                    this.tracks[i - 1].play();
                    return
                }
            }
            active = i
        }
        //if playlist is set at the beginning
        this.tracks[active].stop();
    }

    next(crossover = false){
        let active;
        const { _id } = this.activeTrackSelector;
        for (let i = 0; i < this.tracks.length; i++){
            if (this.tracks[i].id == _id[0].id && i < this.tracks.length - 1){
                this.tracks[i + 1].play(crossover);
                return
            }
            active = i
        }
        // if playlist is finished
        this.tracks[active].stop();
    }

    empty(){
        for (const track of this.tracks) {
            track.stop()
        }
        this.tracks = [];
        this.isPlaying = false;
        this.resetDom()
    }

    resetDom(){
        const { cover, title, start, end } = this.activeTrackSelector
        const { track } = this.tracklistSelector

        track.empty()
        cover.css("background-image", "")    
        title.text("No track")
        start.text("00:00")
        end.text("00:00")
    }

}