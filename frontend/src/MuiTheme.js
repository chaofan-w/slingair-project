import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      light: "#ffeeff",
      main: "#f8bbd0",
      dark: "#c48b9f",
      contrastText: "#212121",
    },
    secondary: {
      light: "#ffff8b",
      main: "#ffee58",
      dark: "#c9bc1f",
      contrastText: "#212121",
    },
  },
});

export default theme;
