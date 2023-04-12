import * as React from "react";
import {
  Box,
  Typography,
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
import { Delete, AirlinesOutlined } from "@mui/icons-material";
import ReservationContext from "../ReservationContext";
import logo from "./logo-icon.png";

const ReservationCard = ({
  orderItem,
  handleCancelReservations,
  handleToggle,
  selectSeat,
  checked,
  selectedSeats,
}) => {
  // const { last_name, email } = useParams();
  // const [loginUser, setLoginUser] = React.useState(null);
  const { reservationState, reservationDispatch } =
    React.useContext(ReservationContext);
  const [selectAllFlights, setSelectAllFlights] = React.useState({});
  // const [selectedSeats, setSelectedSeats] = React.useState(null);
  // const [checked, setChecked] = React.useState([]);

  let reservationFlight;
  if (reservationState.reservations) {
    reservationFlight = reservationState.reservations.find(
      (order) => order._id === orderItem._id
    ).order;
  }

  let reservedFlightSeatTotal = reservationFlight.reduce(
    (prev, curr) => prev + curr.seat.length,
    0
  );
  // console.log(reservedFlightSeatTotal);

  React.useEffect(() => {
    if (selectedSeats && selectedSeats[orderItem._id]) {
      let selectedFlightSeatTotal = Object.values(
        selectedSeats[`${orderItem._id}`]
      ).reduce((prev, curr) => prev + curr.length, 0);
      setSelectAllFlights({
        ...selectAllFlights,
        [orderItem._id]: reservedFlightSeatTotal === selectedFlightSeatTotal,
      });
    }
  }, [selectedSeats]);

  // console.log(selectAllFlights);
  // console.log(selectedSeats);

  return (
    <Card
      sx={{
        minWidth: 360,
        width: "70%",
        backgroundImage:
          "url(https://images.unsplash.com/photo-1437846972679-9e6e537be46e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80)",
        backgroundPosition: "top",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        position: "relative",
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
        subheader={`Order No.: ${orderItem._id}`}
        sx={{ bgcolor: "primary.main", py: 0 }}
      />
      <Box
        sx={{ width: 50, height: 50, position: "absolute", top: 0, right: 0 }}
      >
        {selectAllFlights[orderItem._id] && (
          <IconButton
            key={orderItem._id}
            onClick={(e) => {
              handleCancelReservations(e, orderItem._id);
            }}
            value={"all"}
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

      <CardContent
        sx={{
          background: "rgba(255, 255, 255, 0.4)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(5px)",
        }}
      >
        <List>
          {orderItem.order &&
            orderItem.order.map((order, index) => (
              <ListItem
                key={`order-${index}`}
                // sx={{ border: "1px solid red" }}
                divider={orderItem.order.length > 1 ? true : false}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  // border: "1px solid red",
                }}
              >
                <Box sx={{ width: 50, height: 50 }}>
                  {selectedSeats &&
                    Object.keys(selectedSeats).includes(orderItem._id) &&
                    Object.keys(selectedSeats[orderItem._id]).includes(
                      order.flight
                    ) && (
                      <IconButton
                        key={orderItem._id}
                        onClick={(e) => {
                          handleCancelReservations(e, orderItem._id);
                        }}
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
                            await selectSeat(order.flight, orderItem._id, seat);
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
                              checked={checked.indexOf(value) !== -1}
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
  );
};

export default ReservationCard;
