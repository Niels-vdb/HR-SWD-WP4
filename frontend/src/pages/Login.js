import React, { useState, useContext } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";
import { UserContext } from "../index";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Byte Bandits 2023."}
    </Typography>
  );
}

const theme = createTheme();

export default function SignIn() {
  const [alert, setAlert] = useState();
  const [showPassword, setShowPassword] = useState(true)

  const navigate = useNavigate();
  const location = useLocation()

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const loginData = {
      email: data.get("email"),
      password: data.get("password"),
    };

    fetch("/handle-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    })
      .then((response) => response.json())
      .then((data) => {
        switch (data.response) {
          case "login validated":
            sessionStorage.setItem('userId', data.userId)
            if (location.state?.from) {
              console.log(sessionStorage.getItem("pathname"));
              navigate(sessionStorage.getItem("pathname"))
            }else 
              navigate("/menu");
            break;
          case "password not right":
            setAlert(
              <Alert severity="warning">
                Onjuist wachtwoord. Probeer opnieuw!
              </Alert>
            );
            break;
          case "email does not exist":
            setAlert(
              <Alert severity="warning">
                Dit email adres is niet bekend. Probeer opnieuw!
              </Alert>
            );
            break;
        }
      });
  };

  function passwordVisibility() {
    setShowPassword(!showPassword)
  }

  return (
    <ThemeProvider theme={theme}>
      {alert}
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-mailadres"
              type="email"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Wachtwoord"
              type={showPassword ? "password" : "text"}
              id="password"
              autoComplete="current-password"
              InputProps={ {
                onClick: passwordVisibility,
                endAdornment: showPassword ? <VisibilityOffIcon/> : <VisibilityIcon/>,
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Log In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
