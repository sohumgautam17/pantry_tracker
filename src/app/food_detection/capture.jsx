import React, { useState } from 'react';
import Webcam from 'react-webcam';

const WebcamCapture = ({ onCapture }) => {
  const [imageSrc, setImageSrc] = useState(null);
  
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: 'user'
  };
  
  const capture = (getScreenshot) => {
    const screenshot = getScreenshot();
    setImageSrc(screenshot);
    
    if (onCapture) {
      onCapture(screenshot);
    }
  };
  
  const retake = () => {
    setImageSrc(null);
  };
  
  return (
    <div className="webcam-container">
      {imageSrc ? (
        <div className="webcam-result">
          <img src={imageSrc} alt="webcam capture" />
          <div className="button-container">
            <button onClick={retake}>Retake Photo</button>
          </div>
        </div>
      ) : (
        <Webcam
          audio={false}
          height={720}
          screenshotFormat="image/jpeg"
          width={1280}
          videoConstraints={videoConstraints}
        >
          {({ getScreenshot }) => (
            <button onClick={() => capture(getScreenshot)}>
              Capture Photo
            </button>
          )}
        </Webcam>
      )}
    </div>
  );
};

export default WebcamCapture;