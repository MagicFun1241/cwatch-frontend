import React from 'react';

import './App.css';

import Main from "./components/Main";
import {
    ThemeProvider,
    createMuiTheme
} from "@material-ui/core";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#009688",
        },
        secondary: {
            main: "#52c7b8",
        },
    },
});

function App() {
  return (
      <ThemeProvider theme={theme}>
          <Main />
      </ThemeProvider>
  );
}

export default App;
