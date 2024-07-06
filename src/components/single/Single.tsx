import UserFormPopup from "../UserFormPopup/UserFormPopup";
import ImagePopup from "../ImagePopup/ImagePopup";
import "./single.scss";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../../contexts/ThemeContext";

const Single = () => {
  const { themeColors } = useTheme();
  // Users data
  const [UserData, SetUserData] = useState<any>({});

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImgPopupOpen, setIsImgPopupOpen] = useState(false);

  const [UserId, SetUserId] = useState("");

  const [UserType, SetUserType] = useState("");

  const params = useParams();
  console.log(params);
  console.log(UserId);

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
    const storedUserString = localStorage.getItem("user");
    if (storedUserString) {
      const storedUser = JSON.parse(storedUserString);
      SetUserId(storedUser.userId);
      SetUserType(storedUser.userType);
    }
  }, []);

  useEffect(() => {
    if (params.id) {
      getUser();
    }
  }, [params.id, isFormOpen]);

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

  // Fetch device count data
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
        console.log(response.data.user);
        SetUserData(response.data.user);
      } catch (error) {
        // Handle errors here
        console.error("Error fetching data:", error);
      }
    }
  };

  return (
    <div className="single">
      {UserData.fullName ? (
        <div className="view">
          <div className="info info_profile">
            <div className="banner banner_profile">
              <img src="/cover_image.jpg" alt="" />
              <div className="profile_img">
                <img
                  style={{ cursor: "pointer" }}
                  src={
                    UserData.imageUrl
                      ? `http://104.245.34.253:3300/uploads/${UserData.imageUrl}`
                      : `/noavatar.png`
                  }
                  alt="Profile Picture"
                  onClick={openImgPopup}
                />
              </div>
              {UserType == "admin" || UserId == params.id ? (
                <button onClick={openForm}>Edit Information</button>
              ) : null}
            </div>
            <div className="topInfo" style={{ color: themeColors.mainColor }}>
              <h1>{UserData.fullName}</h1>
            </div>
            <div
              className="details details_profile"
              style={{ color: themeColors.mainColor }}
            >
              <div className="item">
                <span className="itemTitle">ID : </span>
                <span className="itemValue">{UserData._id}</span>
              </div>
              <div className="item">
                <span className="itemTitle">Email Address : </span>
                <span className="itemValue">{UserData.emailAddress}</span>
              </div>
              <div className="item">
                <span className="itemTitle">Phone Number : </span>
                <span className="itemValue">{UserData.phoneNumber}</span>
              </div>
              <div className="item">
                <span className="itemTitle">User Type : </span>
                <span className="itemValue">{UserData.userType}</span>
              </div>
              <div className="item">
                <span className="itemTitle">Created Date : </span>
                <span className="itemValue">
                  {separateDateAndTime(UserData.createdAt)?.date}
                </span>
              </div>
              <div className="item">
                <span className="itemTitle">Created Time : </span>
                <span className="itemValue">
                  {separateDateAndTime(UserData.createdAt)?.time}
                </span>
              </div>
              <div className="item">
                <span className="itemTitle">Updated Date : </span>
                <span className="itemValue">
                  {separateDateAndTime(UserData.updatedAt)?.date}
                </span>
              </div>
              <div className="item">
                <span className="itemTitle">Updated Time : </span>
                <span className="itemValue">
                  {separateDateAndTime(UserData.updatedAt)?.time}
                </span>
              </div>
            </div>
          </div>
          <hr style={{ marginLeft: "auto", marginRight: "auto" }} />
        </div>
      ) : (
        <p style={{ color: themeColors.mainColor }}>No Data Available...</p>
      )}
      <UserFormPopup isOpen={isFormOpen} update={true} onClose={closeForm} />
      <ImagePopup
        isOpen={isImgPopupOpen}
        onClose={closeImgPopup}
        imageSrc={
          UserData.imageUrl
            ? `http://104.245.34.253:3300/uploads/${UserData.imageUrl}`
            : `/noavatar.png`
        }
      />
    </div>
  );
};

export default Single;
