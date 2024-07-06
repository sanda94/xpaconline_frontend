import CircularProgressBar from "../CircularProgressBar/CircularProgressBar";
import { useTheme } from "../../contexts/ThemeContext";

const SummaryCard = ({
  id,
  deviceTitle,
  itemCount,
  batteryPercentage,
}: {
  id: any;
  deviceTitle: any;
  itemCount: any;
  batteryPercentage: any;
}) => {
  const { themeColors } = useTheme();
  console.log("batteryPercentage");
  return (
    <div
      style={{
        position: "relative",
        padding: "15px",
        backgroundColor: "transparent",
        border: `solid 2px ${themeColors.mainColor}`,
        borderRadius: "10px",
      }}
    >
      <p
        style={{
          fontSize: "0.65 rem",
          marginBottom: "5px",
          color: themeColors.mainColor,
        }}
      >
        ID : {id}
      </p>
      <p style={{ fontSize: "0.65 rem", color: themeColors.mainColor }}>
        Device Title : {deviceTitle}
      </p>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgressBar
          CurrentValue={parseFloat(itemCount)}
          StartValue={0}
          EndValue={100}
          LowValue={20}
          HighValue={80}
          Units={""}
          InnerColor={"#f78f5e"}
          TextColor={"#000000"}
          Icon={"/items1.svg"}
          Title={"Item Count"}
        />
        <div
          style={{
            position: "absolute",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            padding: "5px",
            borderRadius: "10px",
            border: "#000000 solid 1px",
            bottom: "10px",
            right: "10px",
            backgroundColor: "#ffffff",
          }}
        >
          <div
            style={{
              maxWidth: "30px",
              maxHeight: "auto",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src="/battery1.svg"
              alt="battery"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <p
            style={{
              marginLeft: "5px",
              fontSize: "1.1rem",
              color: "#000000",
            }}
          >
            {parseFloat(batteryPercentage)}%
          </p>
        </div>
        {/* <CircularProgressBar
          CurrentValue={parseFloat(batteryPercentage)}
          StartValue={0}
          EndValue={100}
          LowValue={20}
          HighValue={80}
          Units={"%"}
          InnerColor={"#5e99f7"}
          TextColor={"#000000"}
          Icon={"/battery1.svg"}
          Title={"Battery Percentage"}
        /> */}
      </div>
    </div>
  );
};
export default SummaryCard;
