
// Play, pause, next, previous

// Previous
$('.playlist-controls-back').on("click", function() {
    tracklist.previous()
});

// Play/pause
$('.playlist-controls-play-pause').on("click", function() {
    const id = $(".playlist-id")[0].id
    if (tracklist.isPlaying) {
        tracklist.tracks.find(track => track.id === id).pause()
    } else {
        tracklist.tracks.find(track => track.id === id).play()
    }
});

// Next
$('.playlist-controls-forward').on("click", function() {
    tracklist.next()
});

// Update progress
$(".progress-bar-invisible").on({
    click: function(event){
        if (tracklist.trackPlaying == ""){
            return
        }
        const x = event.offsetX;
        const width = this.offsetWidth;
        const percentage = x / width * 100;
        const index = $(".playlist-tracklist-container").find(".active").index()
        console.log(index)
        tracklist.tracks[index].playAtThatPosition(percentage)
    }
})

// On the playlist

const items = $(".playlist-tracklist-container")

items.on("click", ".playlist-tracklist-item-infos", function() {
    const index = $(".playlist-tracklist-item-infos").index(this)
    tracklist.tracks[index].play()
})

items.on("click", ".playlist-tracklist-item-delete-track", function() {
    const index = $(".playlist-tracklist-item-delete-track").index(this)
    tracklist.deleteOnTrackList(index)
})