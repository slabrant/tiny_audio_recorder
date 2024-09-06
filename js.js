if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia)
    throw new Error('You have no media input devices.');

navigator.mediaDevices.getUserMedia({audio: true}).then(stream => {
    const recordButton = document.getElementById('record');
    const downloadLink = document.getElementById('download');
    const recorder = new MediaRecorder(stream);
    let chunks;

    recordButton.addEventListener('click', () => {
        if (recorder.state === 'inactive') {
            recorder.start();
            recordButton.style.background = 'red';

            chunks = [];
            recorder.ondataavailable = (e) => {
                chunks.push(e.data);
            }
        }
        else {
            recorder.stop();
            recordButton.style.background = 'gray';

            recorder.onstop = () => {
                const blob = new Blob(chunks, {type: 'audio/wav'});
                downloadLink.href = URL.createObjectURL(blob);
                downloadLink.download = (new Date).toISOString() + '.wav';
                downloadLink.click();
            }
        }
    });
}).catch(error => console.error('Error finding an audio device: ' + error));