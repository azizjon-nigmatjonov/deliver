import { NavLink, Link } from "react-router-dom";

const MenuItem = ({ name, subMenus, iconClassName, onClick, to, exact }) => {
  return (
    <li onClick={onClick}>
      <Link exact to={to} className={`menu-item`}>
        <div className="menu-icon">
          <i class={iconClassName}></i>
        </div>
        <span>{name}</span>
      </Link>
      {subMenus && subMenus.length > 0 && (
        <ul className={`sub-menu`}>
          {subMenus.map((menu, index) => (
            <li key={index}>
              <NavLink to={menu.to}>{menu.name}</NavLink>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default MenuItem;
