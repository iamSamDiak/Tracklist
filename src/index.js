let $ = require('jquery');

const activeTrackSelector = {
    _id: $(".playlist-id"),
    cover: $(".playlist-cover"),
    title: $(".playlist-title p"),
    progress: $(".progress-dot"),
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

let tracklist = new Tracklist(activeTrackSelector, tracklistSelector);

const handler = {
    set(target, property, value) {
        target[property] = value;
        if (value == true) {
            $(".playlist-controls-play-pause").find("img").attr("src", "./assets/pause.png");
        } else {
            $(".playlist-controls-play-pause").find("img").attr("src", "./assets/play.png");
        }
        return true;
    }
};

tracklist = new Proxy(tracklist, handler);