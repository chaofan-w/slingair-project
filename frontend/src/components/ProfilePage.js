import * as React from "react";
import { BrowserRouter as Router, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Stack,
  List,
  ListItem,
  ListSubheader,
} from "@mui/material";
import ReservationContext from "../ReservationContext";
import ReservationCardNonEditable from "./ReservationCardNonEditable";

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
        <List sx={{ width: "100%" }}>
          <ListItem>
            <Stack direction="row" spacing={2}>
              <Typography
                variant="subtitle1"
                textAlign={"right"}
                sx={{ width: 100, color: "primary.dark" }}
              >
                Client Name:
              </Typography>
              <Typography variant="h6">
                {loginUser.first_name + " " + loginUser.last_name}
              </Typography>
            </Stack>
          </ListItem>

          <ListItem sx={{ width: "100%" }}>
            <Stack direction="row" spacing={2}>
              <Typography
                variant="subtitle1"
                textAlign={"right"}
                sx={{ width: 100, color: "primary.dark" }}
              >
                Email:
              </Typography>
              <Typography variant="h6">{loginUser.email}</Typography>
            </Stack>
          </ListItem>
          <ListItem sx={{ width: "100%" }}>
            <List sx={{ width: "100%" }}>
              <ListSubheader>
                <Typography>Reservations</Typography>
              </ListSubheader>
              {loginUser.reservations &&
                loginUser.reservations.map((orderItem) => (
                  <ListItem key={orderItem._id}>
                    <ReservationCardNonEditable orderItem={orderItem} />
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
