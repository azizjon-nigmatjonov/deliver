import { Switch, Route, Redirect, useLocation } from "react-router-dom";
import authRoutes from "./authRoutes";
import dashboardRoutes from "./dashboard-routes";
import fallbackRoutes from "./fallback-routes";
import FallbackLayout from "../layouts/FallbackLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import { useSelector, useDispatch } from "react-redux";
import Fallback403 from "../views/exceptions/Fallback403.jsx";
import { animated, useTransition } from "react-spring";
import { useEffect, useMemo } from "react";
import { getUserRolesPermission } from "services";
import { SET_USER_PERMISSIONS } from "redux/constants";
import FullScreenLoader from "components/FullScreenLoader";
import SocketAlert from "components/SocketAlert";
import { logout } from "redux/actions";

const layouts = [
  {
    component: DashboardLayout,
    path: "/home",
    routes: dashboardRoutes,
    private: true,
  },
  {
    component: FallbackLayout,
    path: "/extra",
    routes: fallbackRoutes,
    private: false,
  },
];

const noAccessComponent = () => (
  <>
    <Fallback403 />
  </>
);

const AppRouter = () => {
  const token = useSelector((state) => state.auth.accessToken);
  const { permissions } = useSelector((state) => state.userPermissions);
  const { role_id } = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();
  const transitions = useTransition(location, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  const permissionsMap = useMemo(() => {
    const result = {};
    permissions?.forEach((el) => {
      result[el.key] = el;
    });
    return result;
  }, [permissions]);

  useEffect(() => {
    if (role_id) {
      getUserRolesPermission(role_id)
        .then((res) =>
          dispatch({
            type: SET_USER_PERMISSIONS,
            payload: res,
          }),
        )
        .catch((err) =>
          err?.data?.Error?.Message ===
          "rpc error: code = NotFound desc = Not found"
            ? dispatch(logout())
            : console.log(err),
        );
    }
  }, [location.pathname, role_id, dispatch]);

  if (!token)
    return (
      <Switch>
        {authRoutes.map((route) => (
          <Route
            path={route.path}
            exact={route.exact}
            key={route.id}
            render={(routeProps) => (
              <route.layout history={routeProps.history}>
                <route.component {...routeProps} />
              </route.layout>
            )}
          />
        ))}
        <Redirect to="/auth/login" />
      </Switch>
    );

  return permissions ? (
    <Switch>
      {layouts.map((layout, index) => (
        <Route
          key={index}
          path={layout.path}
          render={(routeProps) => (
            <layout.component>
              {transitions((props, item) => (
                <animated.div style={props}>
                  <div style={{ position: "absolute", width: "100%" }}>
                    <SocketAlert />
                    <Switch location={item}>
                      {layout.routes.map((route) => (
                        <Route
                          key={route.id}
                          path={route.path}
                          component={
                            !permissionsMap[route.permission]
                              ? noAccessComponent
                              : route.component
                          }
                          exact
                        />
                      ))}
                      {/* <Redirect from="*" to="/extra/fallback-404" /> */}
                    </Switch>
                  </div>
                </animated.div>
              ))}
            </layout.component>
          )}
        ></Route>
      ))}
      <Redirect from="/" to="/home/orders" />
      <Redirect from="*" to="/extra/fallback-404" />
    </Switch>
  ) : (
    <FullScreenLoader />
  );
};

export default AppRouter;
