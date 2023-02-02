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
} from "@mui/material";
import ReservationContext from "../ReservationContext";
const ProfilePage = () => {
  const { last_name, email } = useParams();
  const [loginUser, setLoginUser] = React.useState(null);
  const { reservationState, reservationDispatch } =
    React.useContext(ReservationContext);

  React.useEffect(() => {
    let ignore = false;
    if (!ignore) {
      fetch(`/api/customers/${last_name}/${email}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 200) {
            console.log(data.data);
            setLoginUser(data.data);
            reservationDispatch({
              type: "get_profile",
              loginStatus: true,
              error: "",
              lastName: last_name,
              loginEmail: email,
              carts: reservationState.carts,
              reservations: data.data.reservations,
              message: "",
            });
          }
        });
    }
    return () => {
      ignore = true;
    };
  }, [last_name, email]);

  return (
    <Box>
      {loginUser && (
        <List>
          <ListItem>
            <Typography>
              <span style={{ color: "red" }}>First Name: </span>
              {loginUser.first_name}
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              <span style={{ color: "red" }}>Last Name: </span>
              {loginUser.last_name}
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              <span style={{ color: "red" }}>Email: </span>
              {loginUser.email}
            </Typography>
          </ListItem>
          <ListItem>
            <List>
              <ListSubheader>
                <Typography>Reservations</Typography>
              </ListSubheader>
              {loginUser.reservations &&
                loginUser.reservations.map((orderItem) => (
                  <ListItem key={orderItem._id}>
                    <Typography>
                      <span style={{ color: "red" }}>Order Id: </span>
                      {orderItem._id}
                    </Typography>
                    <List>
                      {orderItem.order &&
                        orderItem.order.map((order, index) => (
                          <ListItem key={`order-${index}`}>
                            <ListSubheader>
                              <Typography>{order.flight}</Typography>
                            </ListSubheader>
                            {order.seat &&
                              order.seat.map((seat) => (
                                <ListItemButton>{seat}</ListItemButton>
                              ))}
                          </ListItem>
                        ))}
                    </List>
                  </ListItem>
                ))}
            </List>
          </ListItem>
        </List>
      )}
    </Box>
  );
};

export default ProfilePage;
