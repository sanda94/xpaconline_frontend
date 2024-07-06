import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeProvider, useTheme } from "../../contexts/ThemeContext";
import "./login.scss";

// TODO remove, this demo shouldn't need to reset the theme.

export default function Login() {
  const { theme, toggleTheme, themeColors } = useTheme();

  const [Email, SetEmail] = useState("");
  const [Password, SetPassword] = useState("");

  console.log(Email);

  let navigate = useNavigate();

  useEffect(() => {
    const storedUserString = localStorage.getItem("user");
    if (storedUserString) {
      navigate("/");
    } else {
      navigate("/login");
    }
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const headers = {
      "Content-Type": "application/json",
    };
    if (!Email) {
      alert("Please provide a valid email adress.");
      return;
    }
    if (!Password) {
      alert("Please provide a valid Password");
      return;
    }
    try {
      const response = await axios.post(
        "http://104.245.34.253:3300/api/users/login",
        {
          emailAddress: Email,
          password: Password,
        },
        { headers }
      );
      console.log(response.data);

      if (response.data.status) {
        localStorage.setItem("user", JSON.stringify(response.data));
        if (response.data.userType == "customer") {
          navigate("/products");
        } else {
          navigate("/");
        }
      } else {
        alert(response.data.error.message);
      }
    } catch (error: any) {
      alert(error.response.data.error.message);
      console.error("Error fetching data:", error);
    }
  };

  return (
    <ThemeProvider>
      <div
        className="main-lg"
        style={{ paddingTop: "100px", backgroundColor: themeColors.mainBg }}
      >
        <img
          src={theme == "dark" ? "/dark.svg" : "/light.svg"}
          alt=""
          className="icon"
          style={{ width: "30px", cursor: "pointer" }}
          onClick={toggleTheme}
        />
        <Container
          component="main"
          maxWidth="xs"
          style={{
            backgroundColor: themeColors.mainColor,
            borderRadius: "10px",
          }}
        >
          <CssBaseline />
          <Box
            sx={{
              paddingTop: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}></Avatar>
            <Typography
              component="h1"
              variant="h5"
              style={{ color: themeColors.mainBg }}
            >
              User Login
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <input
                type="text"
                name="email"
                onChange={(e) => SetEmail(e.target.value)}
                className="form-input"
                placeholder="Email Address"
                style={{ borderColor: themeColors.mainBg }}
              />
              <input
                type="password"
                name="password"
                onChange={(e) => SetPassword(e.target.value)}
                className="form-input"
                placeholder="Password"
                style={{ borderColor: themeColors.mainBg }}
              />
              <button
                type="submit"
                className="form-button"
                onClick={(e) => handleSubmit(e)}
                style={{ borderColor: themeColors.mainBg }}
              >
                Login
              </button>

              <p
                style={{
                  textAlign: "center",
                  marginBottom: "30px",
                  color: themeColors.mainBg,
                }}
              >
                Copyright &copy; XpacScale
              </p>
            </Box>
          </Box>
        </Container>
      </div>
    </ThemeProvider>
  );
}
