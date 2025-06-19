import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { Box, Typography } from "@mui/material";
import { LiaAnkhSolid } from "react-icons/lia";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <AppBar
      sx={{
        background: "linear-gradient(to bottom, rgba(5, 5, 5, 0.7), rgba(34, 34, 34, 0.7))",
        boxShadow: "0px 10px 20px #000",
        position: "static",
        height: {
          xs: "30px",
          sm: "30px",
          md: "40px",
          lg: "40px",
          xl: "60px"
        }
      }}
    >
      <Toolbar
        sx={{
          height: "100%",
          minHeight: "unset !important",
          padding: "0 !important"
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            height: "100%"
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              padding: "0 16px",
              height: "100%",
              transition: "transform 0.3s ease, opacity 0.3s ease",
              "&:hover": {
                transform: "scale(1.02)",
                opacity: 0.9
              }
            }}
          >
            <LiaAnkhSolid
              color="goldenrod"
              style={{ flexShrink: 0, fontSize: "clamp(15px, 4vw, 40px)" }}
            />
            <Typography
              variant="h1"
              sx={{
                fontFamily: "Akhenaton",
                color: "goldenrod",
                userSelect: "none",
                fontSize: {
                  xs: "1.5rem",
                  sm: "1.7rem",
                  md: "2rem",
                  lg: "2.2rem",
                  xl: "2.4rem"
                }
              }}
            >
              <Link to="/chat" style={{ textDecoration: "none", color: "goldenrod" }}>
              Project 2
              </Link>
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              padding: "0 26px",
              height: "100%",
              transition: "transform 0.3s ease, opacity 0.3s ease",
              "&:hover": {
                transform: "scale(1.02)",
                opacity: 0.9
              }
            }}
          >
            <Link to="/about" style={{ textDecoration: "none", color: "goldenrod" }}>
              <Typography
                variant="h1"
                sx={{
                  fontFamily: "Akhenaton",
                  color: "goldenrod",
                  userSelect: "none",
                  fontSize: {
                    xs: "1.5rem",
                    sm: "1.7rem",
                    md: "2rem",
                    lg: "2.2rem",
                    xl: "2.4rem"
                  }
                }}
              >
                About Us
              </Typography>

            </Link>

          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;