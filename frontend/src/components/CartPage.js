import {
  Box,
  Typography,
  Button,
  Stack,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  IconButton,
  ListItemText,
  Checkbox,
  Card,
  CardHeader,
  CardContent,
  Divider,
} from "@mui/material";
import * as React from "react";
import ReservationContext from "../ReservationContext";
import { Link, useNavigate } from "react-router-dom";
import {
  Delete,
  AirlinesOutlined,
} from "@mui/icons-material";
import logo from "./logo-icon.png";
import produce from "immer";

const CartPage = () => {
  const navigate = useNavigate();
  const {
    reservationState,
    reservationDispatch,
    setDisplayCheckout,
    setDisplayAlert,
  } = React.useContext(ReservationContext);
  const { carts, lastName, loginEmail } = reservationState;
  const [checked, setChecked] = React.useState([]);
  const [selectedSeats, setSelectedSeats] = React.useState({});

  const handleToggle = React.useCallback((value) => {
    setChecked(
      produce((draft) => {
        const currentIndex = checked.indexOf(value);
        if (currentIndex === -1) {
          draft.push(value);
        } else {
          draft.splice(currentIndex, 1);
        }
      })
    );
  });

  const selectSeat = async (flight, seat) => {
    // if (!selectedSeats) {
    //   console.log("no element");
    //   setSelectedSeats({
    //     [`${flight}`]: [seat],
    //   });
    //   return;
    // }
    setSelectedSeats(
      produce(selectedSeats, (draft) => {
        if (!Object.keys(draft).includes(flight)) {
          draft[flight] = [seat];
          return;
        }

        if (Object.keys(draft).includes(flight)) {
          let currOrder = draft[flight];
          if (currOrder.includes(seat) && currOrder.length > 1) {
            currOrder.splice(currOrder.indexOf(seat), 1);
          } else if (currOrder.includes(seat) && currOrder.length === 1) {
            delete draft[flight];
          } else {
            currOrder.push(seat);
          }
        } else {
          draft[flight] = [seat];
        }
      })
    );
  };

  const deleteSeatsFromCarts = React.useCallback((e) => {
    let flightnum = e.currentTarget.value;
    const currCarts = produce(reservationState.carts, (draft) => {
      const currOrder = draft.find((order) => order.flight === flightnum);
      selectedSeats[flightnum].forEach((seatnum) => {
        currOrder.seat.splice(currOrder.seat.indexOf(seatnum), 1);
      });
    });

    // currCarts = currCarts.map((order) => {
    //   if (order.flight === flightnum) {
    //     const updateseat = order.seat.filter(
    //       (i) => !selectedSeats[flightnum].includes(i)
    //     );
    //     let updateSelects = selectedSeats;
    //     delete updateSelects[flightnum];

    //     setSelectedSeats(updateSelects);
    //     return { ...order, seat: updateseat };
    //   } else {
    //     return order;
    //   }
    // });

    reservationDispatch({
      type: "select_seats",
      error: "",
      carts: currCarts.filter((order) => order.seat.length > 0),
      message: "",
    });

    setSelectedSeats(
      produce(selectedSeats, (draft) => {
        delete draft[flightnum];
      })
    );
  });

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
    try {
      await fetch("/api/reservations", option)
        .then((res) => res.json())
        .then(async (result) => {
          if (result.status === 200) {
            console.log(result.message);
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
                  message: result.message || "",
                });
              });
          }
        });

      setDisplayCheckout(false);
      setDisplayAlert({ severity: "success", display: true });
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };
  console.log(selectedSeats);
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
      <Box
        mt={4}
        mb={1}
        sx={{
          width: "100%",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Button variant="contained" onClick={handleSubmit} sx={{ width: 120 }}>
          Checkout
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
