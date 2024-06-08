import { useEffect } from "react";
import { connectSocket } from "utils/socket.js";
import { connect } from "utils/stackMessages";
import ChangePasswordAlert from "components/Alert/ChangePasswordAlert.jsx";
import AlertComponent from "components/Alert/index.jsx";
// import GlobalAlert from "components/GlobalAlert/index.jsx";
import Sidebar from "components/Sidebar/index.jsx";
import "./style.scss";
import NotificationsAlert from "components/NotificationsAlert";

export default function DashboardLayout({ children }) {
  useEffect(() => {
    connectSocket();
    // connect("messages");
  }, []);

  return (
    <>
      <AlertComponent />
      <ChangePasswordAlert />

      <div className="DashboardLayout">
        <Sidebar />
        <div className="content-wrapper bg-background">
          <NotificationsAlert />
          {/* <GlobalAlert /> */}
          <div style={{ position: "relative" }}>{children}</div>
        </div>
      </div>
    </>
  );
}
