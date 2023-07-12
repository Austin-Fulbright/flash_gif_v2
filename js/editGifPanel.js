

document.addEventListener('DOMContentLoaded', function() {
  // Get base64VideoData and set the video source
  chrome.runtime.sendMessage({ name: 'editGifOpen' }, function(response) {
      const base64VideoData = response.data;
      const vid = document.getElementById('video');
      vid.src = base64VideoData;
      vid.autoplay = true;
  });

  // Make crop area resizable and draggable
  $(function() {
      $("#cropArea").resizable({ containment: "#videoContainer" }).draggable({ containment: "#videoContainer" });
  });

  // Add click event listener to cropButton
  document.getElementById('cropButton').addEventListener('click', async function() {
      const cropValues = calculateCropValues();
      const video = document.getElementById('video');
      const base64VideoData = video.src;
      
      // Crop the video
      const croppedVideoData = await cropVideoWithFfmpeg(base64VideoData, cropValues.cropX, cropValues.cropY, cropValues.cropWidth, cropValues.cropHeight);
      
      // Set the src of the video element to the cropped video
      video.src = croppedVideoData;
  });
});

function calculateCropValues() {
  const cropArea = document.getElementById('cropArea');
  const video = document.getElementById('video');

  return {
    cropX: cropArea.offsetLeft,
    cropY: cropArea.offsetTop,
    cropWidth: cropArea.offsetWidth,
    cropHeight: cropArea.offsetHeight,
  };
  
}

async function cropVideoWithFfmpeg(base64VideoData, cropX, cropY, cropWidth, cropHeight) {
  // Convert base64 data to Blob
  const binary = atob(base64VideoData.split(',')[1]);
  let array = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  let uint8Array = new Uint8Array(array);
  const blob = new Blob([uint8Array], { type: 'video/mp4' });

  // Create a FormData object
  const formData = new FormData();
  formData.append('video', blob, 'input.mp4');
  formData.append('cropX', cropX);
  formData.append('cropY', cropY);
  formData.append('cropWidth', cropWidth);
  formData.append('cropHeight', cropHeight);

  // Send a POST request to the server
  const response = await fetch('http://localhost:3000/crop', {
    method: 'POST',
    body: formData
  });

  // Check the response
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Get the response data as a Blob
  const data = await response.blob();

  // Convert it to a URL
  const video = URL.createObjectURL(data);

  return video;
}

