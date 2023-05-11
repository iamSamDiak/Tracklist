let $ = require('jquery');

const activeTrackSelector = {
    _id: $(".playlist-id"),
    cover: $(".playlist-cover"),
    title: $(".playlist-title p"),
    progress: $(".progress-bar"),
    start: $(".playlist-timeline-start p"),
    end: $(".playlist-timeline-end p")
}

const tracklistSelector = {
    track: $(".playlist-tracklist-container"),
    item: ".playlist-tracklist-item",
    active: "active",
    cover: $(".playlist-tracklist-item-cover"),
    title: $(".playlist-tracklist-item-title p"),
    duration: $(".playlist-tracklist-item-duration p")
}

const tracklist = new Tracklist(activeTrackSelector, tracklistSelector);
const effects = new Effects(tracklist);