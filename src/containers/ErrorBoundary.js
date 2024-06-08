import React from "react";
import axios from "axios";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    let err = `${window.location.hash.replace("#", "")}%0A${error}%0A${
      info?.componentStack
        ? info?.componentStack?.slice(0, 200)?.replace(/\n/g, "%0A")
        : info
    }`;
    if (process.env.REACT_APP_URL === "https://shipper-user.api.delever.uz/v1")
      axios.post(
        "https://api.telegram.org/bot6019506569:AAFrnMLirS_wl1aBeqK8yaTsHzZb1eTZ7J0/sendMessage?chat_id=-1001980050301&text=" +
          err,
      );
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex items-center justify-center text-2xl">
          <h1>
            An error occurred in some component, please report the issue to the
            developers!
          </h1>
        </div>
      );
    }

    return this.props.children;
  }
}
