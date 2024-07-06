import { Link } from "react-router-dom";
import "./menu.scss";
import { menu } from "../../data";
import { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";

const Menu = () => {
  const { theme, themeColors } = useTheme();
  const [UserType, SetUserType] = useState("");

  useEffect(() => {
    const storedUserString = localStorage.getItem("user");
    if (storedUserString) {
      const storedUser = JSON.parse(storedUserString);
      SetUserType(storedUser.userType);
    }
  }, []);

  return (
    <div className="menu" style={{ backgroundColor: themeColors.mainBg }}>
      {menu.map((item) => (
        <div className="item" key={item.id}>
          <span className="title" style={{ color: themeColors.mainColor }}>
            {item.title}
          </span>
          {item.listItems.map((listItem) =>
            UserType ? (
              UserType != "customer" ? (
                <Link
                  to={listItem.url}
                  className="listItem"
                  style={{ color: themeColors.mainColor }}
                  key={listItem.id}
                >
                  <img
                    src={theme == "dark" ? listItem.icon : listItem.darkIcon}
                    alt=""
                    style={{ width: "20px" }}
                  />
                  <span className="listItemTitle">{listItem.title}</span>
                </Link>
              ) : listItem.title == "Devices" ||
                listItem.title == "Summary" ||
                listItem.title == "Profile" ? (
                <Link
                  to={listItem.url}
                  className="listItem"
                  style={{ color: themeColors.mainColor }}
                  key={listItem.id}
                >
                  <img
                    src={theme == "dark" ? listItem.icon : listItem.darkIcon}
                    alt=""
                    style={{ width: "20px" }}
                  />
                  <span className="listItemTitle">{listItem.title}</span>
                </Link>
              ) : null
            ) : null
          )}
        </div>
      ))}
    </div>
  );
};

export default Menu;
