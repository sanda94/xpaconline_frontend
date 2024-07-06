import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../components/dataTable/DataTable";
import "./users.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserFormPopup from "../../components/UserFormPopup/UserFormPopup";
import { useTheme } from "../../contexts/ThemeContext";

const columns: GridColDef[] = [
  {
    field: "_id",
    type: "string",
    headerName: "ID",
    flex: 1,
  },
  {
    field: "img",
    headerName: "Profile Picture",
    flex: 1,
    renderCell: (params) => {
      return (
        <img
          src={
            params.row.imageUrl
              ? `http://104.245.34.253:3300/uploads/${params.row.imageUrl}`
              : `/noavatar.png`
          }
          alt="Profile Picture"
        />
      );
    },
  },
  {
    field: "fullName",
    type: "string",
    headerName: "Full Name",
    flex: 1,
  },
  {
    field: "emailAddress",
    type: "string",
    headerName: "Email Address",
    flex: 1,
  },
  {
    field: "phoneNumber",
    type: "string",
    headerName: "Phone Number",
    flex: 1,
  },
  {
    field: "userType",
    type: "string",
    headerName: "User Type",
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

const Users = () => {
  const { themeColors } = useTheme();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [UserType, SetUserType] = useState("");

  // Users data
  const [UsersData, SetUsersData] = useState([]);

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
    const storedUserString = localStorage.getItem("user");
    if (storedUserString) {
      const storedUser = JSON.parse(storedUserString);
      console.log(storedUser);
      navigate("/users");
    } else {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    getUsers();
    const storedUserString = localStorage.getItem("user");
    if (storedUserString) {
      const storedUser = JSON.parse(storedUserString);
      SetUserType(storedUser.userType);
    }
  }, []);

  useEffect(() => {
    getUsers();
  }, [isFormOpen]);

  // Fetch device count data
  const getUsers = async () => {
    const storedUserString = localStorage.getItem("user");
    if (storedUserString) {
      const storedUser = JSON.parse(storedUserString);
      const headers = {
        token: `Bearer ${storedUser.accessToken}`,
      };

      try {
        const response = await axios.get(
          "http://104.245.34.253:3300/api/users/all",
          { headers }
        );
        console.log(response.data.users);
        SetUsersData(response.data.users);
      } catch (error) {
        // Handle errors here
        console.error("Error fetching data:", error);
      }
    }
  };

  const updateStatus = (val: string) => {
    getUsers();
    SetStatus(val);
  };

  return (
    <div className="users">
      <div className="info">
        <h1 style={{ color: themeColors.mainColor }}>All Users</h1>
        {UserType == "admin" ? (
          <button onClick={openForm}>Add New User</button>
        ) : null}
      </div>
      {UsersData.length > 0 ? (
        <DataTable
          slug="users"
          statusChange={updateStatus}
          columns={columns}
          rows={UsersData}
        />
      ) : (
        <p>No Data Available...</p>
      )}
      {/* TEST THE API */}
      <UserFormPopup isOpen={isFormOpen} update={false} onClose={closeForm} />
    </div>
  );
};

export default Users;
