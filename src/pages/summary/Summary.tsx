import "./summary.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SummaryCard from "../../components/summaryCard/SummaryCard";
import { useTheme } from "../../contexts/ThemeContext";

const Summary = () => {
  const { themeColors } = useTheme();
  // Devices data
  const [DevicesData, SetDevicesData] = useState<any[]>([]);
  console.log(DevicesData);

  let navigate = useNavigate();

  useEffect(() => {
    const storedUserString = localStorage.getItem("user");
    if (storedUserString) {
      const storedUser = JSON.parse(storedUserString);
      console.log(storedUser);
      navigate("/summary");
    } else {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    fetchDevices();

    const intervalId = setInterval(() => {
      fetchDevices();
    }, 600000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  // Fetch devices
  const fetchDevices = async () => {
    const storedUserString = localStorage.getItem("user");
    if (storedUserString) {
      const storedUser = JSON.parse(storedUserString);
      const headers = {
        token: `Bearer ${storedUser.accessToken}`,
      };

      try {
        if (
          storedUser.userType == "admin" ||
          storedUser.userType == "moderator"
        ) {
          const response = await axios.get(
            "http://104.245.34.253:3300/api/device/all",
            { headers }
          );
          console.log(response.data.devices);
          SetDevicesData(response.data.devices);
        } else {
          const response = await axios.get(
            `http://104.245.34.253:3300/api/device/user/all`,
            { headers }
          );
          console.log(response.data.devices);
          SetDevicesData(response.data.devices);
        }
      } catch (error) {
        // Handle errors here
        console.error("Error fetching data:", error);
      }
    }
  };

  const downloadExcel = async (data: any) => {
    const storedUserString = localStorage.getItem("user");
    if (storedUserString) {
      const storedUser = JSON.parse(storedUserString);
      const headers = {
        token: `Bearer ${storedUser.accessToken}`,
      };

      try {
        const response = await axios.post(
          "http://104.245.34.253:3300/api/excel/devices",
          data,
          { headers }
        );
        if (response.data.status) {
          window.open(
            "http://104.245.34.253:3300/downloads/all_devices_data.xlsx",
            "_blank"
          );
        }
      } catch (error) {
        // Handle errors here
        console.error("Error fetching data:", error);
      }
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h1 style={{ color: themeColors.mainColor }}>Summary</h1>
        {DevicesData.some((item) => item.deviceData) ? (
          <button
            onClick={() => downloadExcel(DevicesData)}
            style={{ marginLeft: "30px" }}
          >
            Download Excel
          </button>
        ) : null}
      </div>
      <div className="home">
        {DevicesData.length > 0 ? (
          DevicesData.map((item, index) =>
            item.deviceData ? (
              <SummaryCard
                key={Date.now() + index}
                id={item._id}
                deviceTitle={item.title}
                itemCount={Number(item.deviceData.itemCount)}
                batteryPercentage={Number(item.deviceData.batteryPercentage)}
              />
            ) : null
          )
        ) : (
          <p>No Data Available...</p>
        )}
      </div>
    </div>
  );
};

export default Summary;
