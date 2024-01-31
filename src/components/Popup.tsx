import React, { useState, useEffect } from "react";
import "../styles/Calendar.css";

type PopupProps = {
  title: string;
  summary: string;
  imageFilenameFull: string;
  learnMoreLink: string;
  purchaseLink: string;
  onClose: () => void;
};

const Popup: React.FC<PopupProps> = ({
  title,
  summary,
  imageFilenameFull,
  onClose,
  learnMoreLink,
  purchaseLink,
}) => {
  const [imageLoaded, setImageLoaded] = useState(true);

  // Determine the image file extension (webp or jpeg)
  const imageFileExtension = imageFilenameFull.endsWith(".jpeg")
    ? "jpeg"
    : "webp";
  const backgroundImageUrl = `/images/${imageFilenameFull}.${imageFileExtension}`;

  useEffect(() => {
    const img = new Image();
    img.src = backgroundImageUrl;
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageLoaded(false);
  }, [backgroundImageUrl]);

  const fallbackStyle = {
    backgroundColor: "#f0f0f0",
    color: "#333",
  };

  const backgroundImageStyle = {
    backgroundImage: `url('${backgroundImageUrl}')`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    ...(imageLoaded ? {} : fallbackStyle),
  };

  return (
    <div className={"popupOverlay"}>
      <div className={"popup"} style={backgroundImageStyle}>
        <button onClick={onClose} className={"closeButton"}>
          Close
        </button>
        <h2>{title}</h2>
        <h3>{summary}</h3>
        <a href={learnMoreLink} target="_blank" rel="noopener noreferrer">
          <button className={"learnMoreButton"}>Learn More</button>
        </a>
        <a href={purchaseLink} target="_blank" rel="noopener noreferrer">
          <button className={"buyNowButton"}>Buy Now</button>
        </a>
      </div>
    </div>
  );
};

export default Popup;
