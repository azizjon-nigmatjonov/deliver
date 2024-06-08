import { useMemo } from "react";
import { useSelector } from "react-redux";

const PermissionWrapper = ({ children, permission = "", action = "" }) => {
  const permissions = useSelector((state) => state.userPermissions.permissions);

  const hasPermission = useMemo(() => {
    return permissions
      ?.find((el) => el.key === permission)
      ?.actions?.some((el) => el.key === action);
  }, [permissions, permission, action]);

  if (!hasPermission) return null;

  return children;
};

export default PermissionWrapper;
