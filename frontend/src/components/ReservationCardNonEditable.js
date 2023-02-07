import * as React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
} from "react-router-dom";
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
import {
  Logout,
  Settings,
  Comment,
  Delete,
  AirlinesOutlined,
} from "@mui/icons-material";
import ReservationContext from "../ReservationContext";
import logo from "./logo-icon.png";

const ReservationCardNonEditable = ({
  orderItem,
  handleCancelReservations,
  handleToggle,
  selectSeat,
  checked,
  setChecked,
  selectedSeats,
}) => {
  // const { last_name, email } = useParams();
  // const [loginUser, setLoginUser] = React.useState(null);
  // const { reservationState, reservationDispatch } =
  //   React.useContext(ReservationContext);
  // const [selectedSeats, setSelectedSeats] = React.useState(null);
  // const [checked, setChecked] = React.useState([]);
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
                divider={
                  orderItem.order.length > 1 && (
                    <Divider variant="middle" sx={{ borderBottomWidth: 10 }} />
                  )
                }
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  border: "3px solid rgba(255,255,255,0.32)",
                  borderRadius: "10px",
                  mb: 1,
                }}
              >
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
                          }}
                          role={undefined}
                          key={value}
                        >
                          <ListItemIcon
                            sx={{ display: "flex", alignItems: "center" }}
                          >
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

export default ReservationCardNonEditable;
