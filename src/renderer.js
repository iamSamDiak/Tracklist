const { ipcRenderer } = require('electron');

const closeButton = document.querySelector('.close')
const hideButton = document.querySelector('.minimize')

hideButton.addEventListener('click', () => {
    ipcRenderer.send('minimize-window');
});

closeButton.addEventListener('click', () => {
  ipcRenderer.send('close-window');
});

const importFile = document.querySelectorAll(".playlist-tracklist-import div")
const inputFileInput = document.querySelector(".importTrackInput")

for (let i = 0; i < importFile.length; i++) {
  importFile[i].addEventListener('click', () => {
    inputFileInput.click()
  });
}

inputFileInput.addEventListener('change', () => {
  const file = inputFileInput.files[0];
  const fileReader = {
    path: file.path,
    name: file.name
  };
  ipcRenderer.send("get-metadata", fileReader);
});
