class Tracklist{
    constructor(activeTrackSelector, tracklistSelector){
        this.tracks = [];
        this.isPlaying = false;
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
    

    addTrack(track, addToList = false, autoplay = true){
        this.tracks.push(track);
        if (addToList){
            this.setActiveTrack(track, addToList, autoplay);
            return
        }
        this.addToTracklist(track.metadata, track.id)
    }

    getTracks(){
        return this.tracks;
    }

    deleteTrack(index){
        const { track, item } = this.tracklistSelector;

        this.tracks.splice(index, 1);
        track.find(item).eq(index).remove();
    }

    setActiveTrack(_track, addToList = false){

        // If the id of the active track has changed
        if (this.trackPlaying != _track.id){   
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
            progress.css("left", `${_track.getProgress()}%`);
            start.text(_track.getCurrentTime());
        })
        // Set the track length
        end.text(metadata.length);

        if (addToList){
            this.addToTracklist(metadata, _track.id)
        }
    }

    addToTracklist(metadata, id){
        const { artist, cover, title, length } = metadata;
        this.tracklistSelector.track.append(`
        <div id="${id}" class="playlist-tracklist-item">
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
                if (this.tracks[i].getCurrentSeconds() >= 2 && !afterDelete){
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

    next(){
        let active;
        const { _id } = this.activeTrackSelector;
        for (let i = 0; i < this.tracks.length; i++){
            if (this.tracks[i].id == _id[0].id && i < this.tracks.length - 1){
                this.tracks[i + 1].play();
                return
            }
            active = i
        }
        //if playlist is finished
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