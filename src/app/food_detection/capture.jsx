import React, { useState } from 'react';
import Webcam from 'react-webcam';

const WebcamCapture = ({ imageSrc, setImageSrc }) => {
//   const [imageSrc, setImageSrc] = useState(null);
  
  const videoConstraints = {
    width: 500,
    height: 500,
    facingMode: 'user'
  };
  
  const capture = (getScreenshot) => {
    const screenshot = getScreenshot();
    setImageSrc(screenshot);
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
          height={500}
          screenshotFormat="image/jpeg"
          width={500}
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