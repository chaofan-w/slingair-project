import * as React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Button,
  Fade,
  Snackbar,
  Stack,
  IconButton,
  Icon,
  Avatar,
  Menu,
  MenuItem,
  ButtonBase,
  ListItemIcon,
} from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import ReservationContext from "../ReservationContext";
import {
  SupervisedUserCircle,
  Login,
  Logout,
  Settings,
  BookOnline,
  EventSeat,
} from "@mui/icons-material";
const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const navigate = useNavigate();
  const {
    reservationState,
    reservationDispatch,
    displayCheckout,
    setDisplayCheckout,
    setDisplaySignIn,
  } = React.useContext(ReservationContext);

  const avatarNameAbbre = (lastName) => {
    return {
      sx: {
        bgcolor: (theme) => theme.palette.primary.main,
      },
      alt: lastName,
      children: `${lastName[0]}`,
    };
  };

  return (
    <React.Fragment>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ pr: 5 }}
      >
        <Button
          variant="outlined"
          href="/"
          // onClick={() => {
          //   window.localStorage.setItem(
          //     "reservationState",
          //     JSON.stringify(reservationState)
          //   );
          // }}
        >
          Home
        </Button>
        {reservationState.loginStatus ? (
          <Stack direction={"row"} spacing={2} alignItems={"center"}>
            <Box display="block" position="relative">
              <IconButton
                disabled={
                  reservationState.carts.reduce(
                    (accumulator, curr) => accumulator + curr.seat.length,
                    0
                  ) === 0
                }
                onClick={() => setDisplayCheckout(!displayCheckout)}
              >
                <ShoppingCart />
              </IconButton>
              {reservationState.carts.reduce(
                (accumulator, curr) => accumulator + curr.seat.length,
                0
              ) > 0 && (
                <Typography
                  sx={{
                    width: 18,
                    height: 18,
                    lineHeight: 1.5,
                    fontSize: 12,
                    textAlign: "center",
                    position: "absolute",
                    top: 0,
                    right: 0,
                    backgroundColor: (theme) => theme.palette.primary.main,
                    borderRadius: "50%",
                    color: "white",
                  }}
                >
                  {/* 
           useing the reduce, the accumulated/prev value should be set as the value itself, not the as an element. here prev is the accumulation of all seatA length, it starts with 0, initial value is 0. from initial value one, the reduce will accumulate the value by 0 + first obj.seat.length; then plus 2nd obj.seat.length
           if the element itself is the value, then use pre, curr e.g., (pre, curr)=>pre+curr
           if need futher action to get the value from element, use accumulator, currentValue, e.g., (accumulator, currentValue)=> [...accumulator, ...currentValue.seat],[]
          
          */}
                  {reservationState.carts.reduce(
                    (accumulator, curr) => accumulator + curr.seat.length,
                    0
                  )}
                </Typography>
              )}
            </Box>
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Avatar {...avatarNameAbbre(reservationState.lastName)} />
            </IconButton>

            {/* <Button
              id="logoutBtn"
              variant="text"
              onClick={async (e) => {
                e.preventDefault();
                await reservationDispatch({
                  type: "get_profile",
                  loginStatus: false,
                  error: "",
                  lastName: "",
                  loginEmail: "",
                  carts: [],
                  reservations: [],
                  message: "",
                });

                // window.localStorage.setItem(
                //   "reservationState",
                //   JSON.stringify({
                //     loginStatus: false,
                //     error: "",
                //     lastName: "",
                //     loginEmail: "",
                //     carts: [],
                //     reservations: [],
                //     message: "",
                //   })
                // );
                await setDisplaySignIn(false);
                navigate("/");
              }}
            >
              <Typography>Logout</Typography>
            </Button> */}
          </Stack>
        ) : (
          <IconButton
            onClick={() => {
              setDisplaySignIn(true);
            }}
          >
            <Typography variant="h6" sx={{ mr: 2, color: "primary.main" }}>
              Login
            </Typography>
            <Icon>
              <Login sx={{ color: "primary.main" }} />
            </Icon>
          </IconButton>
        )}
      </Stack>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onclose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            //small triangle arrow on top of popup menu
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translate(-50%, -50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem>
          <Link
            to={`/customers/${reservationState.lastName}/${reservationState.loginEmail}`}
            style={{ textDecoration: "none" }}
          >
            <Stack direction={"row"} alignItems={"center"}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              <Typography>Profile</Typography>
            </Stack>
          </Link>
        </MenuItem>
        <MenuItem>
          <Link
            to={`/customers/reservations/${reservationState.lastName}/${reservationState.loginEmail}`}
            style={{ textDecoration: "none" }}
          >
            <Stack direction={"row"} alignItems={"center"}>
              <ListItemIcon>
                <BookOnline fontSize="small" />
              </ListItemIcon>
              <Typography>Reservations</Typography>
            </Stack>
          </Link>
        </MenuItem>
        <MenuItem>
          <Link
            to={`/customers/carts/${reservationState.lastName}/${reservationState.loginEmail}`}
            style={{
              textDecoration: "none",
              pointerEvents:
                reservationState.carts.reduce(
                  (accumulator, curr) => accumulator + curr.seat.length,
                  0
                ) > 0
                  ? "auto"
                  : "none",
            }}
          >
            <Stack direction={"row"} alignItems={"center"}>
              <ListItemIcon>
                <ShoppingCart fontSize="small" />
              </ListItemIcon>
              <Box position={"relative"}>
                {reservationState.carts.reduce(
                  (accumulator, curr) => accumulator + curr.seat.length,
                  0
                ) > 0 && (
                  <Typography
                    sx={{
                      width: 15,
                      height: 15,
                      lineHeight: 1.5,
                      fontSize: 10,
                      textAlign: "center",
                      position: "absolute",
                      top: -2,
                      right: -12,
                      backgroundColor: (theme) => theme.palette.primary.main,
                      borderRadius: "50%",
                      color: "white",
                    }}
                  >
                    {reservationState.carts.reduce(
                      (accumulator, curr) => accumulator + curr.seat.length,
                      0
                    )}
                  </Typography>
                )}
                <Typography>Carts</Typography>
              </Box>
            </Stack>
          </Link>
        </MenuItem>
        <MenuItem>
          <ButtonBase
            id="logoutBtn"
            variant="text"
            onClick={async (e) => {
              e.preventDefault();
              await reservationDispatch({
                type: "get_profile",
                loginStatus: false,
                error: "",
                lastName: "",
                loginEmail: "",
                carts: [],
                reservations: [],
                message: "",
              });

              // window.localStorage.setItem(
              //   "reservationState",
              //   JSON.stringify({
              //     loginStatus: false,
              //     error: "",
              //     lastName: "",
              //     loginEmail: "",
              //     carts: [],
              //     reservations: [],
              //     message: "",
              //   })
              // );
              await setDisplaySignIn(false);
              navigate("/");
            }}
          >
            <Stack direction={"row"} alignItems={"center"}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              <Typography>Logout</Typography>
            </Stack>
          </ButtonBase>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};

export default Header;
