import React from "react";
import { Provider } from "react-redux";
import { store, persistor } from "redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider } from "@emotion/react";
import theme from "theme";

function Providers({ pageProps, children }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <PersistGate loading={null} persistor={persistor}>
          {children}
        </PersistGate>
      </ThemeProvider>
    </Provider>
  );
}

export default Providers;
