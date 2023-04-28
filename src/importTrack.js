const { ipcMain } = require('electron');

/** Load file */

// Listen for IPC messages from renderer processes
function loadFile(event, filePath) {
    import('music-metadata').then(async (mm) => {
        try {
            const { name, path } = filePath;
            const metadata = await mm.parseFile(path, { duration: true });
            let { title, picture, artist } = metadata.common;
            const { duration } = metadata.format;
            const cover = picture && picture.length > 0 ? `data:${picture[0].format};base64,${picture[0].data.toString('base64')}` : null;
            const error = !title && !artist && !cover && !duration;
            if (error) {
                event.reply("metadata", { error: error })
                return;
            }
            if (!title){
                title = name
            }
            event.reply("metadata", { filePath, title, artist, cover, duration })
        } catch (err) {
            event.reply("metadata", { error: err })
        }
    }) 
}

module.exports = { loadFile };
