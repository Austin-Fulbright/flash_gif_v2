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
  document.getElementById('cropButton').addEventListener('click', function() {
      const cropValues = calculateCropValues();
      const video = document.getElementById('video');
      const base64VideoData = video.src;
      
      // Crop the video
      const croppedVideoData = cropVideoWithFfmpeg(base64VideoData, cropValues.cropX, cropValues.cropY, cropValues.cropWidth, cropValues.cropHeight);
      
      // Set the src of the video element to the cropped video
      video.src = croppedVideoData;
  });
});

function calculateCropValues() {
  const cropArea = document.getElementById('cropArea');
  const video = document.getElementById('video');

  return {
      cropX: cropArea.offsetLeft / video.videoWidth,
      cropY: cropArea.offsetTop / video.videoHeight,
      cropWidth: cropArea.offsetWidth / video.videoWidth,
      cropHeight: cropArea.offsetHeight / video.videoHeight,
  };
}

function cropVideoWithFfmpeg(base64VideoData, cropX, cropY, cropWidth, cropHeight) {
  // This is a placeholder - you'll need to replace this with actual ffmpeg.js code
  // Implement this function with ffmpeg or another type of cropping algorithm
  return base64VideoData;
}
