import ErrorBoundary from "containers/ErrorBoundary";
import { HashRouter } from "react-router-dom";
import Routes from "./routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store, persistor } from "./redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider } from "@emotion/react";
import theme from "theme";
import "./App.scss";
import "tailwindcss/tailwind.css";
import "./index.css";
import "./config/defaultSettings";
import "locales/i18n";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <HashRouter>
              <ErrorBoundary>
                <Routes />
              </ErrorBoundary>
            </HashRouter>
          </QueryClientProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
