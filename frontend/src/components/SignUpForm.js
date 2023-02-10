import {
  Box,
  Typography,
  Input,
  Button,
  Card,
  Switch,
  Grid,
  MuiLink,
  TextField,
  Divider,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  Icon,
} from "@mui/material";
import { HighlightOffOutlined } from "@mui/icons-material";
import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import ReservationContext from "../ReservationContext";

const SignUpForm = () => {
  const navigate = useNavigate();

  const {
    reservationState,
    displaySignUp,
    setDisplaySignUp,
    reservationDispatch,
    setDisplayAlert,
  } = React.useContext(ReservationContext);
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formValue = new FormData(e.currentTarget);
    const option = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        first_name: formValue.get("first_name"),
        last_name: formValue.get("last_name"),
        email: formValue.get("email"),
      }),
    };
    await fetch("/api/customers", option)
      .then((res) => res.json())
      .then(async (data) => {
        if (data.status === 400) {
          await reservationDispatch({
            type: "throwMessage",
            message: data.message,
          });
          setDisplayAlert({ severity: "warning", display: true });
        } else if (data.status === 200) {
          await reservationDispatch({
            type: "throwMessage",
            message: data.message,
          });
          setDisplayAlert({ severity: "success", display: true });
          setFirstName("");
          setLastName("");
          setEmail("");
          navigate("/");
        }
      });
  };
  return (
    <>
      {/* <Box
        position="absolute"
        top={0}
        left={0}
        zIndex={1}
        width="100%"
        minHeight="100vh"
      /> */}
      <Box
        //px for classes that set both padding-left and padding-right
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
        }}
      >
        <Grid
          container
          spacing={1}
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <Grid item xs={11} sm={9} md={5} lg={4} xl={3}>
            <Card
              sx={{
                position: "relative",
                background: "rgba(255, 255, 255, 0.7)",
                borderRadius: "16px",
                boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                backdropFilter: "blur(5px)",
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
                  setFirstName("");
                  setLastName("");
                  setEmail("");
                }}
                href={"/"}
              >
                <Icon>
                  <HighlightOffOutlined />
                </Icon>
              </IconButton>
              <Box
                mx={2}
                mt={3}
                p={0}
                textAlign="center"
                sx={{
                  borderRadius: "6px",
                }}
              >
                <Typography
                  variant="h4"
                  fontWeight="medium"
                  sx={{ color: (theme) => theme.palette.primary.main }}
                >
                  Sign up
                </Typography>
              </Box>
              <Divider
                sx={{
                  width: "60%",
                  mx: "auto",
                  my: 1,
                }}
              />
              <Box pt={2} pb={3} px={3}>
                <Box
                  component="form"
                  role="form"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <Box mb={2}>
                    <TextField
                      type="text"
                      label="First Name"
                      variant="outlined"
                      value={firstName}
                      name="first_name"
                      required
                      onChange={(e) => {
                        e.preventDefault();
                        setFirstName(e.target.value);
                      }}
                      fullWidth
                    />
                  </Box>
                  <Box mb={2}>
                    <TextField
                      type="text"
                      label="Last Name"
                      variant="outlined"
                      value={lastName}
                      name="last_name"
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
                      disabled={!firstName || !lastName || !email}
                    >
                      Submit
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default SignUpForm;

// const StyledTextField = styled(TextField)({
//   "& .MuiOutlinedInput-input": {
//     fontSize: "15px",
//   },

//   "& label.Mui-focused": {
//     color: secondary.main,
//   },
//   "& .MuiInput-underline:after": {
//     borderBottomColor: primary.main,
//   },
//   "& .MuiOutlinedInput-root": {
//     "& fieldset": {
//       borderColor: secondary.focus,
//     },
//     "&:hover fieldset": {
//       borderColor: secondary.main,
//     },
//     "&.Mui-focused fieldset": {
//       borderColor: primary.main,
//     },
//   },
// });
