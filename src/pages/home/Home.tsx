import DeviceCountChart from "../../components/DeviceCountChart/DeviceCountChart";
import ChartBox from "../../components/chartBox/ChartBox";
import "./home.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import DeviceCustomerCountChart from "../../components/DeviceCustomerCountChart/DeviceCustomerCountChart";
import { useNavigate } from "react-router-dom";

interface CountDataType {
  deviceCount: number;
  adminCount: number;
  modCount: number;
  customerCount: number;
}

// interface AuthDataType {
//   accessToken: string;
//   userId: string;
//   userType: string;
// }

const Home = () => {
  // Device count data
  const [DeviceCountData, SetDeviceCountData] = useState([]);

  // Customer device count data
  const [CustomerDeviceCountData, SetCustomerDeviceCountData] = useState({});

  // Customer device count data
  const [CountData, SetCountData] = useState<CountDataType | null>(null);

  // Auth user
  // const [AuthUser, SetAuthUser] = useState<AuthDataType | null>(null);
  // console.log(AuthUser);

  let navigate = useNavigate();

  useEffect(() => {
    const storedUserString = localStorage.getItem("user");
    if (storedUserString) {
      const storedUser = JSON.parse(storedUserString);
      console.log(storedUser);
      navigate("/");
    } else {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    fetchDeviceCountData();
    fetchDeviceCustomerCountData();
    fetchCountData();

    const intervalId = setInterval(() => {
      fetchDeviceCountData();
      fetchDeviceCustomerCountData();
      fetchCountData();
    }, 600000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  // Fetch device count data
  const fetchDeviceCountData = async () => {
    const storedUserString = localStorage.getItem("user");
    if (storedUserString) {
      const storedUser = JSON.parse(storedUserString);
      const headers = {
        token: `Bearer ${storedUser.accessToken}`,
      };

      try {
        const response = await axios.get(
          "http://104.245.34.253:3300/api/summary/get-device-count",
          { headers }
        );
        SetDeviceCountData(response.data.data);
      } catch (error) {
        // Handle errors here
        console.error("Error fetching data:", error);
      }
    }
  };

  // Fetch customer device data
  const fetchDeviceCustomerCountData = async () => {
    const storedUserString = localStorage.getItem("user");
    if (storedUserString) {
      const storedUser = JSON.parse(storedUserString);
      const headers = {
        token: `Bearer ${storedUser.accessToken}`,
      };

      try {
        const response = await axios.get(
          "http://104.245.34.253:3300/api/summary/get-customer-device-count",
          { headers }
        );
        console.log(response.data.data);

        const combinedArray = response.data.data.customerCounts.map(
          (customerCountItem: any) => {
            const deviceCountItem = response.data.data.deviceCounts.find(
              (deviceCount: any) => deviceCount.date === customerCountItem.date
            );

            return {
              date: customerCountItem.date,
              customerCount: customerCountItem.count,
              deviceCount: deviceCountItem ? deviceCountItem.count : 0,
            };
          }
        );

        SetCustomerDeviceCountData(combinedArray);
      } catch (error) {
        // Handle errors here
        console.error("Error fetching data:", error);
      }
    }
  };

  // Fetch count data
  const fetchCountData = async () => {
    const storedUserString = localStorage.getItem("user");
    if (storedUserString) {
      const storedUser = JSON.parse(storedUserString);
      const headers = {
        token: `Bearer ${storedUser.accessToken}`,
      };

      try {
        const response = await axios.get(
          "http://104.245.34.253:3300/api/summary/count",
          { headers }
        );
        console.log(response.data.data);

        SetCountData(response.data.data);
      } catch (error) {
        // Handle errors here
        console.error("Error fetching data:", error);
      }
    }
  };

  return (
    <div className="home">
      {CountData ? (
        <>
          <div className="box box2">
            <ChartBox
              title="Total Customers"
              count={CountData.customerCount}
              icon="/custuser.svg"
            />
          </div>
          <div className="box box6">
            <ChartBox
              title="Total Admins"
              count={CountData?.adminCount}
              icon="/adminuser.svg"
            />
          </div>
          <div className="box box3">
            <ChartBox
              title="Total Moderators"
              count={CountData.modCount}
              icon="/moduser.svg"
            />
          </div>
          <div className="box box5">
            <ChartBox
              title="Total Devices"
              count={CountData.deviceCount}
              icon="/devices1.svg"
            />
          </div>
        </>
      ) : null}
      <div className="box box7">
        <DeviceCountChart bigChartData={DeviceCountData} />
      </div>
      <div className="box box7">
        <DeviceCustomerCountChart bigChartData={CustomerDeviceCountData} />
      </div>
      {/* <div className="box box7">
        <BigChartBox />
      </div> */}
    </div>
  );
};

export default Home;
