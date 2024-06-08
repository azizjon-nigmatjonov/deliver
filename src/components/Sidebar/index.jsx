import { useState, useEffect, useMemo } from "react";
import { useHistory, NavLink } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "../Avatar/Index";
import "./index.scss";
// import { menu, settings } from "./menu";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import BrandLogo from "assets/icons/logo.svg";
import logoutIcon from "assets/icons/logout.svg";
import Menu from "components/Menu";
import { Link } from "react-router-dom";
import useSidebarElements from "hooks/useSidebarElements";
import { logout } from "redux/actions";
import Modal from "components/ModalV2";
import Button from "components/Button/Buttonv2";
import { Box } from "@mui/material";

// var sidebar = JSON.parse(localStorage.getItem("sidebar"));

export default function Sidebar() {
  const history = useHistory();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  // const location = useLocation();
  const permissions = useSelector((state) => state.userPermissions.permissions);
  const { account, menu, settings } = useSidebarElements();

  const allMenus = useMemo(() => {
    let menus = menu.concat(settings, account);
    return menus;
  }, []);

  // sidebar?.isOpen &&
  //   location.pathname !== "/home/dashboard" &&
  //   location.pathname !== "/home/orders"
  //   ? true
  //   :
  const [visible, setVisible] = useState(false);
  const [selectedList, setSelectedList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");

  const permissionsMap = useMemo(() => {
    const result = [];
    permissions?.forEach((el) => {
      result?.push(el.key);
    });
    return result;
  }, [permissions]);

  const logoutHandler = () => {
    setIsModalOpen(true);
  };

  const toggleSidebar = () => {
    if (selectedList.length) {
      setVisible((prev) => !prev);
    }
  };

  const [expand, setExpand] = useState(
    Array(20).fill(false), // || menu[menu.length - 1].children.length
  );

  // useToggle(function () {
  //   setVisible((prev) => !prev);
  // });

  // useEffect(() => {
  //   localStorage.setItem("sidebar", JSON.stringify({ isOpen: visible }));
  // }, [visible]);

  // useEffect(() => {
  //   if (!location.pathname.includes("orders")) {
  //     dispatch({ type: CLEAR_FILTERS_DATA });
  //   }
  // }, [location.pathname]);

  useEffect(() => {
    if (menu.length > 0) {
      allMenus?.forEach((el) => {
        const fatherPathname = el.path.split("/")[2];
        if (history.location.pathname.includes(fatherPathname)) {
          if (el.children && el.children.length) {
            setSelectedList(el.children);
            setTitle(el.title);
          }
        }
      });
    }
  }, [history, allMenus, menu.length]);

  const linkTo = (item) => {
    if (!item.isChild) {
      setTitle(item.title);
    }

    if (item.children && item.children.length > 0) {
      setVisible(true);
      setSelectedList(item.children);
      setTimeout(() => {
        if (item.redirect) history.push(item.redirect);
      }, 0);
      return;
    } else {
      setSelectedList([]);
    }

    setVisible(false);
  };

  const updateMenus = (index) => {
    setExpand((prev) => prev.map((item, i) => (index === i ? !item : item)));
  };

  const RenderSidebarItems = ({ items }) => {
    return (
      <ul className="space-y-2 text-sm mt-5 dashboard_list font-body">
        {items?.map((el, i) => (
          <li key={el.id}>
            {el?.children && permissionsMap?.includes(el.permission) ? (
              <Menu
                title={t(el.title)}
                onChange={() => {
                  updateMenus(i);
                  if (el.redirect) {
                    history.push(el.redirect);
                  } else {
                    history.push(el.path);
                  }
                }}
                isExpanded={expand[i]}
              >
                {el.children.map(
                  (item, index) =>
                    permissionsMap.includes(item.permission) && (
                      <NavLink
                        exact={false}
                        activeClassName="is-active"
                        to={item.path}
                        key={index}
                      >
                        <span className="sidebarItem menu_item">
                          <span>{t(item.title)}</span>
                        </span>
                      </NavLink>
                    ),
                )}
              </Menu>
            ) : (
              permissionsMap?.includes(el.permission) && (
                <NavLink
                  activeClassName="is-active"
                  onClick={() => setExpand(Array(20).fill(false))}
                  to={el.path}
                >
                  <span className="sidebarItem">
                    <span>{t(el.title)}</span>
                  </span>
                </NavLink>
              )
            )}
          </li>
        ))}
      </ul>
    );
  };

  const RenderMenuElements = ({ items }) =>
    items.map(
      (el) =>
        permissionsMap.includes(el.permission) && (
          <li key={el.id}>
            <NavLink
              exact={false}
              activeClassName="is-active-sidebar"
              to={el.path}
              onClick={() => linkTo(el)}
              className="flex items-center justify-center"
            >
              <Tooltip placement="right" title={t(el.title)}>
                <span
                  className={`active-sidebar w-12 h-12 flex items-center justify-center space-x-2 text-gray-700 p-0 rounded-md`}
                >
                  <span className="text-secondary flex items-center">
                    <el.icon />
                  </span>
                </span>
              </Tooltip>
            </NavLink>
          </li>
        ),
    );

  return (
    <>
      <div className="flex h-screen h-full">
        <div
          className="font-body flex flex-col items-center fixed top-0 bottom-0 left-0 justify-between bg-white relative z-30"
          style={{ borderRight: "1px solid rgba(229, 233, 235, 0.75)" }}
        >
          <div>
            <ul className="px-auto mt-2 pb-2 flex" onClick={toggleSidebar}>
              <Avatar size={40} color="transparent" className="mx-auto">
                <Link to="/">
                  <img width={30} src={BrandLogo} alt="" />
                </Link>
              </Avatar>
            </ul>

            <ul className="w-16 pt-2 text-sm items-center">
              <RenderMenuElements items={menu} />
            </ul>
          </div>

          <div className="flex flex-col items-center">
            <ul
              style={{ transition: "all 0.3s" }}
              className="space-y-2 items-end dashboard_list transition ease-in-out transform"
            >
              <RenderMenuElements items={settings} />
              <RenderMenuElements items={account} />

              <div
                onClick={logoutHandler}
                className="flex justify-center cursor-pointer py-4"
              >
                <img src={logoutIcon} alt="logout" />
              </div>
            </ul>
          </div>
        </div>
        <div
          className={`h-screen sidebar border-l bg-white w-60 sidebar-nav-menu relative z-30 ${
            visible
              ? "px-4 py-6 border-r"
              : "inset-0 transform -translate-x-4 overflow-hidden"
          }`}
          style={{
            height: "100%",
            transition: "all 0.3s",
            width: visible ? "" : "0px",
            opacity: visible ? "1" : "0",
            maxHeight: "100vh",
            overflowY: "auto",
          }}
        >
          <div className="flex justify-between items-center w-full">
            <p className="truncate text-lg font-semibold flex items-center">
              {t(title)}
            </p>
            <span
              className="flex items-center cursor-pointer"
              onClick={toggleSidebar}
            >
              <svg
                width="20"
                height="14"
                viewBox="0 0 16 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.33333 10H10.5C10.9583 10 11.3333 9.625 11.3333 9.16667C11.3333 8.70833 10.9583 8.33333 10.5 8.33333H1.33333C0.875 8.33333 0.5 8.70833 0.5 9.16667C0.5 9.625 0.875 10 1.33333 10ZM1.33333 5.83333H8C8.45833 5.83333 8.83333 5.45833 8.83333 5C8.83333 4.54167 8.45833 4.16667 8 4.16667H1.33333C0.875 4.16667 0.5 4.54167 0.5 5C0.5 5.45833 0.875 5.83333 1.33333 5.83333ZM0.5 0.833333C0.5 1.29167 0.875 1.66667 1.33333 1.66667H10.5C10.9583 1.66667 11.3333 1.29167 11.3333 0.833333C11.3333 0.375 10.9583 0 10.5 0H1.33333C0.875 0 0.5 0.375 0.5 0.833333ZM14.9167 7.4L12.5167 5L14.9167 2.6C15.2417 2.275 15.2417 1.75 14.9167 1.425C14.5917 1.1 14.0667 1.1 13.7417 1.425L10.75 4.41667C10.425 4.74167 10.425 5.26667 10.75 5.59167L13.7417 8.58333C14.0667 8.90833 14.5917 8.90833 14.9167 8.58333C15.2333 8.25833 15.2417 7.725 14.9167 7.4Z"
                  fill="#5B77A0"
                />
              </svg>
            </span>
          </div>
          <RenderSidebarItems items={selectedList} />
        </div>
      </div>
      <Modal
        title={t("logout")}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="xs"
        fullWidth
        noCloseIcon
      >
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => setIsModalOpen(false)}
          >
            {t("cancel")}
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={() => dispatch(logout())}
          >
            {t("approve")}
          </Button>
        </Box>
      </Modal>
    </>
  );
}
