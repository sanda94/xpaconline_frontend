import { useState, useEffect } from "react";
import "./products.scss";
import DataTable from "../../components/dataTable/DataTable";
import { GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DeviceFormPopup from "../../components/DeviceFormPopup/DeviceFormPopup";
import { useTheme } from "../../contexts/ThemeContext";

const columns: GridColDef[] = [
  { field: "_id", headerName: "ID", flex: 1 },
  {
    field: "img",
    headerName: "Image",
    flex: 1,
    renderCell: (params) => {
      return (
        <img
          src={
            params.row.imageUrl
              ? `http://104.245.34.253:3300/uploads/${params.row.imageUrl}`
              : `/scaless.svg`
          }
          alt="Device Picture"
        />
      );
    },
  },
  {
    field: "title",
    type: "string",
    headerName: "Title",
    flex: 1,
  },
  {
    field: "assignedProduct",
    type: "string",
    headerName: "Product",
    flex: 1,
  },
  {
    field: "createdAt",
    headerName: "Created At",
    flex: 1,
    type: "string",
  },
  {
    field: "updatedAt",
    headerName: "Updated At",
    flex: 1,
    type: "string",
  },
];

const Products = () => {
  const { themeColors } = useTheme();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [UserType, SetUserType] = useState("");

  // Devices data
  const [DevicesData, SetDevicesData] = useState([]);

  // Status
  const [Status, SetStatus] = useState("none");

  console.log(Status);

  let navigate = useNavigate();

  const openForm = () => {
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  useEffect(() => {
    fetchDevices();
    const storedUserString = localStorage.getItem("user");
    if (storedUserString) {
      const storedUser = JSON.parse(storedUserString);
      console.log(storedUser);
      SetUserType(storedUser.userType);
      navigate("/products");
    } else {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    fetchDevices();
  }, [isFormOpen]);

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
          console.log(UserType);
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

  const updateStatus = (val: string) => {
    fetchDevices();
    SetStatus(val);
  };

  return (
    <div className="products">
      <div className="info">
        <h1 style={{ color: themeColors.mainColor }}>All Devices</h1>
        {UserType == "admin" ? (
          <button onClick={openForm}>Add New Device</button>
        ) : null}
      </div>
      {DevicesData.length > 0 ? (
        <DataTable
          slug="products"
          statusChange={updateStatus}
          columns={columns}
          rows={DevicesData}
        />
      ) : (
        <p>No Data Available...</p>
      )}

      {/* TEST THE API */}

      {/* {isLoading ? (
        "Loading..."
      ) : (
        <DataTable slug="products" columns={columns} rows={data} />
      )} */}
      <DeviceFormPopup isOpen={isFormOpen} update={false} onClose={closeForm} />
    </div>
  );
};

export default Products;
