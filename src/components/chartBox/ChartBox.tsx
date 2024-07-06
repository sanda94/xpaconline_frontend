import "./chartBox.scss";
import { useTheme } from "../../contexts/ThemeContext";

const ChartBox = ({
  title,
  count,
  icon,
}: {
  title: string;
  count: number;
  icon: string;
}) => {
  const { themeColors } = useTheme();
  return (
    <div className="chartBox">
      <div className="boxInfo">
        <div className="title" style={{ width: "100%" }}>
          <img src={icon} alt="" style={{ width: "60px" }} />
          <span style={{ color: themeColors.mainColor }}>{title}</span>
        </div>
        <h1 style={{ fontSize: "2.5rem", color: themeColors.mainColor }}>
          {count ? count : "00"}
        </h1>
        {/* <Link to="/" style={{ color: props.color }}>
          View all
        </Link> */}
      </div>
    </div>
  );
};

export default ChartBox;
