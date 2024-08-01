import "./footer.scss";
import { useTheme } from "../../contexts/ThemeContext";

const Footer = () => {
  const { themeColors } = useTheme();
  return (
    <div
      className="footer"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        color: themeColors.mainColor,
      }}
    >
      <span style={{ fontWeight: "normal" }}>© XPAC Technologies Pte Ltd</span>
      <span>Address : 20 Gul Ln, Singapore 629415</span>
      <span>Phone : 6861 0111</span>
    </div>
  );
};

export default Footer;
