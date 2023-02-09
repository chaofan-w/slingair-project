import {
  Box,
  Paper,
  Typography,
  Button,
  Fade,
  Snackbar,
  Stack,
  List,
  ListItem,
  ListSubheader,
  ListItemButton,
  ListItemIcon,
  IconButton,
  ListItemText,
  Checkbox,
  Tooltip,
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  Divider,
} from "@mui/material";
import * as React from "react";
import ReservationContext from "../ReservationContext";
import { Link, useNavigate } from "react-router-dom";
import {
  Logout,
  Settings,
  Comment,
  Delete,
  AirlinesOutlined,
} from "@mui/icons-material";
import logo from "./logo-icon.png";

const CartPage = () => {
  const navigate = useNavigate();
  const { reservationState, reservationDispatch, setDisplayCheckout } =
    React.useContext(ReservationContext);
  const { carts, lastName, loginEmail } = reservationState;
  const [checked, setChecked] = React.useState([]);
  const [selectedSeats, setSelectedSeats] = React.useState(null);

  const handleToggle = (value) => {
    const currentIndex = checked.indexOf(value);
    let newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const selectSeat = async (flight, seat) => {
    if (!selectedSeats) {
      console.log("no element");
      setSelectedSeats({
        [`${flight}`]: [seat],
      });
      return;
    }

    if (selectedSeats && !Object.keys(selectedSeats).includes(flight)) {
      setSelectedSeats({
        ...selectedSeats,
        [`${flight}`]: [seat],
      });
      return;
    }

    if (selectedSeats && Object.keys(selectedSeats).includes(flight)) {
      let currOrder = selectedSeats[flight];
      console.log(currOrder);
      let newOrder;
      if (currOrder.includes(seat)) {
        newOrder = currOrder.filter((seatNum) => seatNum !== seat);
      } else {
        currOrder.push(seat);
        newOrder = [...currOrder];
      }

      if (newOrder.length === 0) {
        const updateSelectedSeats = { ...selectedSeats };
        delete updateSelectedSeats[flight];

        setSelectedSeats({
          ...updateSelectedSeats,
        });
        return;
      } else {
        setSelectedSeats({
          ...selectedSeats,
          [flight]: newOrder,
        });
      }
    }
  };

  console.log(selectedSeats);

  const deleteSeatsFromCarts = (e) => {
    let currCarts = reservationState.carts;
    let flightnum = e.currentTarget.value;

    currCarts = currCarts.map((order) => {
      if (order.flight === flightnum) {
        const updateseat = order.seat.filter(
          (i) => !selectedSeats[flightnum].includes(i)
        );
        let updateSelects = selectedSeats;
        delete updateSelects[flightnum];

        setSelectedSeats(updateSelects);
        return { ...order, seat: updateseat };
      } else {
        return order;
      }
    });

    return reservationDispatch({
      type: "select_seats",
      error: "",
      carts: currCarts.filter((order) => order.seat.length > 0),
      message: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const option = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: reservationState.loginEmail,
        order: reservationState.carts,
      }),
    };
    await fetch("/api/reservations", option);
    // await reservationState.carts.forEach(async (flight) => {
    //   console.log(flight.flight);
    //   await fetch("/api/seats", {
    //     method: "PATCH",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Accept: "application/json",
    //     },
    //     body: JSON.stringify({ flightNum: flight.flight }),
    //   });
    // });
    await fetch(
      `/api/customers/${reservationState.lastName}/${reservationState.loginEmail}`
    )
      .then((res) => res.json())
      .then((data) => {
        reservationDispatch({
          type: "get_profile",
          loginStatus: reservationState.loginStatus,
          error: "",
          lastName: data.data.last_name,
          loginEmail: data.data.email,
          carts: [],
          reservations: data.data.reservations,
          messge: "",
        });
      });
    setDisplayCheckout(false);
    navigate("/");
  };
  return (
    <React.Fragment>
      <Card
        sx={{
          minWidth: 360,
          width: "70%",
          backgroundImage:
            "url(https://images.unsplash.com/photo-1437846972679-9e6e537be46e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80)",
          backgroundPosition: "top",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          mx: "auto",
          my: 5,
        }}
      >
        <CardHeader
          avatar={
            <Box
              component="img"
              src={logo}
              sx={{
                width: 50,
                height: 50,
              }}
            />
          }
          title={<Typography variant="subtitle2">Sling Airline</Typography>}
          subheader={`Order Summary for Client: ${lastName}`}
          sx={{ bgcolor: "primary.main", py: 0 }}
        />

        <CardContent
          sx={{
            background: "rgba(255, 255, 255, 0.4)",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(5px)",
          }}
        >
          <List>
            {carts &&
              carts.map((order, index) => (
                <ListItem
                  key={`order-${index}`}
                  // sx={{ border: "1px solid red" }}
                  divider={
                    carts.length > 1 && (
                      <Divider
                        variant="middle"
                        sx={{ borderBottomWidth: 10 }}
                      />
                    )
                  }
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    // border: "1px solid red",
                  }}
                >
                  <Box sx={{ width: 50, height: 50 }}>
                    {selectedSeats &&
                      Object.keys(selectedSeats).includes(order.flight) &&
                      selectedSeats[order.flight].length > 0 && (
                        <IconButton
                          key={order.flight}
                          onClick={deleteSeatsFromCarts}
                          value={`${order.flight}`}
                          sx={{ width: 50, height: 50 }}
                        >
                          <Delete
                            sx={{
                              color: (theme) => theme.palette.warning.dark,
                            }}
                          />
                        </IconButton>
                      )}
                  </Box>
                  <AirlinesOutlined
                    sx={{ color: "secondary.dark", mr: 1, height: 50 }}
                  />

                  <Typography
                    sx={{
                      mr: 2,
                      height: 50,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {order.flight.toUpperCase()}
                  </Typography>
                  <Stack
                    direction="row"
                    alignItems={"center"}
                    spacing={0}
                    justifyContent={"flex-start"}
                    sx={{ flexWrap: "wrap", gap: 1 }}
                  >
                    {order.seat &&
                      order.seat.map((seat) => {
                        const value = `${order.flight}-${seat}`;
                        const labelId = `checkbox-list-label-${value}`;
                        return (
                          <ListItemButton
                            sx={{
                              minWidth: 100,
                              maxWidth: 100,
                              height: 50,
                              // p: 0,
                            }}
                            role={undefined}
                            key={value}
                            onClick={async () => {
                              handleToggle(value);
                              await selectSeat(order.flight, seat);
                              // checkEmptyOrder();
                            }}
                          >
                            <ListItemIcon
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                // border: "1px solid red",
                              }}
                            >
                              <Checkbox
                                edge="start"
                                // checked={checked.indexOf(value) !== -1}
                                tabIndex={-1}
                                disableRipple
                                inputProps={{
                                  "aria-labelledby": labelId,
                                }}
                              />
                              <ListItemText id={labelId} primary={seat} />
                            </ListItemIcon>
                          </ListItemButton>
                        );
                      })}
                  </Stack>
                </ListItem>
              ))}
            {/* <Divider variant="inset" /> */}
          </List>
        </CardContent>
      </Card>
      <Box mt={4} mb={1}>
        <Button variant="contained" onClick={handleSubmit} fullWidth>
          Submit
        </Button>
      </Box>
    </React.Fragment>
  );
};

export default CartPage;

{
  /* <Box
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
          // background: "rgba(241, 163, 138, 0.5)",
          // borderRadius: "16px",
          // boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          // backdropFilter: "blur(5px)",
          backgroundImage:
            "url(https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80)",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        {reservationState &&
          reservationState.carts.map((order) => (
            <Stack key={`${order.flight}`}>
              <Typography>{order.flight}</Typography>
              {order.seat &&
                order.seat.map((seat) => (
                  <ListItemButton>{seat}</ListItemButton>
                ))}
            </Stack>
          ))}
        <Box mt={4} mb={1}>
          <Button variant="contained" onClick={handleSubmit} fullWidth>
            Submit
          </Button>
        </Box>
      </Box> */
}
