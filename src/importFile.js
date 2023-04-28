ipcRenderer.on('metadata', (event, metadata) => {
    if (metadata.error){
      ifErrorStart()
      return;
    }
    const { filePath, title, artist, cover, duration } = metadata;
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    const length = `${minutes >= 10 ? minutes : "0" + minutes}:${seconds >= 10 ? seconds : "0" + seconds}`;
    const _metadata = {title, artist, cover : cover || "./assets/no-picture.jpg", duration, length}

    let track = new Track(filePath, _metadata, tracklist)

    if (tracklist.tracks.length == 0){
        tracklist.addTrack(track, true, false)
        return
    }
    tracklist.addTrack(track)

    $(".importTrackInput").val('')
});