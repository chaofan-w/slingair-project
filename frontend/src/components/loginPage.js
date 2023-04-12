import * as React from "react";
import { Box, Button, Card, TextField, IconButton, Icon } from "@mui/material";
import ReservationContext from "../ReservationContext";
import { HighlightOffOutlined } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const naviate = useNavigate();
  const {
    reservationState,
    reservationDispatch,
    setDisplaySignIn,
    setLoginStatus,
    setDisplayAlert,
  } = React.useContext(ReservationContext);
  const [email, setEmail] = React.useState("test@email.com");
  const [lastName, setLastName] = React.useState("test");
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`/api/customers/${lastName}/${email}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          reservationDispatch({
            type: "get_profile",
            loginStatus: true,
            error: "",
            lastName: lastName,
            loginEmail: email,
            carts: reservationState.carts,
            reservations: data.data.reservations,
            message: "",
          });
          setDisplaySignIn(false);
          naviate("/");
        } else {
          reservationDispatch({
            type: "throwMessage",
            message: data.message,
          });
          setDisplayAlert({ severity: "warning", display: true });
        }
      });
  };
  return (
    <Box
      // //px for classes that set both padding-left and padding-right
      // px={1}
      // width="100%"
      // //mx for classes that set both margin-left and margin-right
      // mx="auto"
      // // position="absolute"
      // // top={0}
      // // left={0}
      // zIndex={2}
      // sx={{
      //   background: "rgba(241, 163, 138, 0.1)",
      //   borderRadius: "16px",
      //   boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
      //   backdropFilter: "blur(5px)",
      // }}
      px={1}
      width="100%"
      height="100vh"
      //mx for classes that set both margin-left and margin-right
      mx="auto"
      position="absolute"
      top={0}
      left={0}
      zIndex={2}
      sx={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80)",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(5px)",
        display: "grid",
        placeItems: "center",
      }}
    >
      <Card
        sx={{
          position: "relative",
          background: "rgba(255, 255, 255, 0.7)",
          borderRadius: "16px",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(5px)",
          width: "60%",
          minWidth: 300,
          mx: "auto",
        }}
      >
        <IconButton
          sx={{
            width: 10,
            height: 10,
            position: "absolute",
            top: 10,
            right: 10,
            color: "secondary.focus",
          }}
          onClick={() => {
            setLastName("");
            setEmail("");
            setDisplaySignIn(false);
            naviate("/");
          }}
        >
          <Icon>
            <HighlightOffOutlined />
          </Icon>
        </IconButton>
        <Box pt={5} pb={3} px={5}>
          <Box component="form" role="form" onSubmit={handleSubmit} noValidate>
            <Box mb={2}>
              <TextField
                type="text"
                label="Last Name"
                variant="outlined"
                value={lastName}
                name="lastName"
                required
                onChange={(e) => {
                  e.preventDefault();
                  setLastName(e.target.value);
                }}
                fullWidth
              />
            </Box>
            <Box mb={2}>
              <TextField
                type="email"
                label="Email"
                name="email"
                sx={{ color: "darkgrey" }}
                value={email}
                onChange={(e) => {
                  e.preventDefault();
                  setEmail(e.target.value);
                }}
                required
                fullWidth
              />
            </Box>

            <Box mt={4} mb={1}>
              <Button
                variant="contained"
                type="submit"
                fullWidth
                disabled={!email || !lastName}
              >
                sign in
              </Button>
            </Box>
          </Box>
          <Box mt={4} mb={1}>
            <Button
              variant="text"
              type="button"
              // fullWidth
              sx={{ color: "primary.dark" }}
              // href={"/customers/signup"}
              onClick={() => naviate("/customers/signup")}
            >
              NEW CLIENT JOIN
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default LoginPage;
