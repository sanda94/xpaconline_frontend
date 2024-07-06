import "./imagePopup.scss"; // Import the SCSS file
import { useTheme } from "../../contexts/ThemeContext";

interface ImagePopupProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
}

const ImagePopup: React.FC<ImagePopupProps> = ({
  isOpen,
  onClose,
  imageSrc,
}) => {
  const { themeColors } = useTheme();
  return (
    <div className={`popup-container ${isOpen ? "open" : "closed"}`}>
      <div
        className="popup-content"
        style={{ backgroundColor: themeColors.softBg }}
      >
        <img src={imageSrc} alt="" />
        <button type="button" onClick={onClose} className="img-close-btn">
          Close
        </button>
      </div>
    </div>
  );
};

export default ImagePopup;
