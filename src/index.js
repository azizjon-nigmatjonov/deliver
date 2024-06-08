import ReactDOM from "react-dom";
import App from "./App.jsx";
import reportWebVitals from "./reportWebVitals";
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://613ac13a72034709a721744edf31d1c7@o4504970699669504.ingest.sentry.io/4504970703208448",
  integrations: [
    new Sentry.BrowserTracing({
      // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: [
        "https://admin.delever.uz/",
        "https://test.admin.delever.uz/",
      ],
    }),
    new Sentry.Replay(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

ReactDOM.render(<App />, document.getElementById("root"));
reportWebVitals();
