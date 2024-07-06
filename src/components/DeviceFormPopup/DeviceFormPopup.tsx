// UserFormPopup.tsx

import { useState, useEffect, useRef } from "react";
import "./deviceForm.scss"; // Import the SCSS file
import axios from "axios";
import { useParams } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";

interface DeviceFormPopupProps {
  isOpen: boolean;
  update: boolean;
  onClose: () => void;
}

interface DeviceFormState {
  title: string;
  assignedProduct: string;
  imageUrl: string;
  assignedItem: string;
  dateCreated: string;
  timeCreated: string;
  dateUpdated: string;
  timeUpdated: string;
}

const DeviceFormPopup: React.FC<DeviceFormPopupProps> = ({
  isOpen,
  update,
  onClose,
}) => {
  const { themeColors } = useTheme();
  const [InputData, SetInputData] = useState<DeviceFormState>({
    title: "",
    assignedProduct: "",
    imageUrl: "",
    assignedItem: "659e479f798894bd3bea1fe7",
    dateCreated: "2023-01-22",
    timeCreated: "16:08",
    dateUpdated: "2023-01-22",
    timeUpdated: "16:08",
  });

  const [LoadingState, SetLoadingState] = useState(false);

  const [ImageName, SetImageName] = useState<File | null | "">("");
  const [ExistingImage, SetExistingImage] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const params = useParams();
  console.log(params);

  useEffect(() => {
    if (update) {
      getDevice();
    }
  }, [params, isOpen]);

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

    if (!InputData.title || !InputData.assignedProduct) {
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
              addDevice(uploadedImageUrl);
            } else {
              updateDevice(uploadedImageUrl);
            }
          } else {
            alert("Something went wrong!");
          }
        } catch (error) {
          console.error("Error uploading image:", error);
          alert("Something went wrong while uploading the image!");
        }
      } else if (!update) {
        addDevice("");
      } else {
        updateDevice(ExistingImage);
      }
    }
  };

  const addDevice = async (uploadedImageUrl: string) => {
    const storedUserString = localStorage.getItem("user");
    if (storedUserString) {
      const storedUser = JSON.parse(storedUserString);
      const headers = {
        token: `Bearer ${storedUser.accessToken}`,
      };

      try {
        const response = await axios.post(
          "http://104.245.34.253:3300/api/device/add-device/",
          {
            title: InputData.title,
            assignedProduct: InputData.assignedProduct,
            imageUrl: uploadedImageUrl,
            assignedItem: InputData.assignedItem,
            dateCreated: InputData.dateCreated,
            timeCreated: InputData.timeCreated,
            dateUpdated: InputData.dateUpdated,
            timeUpdated: InputData.timeUpdated,
          },
          { headers }
        );
        if (response.data.status) {
          SetInputData({
            title: "",
            assignedProduct: "",
            imageUrl: "",
            assignedItem: "659e479f798894bd3bea1fe7",
            dateCreated: "2023-01-22",
            timeCreated: "16:08",
            dateUpdated: "2023-01-22",
            timeUpdated: "16:08",
          });
          alert(response.data.success.message);
          onClose();
        } else {
          alert(response.data.error.message);
        }
      } catch (error: any) {
        alert(error.response.data.error.message);
        console.error("Error fetching data:", error);
      } finally {
        SetLoadingState(false);
      }
    }
  };

  const updateDevice = async (uploadedImageUrl: string) => {
    const storedUserString = localStorage.getItem("user");
    if (storedUserString) {
      const storedUser = JSON.parse(storedUserString);
      const headers = {
        token: `Bearer ${storedUser.accessToken}`,
      };

      try {
        const response = await axios.put(
          "http://104.245.34.253:3300/api/device/update-device/" + params.id,
          {
            title: InputData.title,
            assignedProduct: InputData.assignedProduct,
            imageUrl: uploadedImageUrl,
          },
          { headers }
        );
        if (response.data.status) {
          SetInputData({
            title: "",
            assignedProduct: "",
            imageUrl: "",
            assignedItem: "659e479f798894bd3bea1fe7",
            dateCreated: "2023-01-22",
            timeCreated: "16:08",
            dateUpdated: "2023-01-22",
            timeUpdated: "16:08",
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

  const getDevice = async () => {
    const storedUserString = localStorage.getItem("user");
    if (storedUserString) {
      const storedUser = JSON.parse(storedUserString);
      const headers = {
        token: `Bearer ${storedUser.accessToken}`,
      };

      try {
        const response = await axios.get(
          "http://104.245.34.253:3300/api/device/item_details/one/" + params.id,
          { headers }
        );
        if (response.data.status) {
          console.log(response.data.weighingDeviceData[0].title);
          SetInputData({
            title: response.data.weighingDeviceData[0].title,
            assignedProduct:
              response.data.weighingDeviceData[0].assignedProduct,
            imageUrl: response.data.weighingDeviceData[0].imageUrl,
            assignedItem: "659e479f798894bd3bea1fe7",
            dateCreated: "2023-01-22",
            timeCreated: "16:08",
            dateUpdated: "2023-01-22",
            timeUpdated: "16:08",
          });

          SetExistingImage(response.data.weighingDeviceData[0].imageUrl);
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
              {!update ? "Add Device" : "Update Device"}
            </h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                value={InputData.title}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Device Title"
              />
              <input
                type="text"
                name="assignedProduct"
                value={InputData.assignedProduct}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Assigned Product"
              />
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
                placeholder="Device Image"
              />
              <br />

              <button type="submit" className="form-button">
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  SetInputData({
                    title: "",
                    assignedProduct: "",
                    imageUrl: "",
                    assignedItem: "659e479f798894bd3bea1fe7",
                    dateCreated: "2023-01-22",
                    timeCreated: "16:08",
                    dateUpdated: "2023-01-22",
                    timeUpdated: "16:08",
                  });
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

export default DeviceFormPopup;
