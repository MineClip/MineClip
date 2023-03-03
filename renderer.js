const { app, desktopCapturer, dialog } = require('electron');
const { createWriteStream, mkdirSync } = require('fs');
const { screen } = require('electron').remote;
const path = require('path');

let recorder = null;

function startRecording() {
  desktopCapturer.getSources({ types: ['screen'] }).then(async sources => {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    const startTime = new Date().getTime();
    const directory = path.join(app.getPath('videos'), 'MineClip');

    // create the MineClip directory if it doesn't exist
    if (!fs.existsSync(directory)) {
      mkdirSync(directory);
    }

    const fileStream = createWriteStream(path.join(directory, `output-${startTime}.webm`));

    // Select source and start recording
    const source = sources.find(source => source.name === 'Entire screen');
    recorder = new MediaRecorder(await source.display.mediaStream, {
      mimeType: 'video/webm'
    });
    recorder.ondataavailable = e => fileStream.write(e.data);
    recorder.start();
  }).catch(error => console.log(error));
}

function stopRecording() {
  if (recorder) {
    recorder.stop();
  }
}

const recordBtn = document.getElementById('record-btn');
recordBtn.addEventListener('click', startRecording);

const stopBtn = document.getElementById('stop-btn');
stopBtn.addEventListener('click', stopRecording);
