import React, { useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import axios from "axios";

import "./add.scss";

type Props = {
  slug: string;
  columns: GridColDef[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Add = (props: Props) => {
  const [formData, setFormData] = useState<{ [key: string]: string }>({});

  // const setAdditionalData = () => {
  //   if (props.slug == "Products") {
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       imageUrl: "sfsasf",
  //       assignedItem: "ssfsfsf",
  //       dateCreated: "sdfsdf",
  //       timeCreated: "sdfsdf",
  //       dateUpdated: "sdfsdf",
  //       timeUpdated: "sdfsdf",
  //     }));
  //   }
  // };

  console.log(formData);

  // useEffect(() => {
  //   setAdditionalData();
  // }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (props.slug == "Products") {
      addDevice();
    }

    if (props.slug == "Users") {
      addUser();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (props.slug == "Products") {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }

    if (props.slug == "Users") {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const addDevice = async () => {
    const storedUserString = localStorage.getItem("user");
    if (storedUserString) {
      const storedUser = JSON.parse(storedUserString);
      const headers = {
        token: `Bearer ${storedUser.accessToken}`,
      };

      // Check if required fields are not empty
      if (!formData.title) {
        alert("Please provide a valid device title.");
        return;
      }
      if (!formData.userId) {
        alert("Please provide a valid user id.");
        return;
      }

      try {
        const response = await axios.post(
          "http://104.245.34.253:3300/api/device/add-device/",
          formData,
          { headers }
        );

        console.log(response.data);
        alert("Successfuly added the device!");
        props.setOpen(false);
      } catch (error) {
        alert("Something went wrong, Please check your connection!");
        console.error("Error fetching data:", error);
      }
    }
  };

  const addUser = async () => {
    const storedUserString = localStorage.getItem("user");
    if (storedUserString) {
      const storedUser = JSON.parse(storedUserString);
      const headers = {
        token: `Bearer ${storedUser.accessToken}`,
      };

      // Check if required fields are not empty
      if (!formData.fullName) {
        alert("Please provide a valid full name.");
        return;
      }
      if (!formData.emailAddress) {
        alert("Please provide a valid email address");
        return;
      }
      if (!formData.phoneNumber) {
        alert("Please provide a valid phone number");
        return;
      }
      if (!formData.userType) {
        alert("Please provide a valid user type");
        return;
      }
      if (!formData.password) {
        alert("Please provide a valid password");
        return;
      }

      try {
        const response = await axios.post(
          "http://104.245.34.253:3300/api/users/register",
          formData,
          { headers }
        );

        console.log(response.data);
        alert("Successfuly added the user!");
        props.setOpen(false);
      } catch (error) {
        alert("Something went wrong, Please check your connection!");
        console.error("Error fetching data:", error);
      }
    }
  };

  return (
    <div className="add">
      <div className="modal">
        <span className="close" onClick={() => props.setOpen(false)}>
          X
        </span>
        <h1>Add New {props.slug}</h1>
        <form onSubmit={handleSubmit}>
          {props.columns
            .filter((item) => item.field !== "id" && item.field !== "img")
            .map((column) => (
              <div className="item" key={column.field}>
                <label>{column.headerName}</label>
                <input
                  type={column.type}
                  name={column.field}
                  placeholder={column.field}
                  value={formData[column.field] || ""}
                  onChange={handleInputChange}
                />

                {/* {column.field == "userType" ? (
                  <select
                    id="userRole"
                    name={column.field}
                    value={formData[column.field] || ""}
                    style={{ padding: "10px" }}
                  >
                    <option value="customer">Customer</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                ) : (
                  <input
                    type={column.type}
                    name={column.field}
                    placeholder={column.field}
                    value={formData[column.field] || ""}
                    onChange={handleInputChange}
                  />
                )} */}
              </div>
            ))}
          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
};

export default Add;
