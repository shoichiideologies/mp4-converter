import './index.css';

import('@ffmpeg/ffmpeg').then(({ createFFmpeg, fetchFile }) => {
  const ffmpeg = createFFmpeg({ log: true });

  window.addEventListener('DOMContentLoaded', () => {
    console.log('renderer.js loaded');

    const videoInput = document.getElementById('video');
    const convertButton = document.getElementById('convertBtn');

    convertButton.addEventListener('click', async () => {
      console.log('Convert button clicked');

      const file = videoInput.files[0];
      if (!file) {
        alert('Please upload a video file.');
        return;
      }

      try {
        if (!ffmpeg.isLoaded()) {
          console.log('Loading FFmpeg...');
          await ffmpeg.load();
          console.log('FFmpeg loaded');
        }

        const inputName = 'input.' + file.name.split('.').pop();
        const outputName = 'output.mp4';

        console.log(`Writing file ${inputName}`);
        ffmpeg.FS('writeFile', inputName, await fetchFile(file));

        console.log(`Running conversion: ${inputName} → ${outputName}`);
        await ffmpeg.run('-i', inputName, outputName);

        console.log(`Reading output: ${outputName}`);
        const data = ffmpeg.FS('readFile', outputName);
        const mp4Buffer = data.buffer;

        // Send it to main process to save
        window.electronAPI.saveVideo(mp4Buffer, file.name.replace(/\.\w+$/, '.mp4'));

        console.log('Conversion complete. Video saved.');
      } catch (err) {
        console.error('Conversion failed:', err);
        alert('An error occurred during conversion. See DevTools for details.');
      }
    });
  });
});