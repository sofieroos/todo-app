import React from "react";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { green, grey } from "@material-ui/core/colors";
import { Header } from "./Header";
import { Todos } from "./Todos";

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Header />
      <Todos />
    </ThemeProvider>
  );
};

const theme = createMuiTheme({
  palette: {
    primary: green,
    secondary: grey,
  },
});
