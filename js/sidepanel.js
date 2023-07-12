// Function to start recording
const startRecording = () => {
  chrome.runtime.sendMessage({ name: 'startRecording' });
};

// Function to edit gif
const editGif = () => {
  const video = document.getElementById('recordedVideo');
  // This should already be a base64 data URL
  const base64VideoData = video.src;
  
  // Send the base64 video data to background.js
  chrome.runtime.sendMessage({ 
    name: 'editgif', 
    data: base64VideoData
  });
};

// Add event listeners after the DOM has loaded
document.addEventListener('DOMContentLoaded', () => {
  // Event listener for start recording button
  document.getElementById('startRecordingButton').addEventListener('click', startRecording);
  
  // Event listener for edit gif button
  document.getElementById('editGifButton').addEventListener('click', editGif);
});

// Listen for messages from background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.name === 'sendVideo') {
    console.log("Received video data from background.js");
    const base64VideoData = request.data.value;
    
    // Set the src of the video element to the received video data
    const video = document.getElementById('recordedVideo');
    video.src = base64VideoData;
    video.autoplay = true;
  }
});
