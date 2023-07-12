const startRecording = () => {
  chrome.runtime.sendMessage({ name: 'startRecording' });
};

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('startRecordingButton').addEventListener('click', startRecording);
});

const stopRecording = () => {
  chrome.runtime.sendMessage({ name: 'stop' });
};

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('Stop').addEventListener('click', stopRecording);
});