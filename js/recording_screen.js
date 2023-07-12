// Function to fetch a blob from a URL and convert it to base64
const fetchBlob = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const base64 = await convertBlobToBase64(blob);

  return base64;
};

// Function to convert a blob to base64
const convertBlobToBase64 = (blob) => {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;

      resolve(base64data);
    };
  });
};

// Listen for messages from background.js
chrome.runtime.onMessage.addListener((message) => {
  if (message.name === 'startRecordingOnBackground') {
   console.log(message);

  // Ask the user to choose a screen or window to capture
  chrome.desktopCapture.chooseDesktopMedia(
    ['window'],
    function (streamId) {
      // If the user cancelled the prompt, do nothing
      if (streamId == null) {
        return;
      }

      // Once user has chosen screen or window, create a stream from it and start recording
      navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: streamId,
          }
        }
      }).then(stream => {
        const mediaRecorder = new MediaRecorder(stream);

        const chunks = [];

        // When data is available, add it to the chunks array
        mediaRecorder.ondataavailable = function(e) {
          chunks.push(e.data);
        };

        // When recording is stopped, convert the chunks to a blob and then to base64
        mediaRecorder.onstop = async function(e) {
          const blobFile = new Blob(chunks, { type: "video/webm" });
          const base64 = await fetchBlob(URL.createObjectURL(blobFile));
        
          // Send the base64 video data to background.js
          chrome.runtime.sendMessage({name: 'videoData', data: base64});
        
          // Stop all tracks and close the window
          stream.getTracks().forEach(track => track.stop());
          window.close();
        }

        // Start recording
        mediaRecorder.start();
      }).finally(async () => {
        // After all setup, focus on previous tab (where the recording was requested)
        await chrome.tabs.update(message.body.currentTab.id, { active: true, selected: true })
      });
    })
  }
});
