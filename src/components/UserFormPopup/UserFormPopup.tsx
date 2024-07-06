// UserFormPopup.tsx

import { useState, useEffect, useRef } from "react";
import "./userForm.scss"; // Import the SCSS file
import axios from "axios";
import { useParams } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";

interface UserFormPopupProps {
  isOpen: boolean;
  update: boolean;
  onClose: () => void;
}

interface UserFormState {
  fullName: string;
  emailAddress: string;
  password: string;
  phoneNumber: string;
  imageUrl: string;
  userType: string;
  adminChange: boolean;
}

const UserFormPopup: React.FC<UserFormPopupProps> = ({
  isOpen,
  update,
  onClose,
}) => {
  const { themeColors } = useTheme();
  const [InputData, SetInputData] = useState<UserFormState>({
    fullName: "",
    emailAddress: "",
    password: "",
    phoneNumber: "",
    imageUrl: "",
    userType: "none",
    adminChange: false,
  });

  console.log(InputData);

  const [UserType, SetUserType] = useState("");

  const [LoadingState, SetLoadingState] = useState(false);

  const [ImageName, SetImageName] = useState<File | null | "">("");
  const [ExistingImage, SetExistingImage] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const params = useParams();
  console.log(params);

  useEffect(() => {
    if (update) {
      getUser();
    }
  }, [params, isOpen]);

  useEffect(() => {
    getUser();
    const storedUserString = localStorage.getItem("user");
    if (storedUserString) {
      const storedUser = JSON.parse(storedUserString);
      SetUserType(storedUser.userType);
    }
  }, []);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    // Use the spread operator to copy the existing state
    SetInputData({
      ...InputData,
      [name]: value,
    });
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      SetImageName(event.target.files[0]);
    } else {
      SetImageName(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData();

    if (
      !InputData.fullName ||
      !InputData.emailAddress ||
      !InputData.password ||
      !InputData.phoneNumber ||
      InputData.userType === "none"
    ) {
      alert("Please provide valid information for all fields.");
    } else {
      SetLoadingState(true);
      if (ImageName) {
        if (ExistingImage) {
          deleteImage(ExistingImage);
        }

        formData.append("file", ImageName);

        try {
          const uploadedImageUrl = await uploadImage(formData);
          console.log("Uploaded image URL:", uploadedImageUrl);
          if (uploadedImageUrl) {
            SetImageName("");
            if (!update) {
              addUser(uploadedImageUrl);
            } else {
              updateUser(uploadedImageUrl);
            }
          } else {
            alert("Something went wrong!");
          }
        } catch (error) {
          console.error("Error uploading image:", error);
          alert("Something went wrong while uploading the image!");
        }
      } else if (!update) {
        addUser("");
      } else {
        updateUser(ExistingImage);
      }
    }
  };

  const addUser = async (uploadedImageUrl: string) => {
    const storedUserString = localStorage.getItem("user");
    if (storedUserString) {
      const storedUser = JSON.parse(storedUserString);
      const headers = {
        token: `Bearer ${storedUser.accessToken}`,
      };

      try {
        const response = await axios.post(
          "http://104.245.34.253:3300/api/users/register",
          {
            fullName: InputData.fullName,
            emailAddress: InputData.emailAddress,
            password: InputData.password,
            phoneNumber: InputData.phoneNumber,
            imageUrl: uploadedImageUrl,
            userType: InputData.userType,
          },
          { headers }
        );
        if (response.data.status) {
          SetInputData({
            fullName: "",
            emailAddress: "",
            password: "",
            phoneNumber: "",
            imageUrl: "",
            userType: "none",
            adminChange: false,
          });
          alert(response.data.success.message);
          onClose();
        } else {
          alert(response.data.error.message);
        }
      } catch (error: any) {
        alert(error.response.data.error.message);
        // Handle errors here
        console.error("Error fetching data:", error);
      } finally {
        SetLoadingState(false);
      }
    }
  };

  const updateUser = async (uploadedImageUrl: string) => {
    const storedUserString = localStorage.getItem("user");
    if (storedUserString) {
      const storedUser = JSON.parse(storedUserString);
      const headers = {
        token: `Bearer ${storedUser.accessToken}`,
      };

      try {
        const response = await axios.put(
          "http://104.245.34.253:3300/api/users/update/secure/" + params.id,
          {
            fullName: InputData.fullName,
            emailAddress: InputData.emailAddress,
            password: InputData.password,
            phoneNumber: InputData.phoneNumber,
            imageUrl: uploadedImageUrl,
            userType: InputData.userType,
            adminChange: UserType == "admin",
          },
          { headers }
        );
        if (response.data.status) {
          console.log(response.data);
          SetInputData({
            fullName: "",
            emailAddress: "",
            password: "",
            phoneNumber: "",
            imageUrl: "",
            userType: "none",
            adminChange: false,
          });
          alert(response.data.success.message);
          onClose();
        } else {
          alert(response.data.error.message);
        }
      } catch (error: any) {
        alert(error.response.data.error.message);
        // Handle errors here
        console.error("Error fetching data:", error);
      } finally {
        SetLoadingState(false);
      }
    }
  };

  const getUser = async () => {
    const storedUserString = localStorage.getItem("user");
    if (storedUserString) {
      const storedUser = JSON.parse(storedUserString);
      const headers = {
        token: `Bearer ${storedUser.accessToken}`,
      };

      try {
        const response = await axios.get(
          "http://104.245.34.253:3300/api/users/one/" + params.id,
          { headers }
        );
        if (response.data.status) {
          SetInputData({
            fullName: response.data.user.fullName,
            emailAddress: response.data.user.emailAddress,
            password: "",
            phoneNumber: response.data.user.phoneNumber,
            imageUrl: response.data.user.imageUrl,
            userType: response.data.user.userType,
            adminChange: UserType == "admin",
          });

          SetExistingImage(response.data.user.imageUrl);
        } else {
          console.error(response.data.error.message);
        }
      } catch (error) {
        // Handle errors here
        console.error("Error fetching data:", error);
      }
    }
  };

  const uploadImage = async (formData: any) => {
    try {
      // Send formData to backend using axios or any other HTTP client
      const response = await axios.post(
        "http://104.245.34.253:3300/api/files/save",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status) {
        const imageUrl = response.data.fileName;
        return imageUrl;
      } else {
        return undefined;
      }
      // Handle response from the server
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const deleteImage = async (imageUrl: any) => {
    try {
      // Send formData to backend using axios or any other HTTP client
      const response = await axios.delete(
        "http://104.245.34.253:3300/api/files/delete/" + imageUrl
      );

      if (response.data.status) {
        return true;
      } else {
        return false;
      }
      // Handle response from the server
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div className={`popup-container ${isOpen ? "open" : "closed"}`}>
      <div
        className="popup-content"
        style={{ backgroundColor: themeColors.softBg }}
      >
        {LoadingState ? (
          <p style={{ color: themeColors.mainColor }}>Wait a moment...</p>
        ) : (
          <>
            <h2 className="heading" style={{ color: themeColors.mainColor }}>
              {!update ? "Add User" : "Update User"}
            </h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="fullName"
                value={InputData.fullName}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Full Name"
              />
              <br />
              <input
                type="email"
                name="emailAddress"
                value={InputData.emailAddress}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Email Address"
              />
              <br />
              <input
                type="password"
                name="password"
                value={InputData.password}
                onChange={handleInputChange}
                className="form-input"
                placeholder={!update ? "Password" : "New or Old Password"}
              />
              <br />
              <input
                type="number"
                name="phoneNumber"
                value={InputData.phoneNumber}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Phone Number"
              />
              <br />
              {UserType == "admin" ? (
                <select
                  name="userType"
                  value={InputData.userType}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="none" disabled>
                    User Type
                  </option>
                  <option value="customer">Customer</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              ) : null}

              <br />
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                <button
                  style={{
                    padding: "5px",
                    borderRadius: "4px",
                    border: "1px solid #2a3447",
                  }}
                  type="button"
                  onClick={handleButtonClick}
                >
                  Upload Image
                </button>
                <p
                  style={{
                    fontSize: "0.8rem",
                    marginLeft: "10px",
                    color: themeColors.mainColor,
                  }}
                >
                  {ImageName ? ImageName.name : "Not selected any image!"}
                </p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                accept=".jpg, .jpeg, .png"
                onChange={handleFileChange}
                className="form-input"
                style={{ display: "none" }}
                placeholder="Profile Image"
              />
              <br />
              <button type="submit" className="form-button">
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  SetInputData({
                    fullName: "",
                    emailAddress: "",
                    password: "",
                    phoneNumber: "",
                    imageUrl: "",
                    userType: "none",
                    adminChange: false,
                  });
                  SetImageName(null);
                }}
                className="form-button"
              >
                Clear
              </button>
              <button type="button" onClick={onClose} className="form-button">
                Close
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default UserFormPopup;
