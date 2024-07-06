import "./navbar.scss";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";

const Navbar = () => {
  const { theme, toggleTheme, themeColors } = useTheme();
  const navigate = useNavigate();
  const logOut = () => {
    const userConfirmed = window.confirm("Do you want to proceed?");

    if (userConfirmed) {
      localStorage.removeItem("user");
      navigate("/login");
    }
  };
  return (
    <div className="navbar" style={{ backgroundColor: themeColors.mainBg }}>
      <div className="logo">
        <img
          src={theme == "dark" ? "/logo.svg" : "/logodark.svg"}
          alt=""
          style={{ width: "50px" }}
        />
        <span style={{ color: themeColors.mainColor }}>XPAC</span>
      </div>

      <span style={{ color: themeColors.mainColor, fontWeight: "bold" }}>
        © XPAC Technologies Pte Ltd
      </span>
      <div className="icons">
        {/* <img src="/search.svg" alt="" className="icon" />
        <img src="/app.svg" alt="" className="icon" />
        <img src="/expand.svg" alt="" className="icon" />
        <div className="notification">
          <img src="/notifications.svg" alt="" />
          <span>1</span>
        </div>
        <div className="user">
          <img
            src="https://images.pexels.com/photos/11038549/pexels-photo-11038549.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"
            alt=""
          />
          <span>Jane</span>
        </div> */}
        <img
          src={theme == "dark" ? "/dark.svg" : "/light.svg"}
          alt=""
          className="icon"
          style={{ width: "30px", cursor: "pointer" }}
          onClick={toggleTheme}
        />
        <img
          src={theme == "dark" ? "/logout.svg" : "/logoutdark.svg"}
          alt=""
          className="icon"
          style={{ width: "40px", cursor: "pointer" }}
          onClick={() => logOut()}
        />
      </div>
    </div>
  );
};

export default Navbar;
