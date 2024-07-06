import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./singleDevice.scss";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Circle from "../circle/Circle";
import DeviceFormPopup from "../DeviceFormPopup/DeviceFormPopup";
import ImagePopup from "../ImagePopup/ImagePopup";
import CircularProgressBar from "../CircularProgressBar/CircularProgressBar";
import { useTheme } from "../../contexts/ThemeContext";

const SingleDevice = () => {
  const { themeColors } = useTheme();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImgPopupOpen, setIsImgPopupOpen] = useState(false);

  // Device recent data
  const [DeviceRecentData, SetDeviceRecentData] = useState<any[]>([]);

  const [ChartData, SetChartData] = useState([]);
  console.log(ChartData);

  const [UserType, SetUserType] = useState("");

  // Chart type
  const [ChartType, SetChartType] = useState("monthly");

  const params = useParams();
  console.log(params);

  let navigate = useNavigate();

  const openForm = () => {
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  const openImgPopup = () => {
    setIsImgPopupOpen(true);
  };

  const closeImgPopup = () => {
    setIsImgPopupOpen(false);
  };

  useEffect(() => {
    if (params.id) {
      fetchDeviceRecentData();
    }
  }, [params.id, isFormOpen]);

  const handleChange = (event: SelectChangeEvent) => {
    SetChartType(event.target.value as string);
  };

  useEffect(() => {
    fetchChartData();

    const intervalId = setInterval(() => {
      fetchChartData();
    }, 600000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    fetchChartData();
  }, [ChartType]);

  useEffect(() => {
    const storedUserString = localStorage.getItem("user");
    if (storedUserString) {
      const storedUser = JSON.parse(storedUserString);
      console.log(storedUser);
      SetUserType(storedUser.userType);
      navigate("/products/" + params.id);
    } else {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    fetchDeviceRecentData();

    const intervalId = setInterval(() => {
      fetchDeviceRecentData();
    }, 600000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  // Fetch device count data
  const fetchDeviceRecentData = async () => {
    const storedUserString = localStorage.getItem("user");
    if (storedUserString) {
      const storedUser = JSON.parse(storedUserString);
      const headers = {
        token: `Bearer ${storedUser.accessToken}`,
      };

      try {
        const response = await axios.get(
          "http://104.245.34.253:3300/api/device/one/" + params.id,
          { headers }
        );
        console.log("first");
        console.log(response.data.weighingDeviceData);
        SetDeviceRecentData(response.data.weighingDeviceData);
      } catch (error) {
        // Handle errors here
        console.error("Error fetching data:", error);
      }
    }
  };

  // Fetch device count data
  const fetchChartData = async () => {
    const storedUserString = localStorage.getItem("user");
    if (storedUserString) {
      const storedUser = JSON.parse(storedUserString);
      const headers = {
        token: `Bearer ${storedUser.accessToken}`,
      };

      try {
        const response = await axios.get(
          "http://104.245.34.253:3300/api/device/all/" +
            params.id +
            "?period=" +
            ChartType,
          { headers }
        );
        console.log("first");
        console.log(
          response.data.weighingDeviceData.length > 0
            ? response.data.weighingDeviceData[0].deviceData
            : null
        );
        SetChartData(
          response.data.weighingDeviceData.length > 0
            ? response.data.weighingDeviceData[0].deviceData
            : []
        );
      } catch (error) {
        // Handle errors here
        console.error("Error fetching data:", error);
      }
    }
  };

  function separateDateAndTime(dateTimeString: any) {
    let dateTime = new Date(dateTimeString);

    if (isNaN(dateTime.getTime())) {
      // Handle invalid date-time string
      return null;
    }

    let date = dateTime.toISOString().split("T")[0];
    let time = dateTime.toISOString().split("T")[1].split(".")[0];

    return {
      date: date,
      time: time,
    };
  }

  const downloadExcel = async (data: any, type: any) => {
    const storedUserString = localStorage.getItem("user");
    if (storedUserString) {
      const storedUser = JSON.parse(storedUserString);
      const headers = {
        token: `Bearer ${storedUser.accessToken}`,
      };

      try {
        if (type == "single") {
          const response = await axios.post(
            "http://104.245.34.253:3300/api/excel/device",
            data,
            { headers }
          );
          if (response.data.status) {
            window.open(
              "http://104.245.34.253:3300/downloads/device_data.xlsx",
              "_blank"
            );
          }
        } else {
          const response = await axios.post(
            "http://104.245.34.253:3300/api/excel/current_device_all",
            data,
            { headers }
          );
          if (response.data.status) {
            window.open(
              "http://104.245.34.253:3300/downloads/all_data_of_current_device.xlsx",
              "_blank"
            );
          }
        }
      } catch (error) {
        // Handle errors here
        console.error("Error fetching data:", error);
      }
    }
  };

  return (
    <div className="single">
      {DeviceRecentData.length > 0 ? (
        <div className="view">
          <div className="info">
            <div className="topInfo">
              <img
                style={{
                  cursor: "pointer",
                  backgroundColor: themeColors.softBg,
                }}
                src={
                  DeviceRecentData[0].imageUrl
                    ? `http://104.245.34.253:3300/uploads/${DeviceRecentData[0].imageUrl}`
                    : `/scale.svg`
                }
                alt="Device Picture"
                onClick={openImgPopup}
              />
              <h1 style={{ color: themeColors.mainColor }}>
                {DeviceRecentData[0].title}
              </h1>
              {UserType == "admin" ? (
                <button onClick={openForm}>Edit Information</button>
              ) : null}
              <button
                onClick={() =>
                  downloadExcel(
                    {
                      id: DeviceRecentData[0]._id,
                      title: DeviceRecentData[0].title,
                      assignedProduct: DeviceRecentData[0].assignedProduct,
                      itemCount: DeviceRecentData[0].deviceData.itemCount,
                      totalWeight: DeviceRecentData[0].deviceData.totalWeight,
                      batteryPercentage:
                        DeviceRecentData[0].deviceData.batteryPercentage,
                      batteryVoltage:
                        DeviceRecentData[0].deviceData.batteryVoltage,
                    },
                    "single"
                  )
                }
              >
                Download Recent Data as Excel
              </button>
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <div className="details" style={{ color: themeColors.mainColor }}>
                <div className="item">
                  <span className="itemTitle">ID : </span>
                  <span className="itemValue">{DeviceRecentData[0]._id}</span>
                </div>
                <div className="item">
                  <span className="itemTitle">Assigned Product : </span>
                  <span className="itemValue">
                    {DeviceRecentData[0].assignedProduct}
                  </span>
                </div>
                {/* <div className="item">
                <span className="itemTitle">Assigned Item : </span>
                <span className="itemValue">
                  {DeviceRecentData[0].assignedItem}
                </span>
              </div> */}
                {/* <div className="item">
                  <span className="itemTitle">User Id : </span>
                  <span className="itemValue">
                    {DeviceRecentData[0].userId}
                  </span>
                </div> */}
                <div className="item">
                  <span className="itemTitle">Created Date : </span>
                  <span className="itemValue">
                    {separateDateAndTime(DeviceRecentData[0].createdAt)?.date}
                  </span>
                </div>
                <div className="item">
                  <span className="itemTitle">Created Time : </span>
                  <span className="itemValue">
                    {separateDateAndTime(DeviceRecentData[0].createdAt)?.time}
                  </span>
                </div>
                <div className="item">
                  <span className="itemTitle">Updated Date : </span>
                  <span className="itemValue">
                    {separateDateAndTime(DeviceRecentData[0].updatedAt)?.date}
                  </span>
                </div>
                <div className="item">
                  <span className="itemTitle">Updated Time : </span>
                  <span className="itemValue">
                    {separateDateAndTime(DeviceRecentData[0].updatedAt)?.time}
                  </span>
                </div>
              </div>
              <div
                style={{
                  marginLeft: "50px",
                  display: "flex",
                  alignItems: "flex-start",
                }}
              >
                <CircularProgressBar
                  CurrentValue={parseFloat(
                    DeviceRecentData[0].deviceData.itemCount
                  )}
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
                <CircularProgressBar
                  CurrentValue={parseFloat(
                    DeviceRecentData[0].deviceData.batteryPercentage
                  )}
                  StartValue={0}
                  EndValue={100}
                  LowValue={20}
                  HighValue={80}
                  Units={"%"}
                  InnerColor={"#5e99f7"}
                  TextColor={"#000000"}
                  Icon={"/battery1.svg"}
                  Title={"Battery Percentage"}
                />
                {UserType == "admin" ? (
                  <>
                    <CircularProgressBar
                      CurrentValue={parseFloat(
                        DeviceRecentData[0].deviceData.batteryVoltage
                      )}
                      StartValue={0}
                      EndValue={4.5}
                      LowValue={20}
                      HighValue={80}
                      Units={"V"}
                      InnerColor={"#b583f2"}
                      TextColor={"#000000"}
                      Icon={"/voltage1.svg"}
                      Title={"Battery Voltage"}
                    />
                    <Circle
                      title="Total Weight"
                      value={
                        DeviceRecentData[0].deviceData.totalWeight < 10
                          ? "0" +
                            DeviceRecentData[0].deviceData.totalWeight +
                            "g"
                          : DeviceRecentData[0].deviceData.totalWeight + "g"
                      }
                      unVal={DeviceRecentData[0].deviceData.totalWeight}
                      bgColor="#f0f75e"
                      icon="/weight1.svg"
                    />
                  </>
                ) : null}
              </div>
            </div>
          </div>
          <hr />
          <div style={{ display: "flex", alignItems: "center" }}>
            <FormControl style={{ width: "200px" }}>
              <InputLabel id="demo-simple-select-label">Chart Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={ChartType}
                label="Chart Type"
                onChange={handleChange}
              >
                <MenuItem value="monthly">Month</MenuItem>
                <MenuItem value="weekly">Week</MenuItem>
                <MenuItem value="daily">Day</MenuItem>
              </Select>
            </FormControl>
            {ChartData.length > 0 ? (
              <button
                onClick={() => downloadExcel(ChartData, "all")}
                style={{ marginLeft: "30px" }}
              >
                Download All Data as Excel
              </button>
            ) : null}
          </div>
          {ChartData.length > 0 ? (
            <div className="chart">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  width={500}
                  data={ChartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <XAxis />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="itemCount" stroke="black" />
                  <Line
                    type="monotone"
                    dataKey="batteryPercentage"
                    stroke="orange"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p style={{ marginTop: "20px", color: themeColors.mainColor }}>
              No Data Available to Display the Chart...
            </p>
          )}
        </div>
      ) : (
        <p style={{ color: themeColors.mainColor }}>No Data Available...</p>
      )}
      <DeviceFormPopup isOpen={isFormOpen} update={true} onClose={closeForm} />
      {DeviceRecentData.length > 0 ? (
        <ImagePopup
          isOpen={isImgPopupOpen}
          onClose={closeImgPopup}
          imageSrc={
            DeviceRecentData[0].imageUrl
              ? `http://104.245.34.253:3300/uploads/${DeviceRecentData[0].imageUrl}`
              : `/scale.svg`
          }
        />
      ) : null}
    </div>
  );
};

export default SingleDevice;
