import { useState, useEffect, useMemo, useRef, forwardRef } from "react";
import { useTranslation } from "react-i18next";
import Card from "../Card";
import Switch from "../Switch";
import Menu from "@mui/material/Menu";
import { withStyles } from "@mui/styles";
import TableChartIcon from "@mui/icons-material/TableChart";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import {
  SortableContainer,
  SortableElement,
  arrayMove,
  SortableHandle,
} from "react-sortable-hoc";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateOrder, clearOrder } from "redux/actions/tableActions";
import parseQuery from "helpers/parseQuery";
import Button from "components/Button";

var menuStyles = {
  paper: {
    width: "320px",
    maxHeight: "336px",
    border: "1px solid #d3d4d5",
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  list: {
    padding: 0,
  },
};

let StyledMenu = forwardRef((props, ref) => {
  return (
    <Menu
      elevation={0}
      getcontentanchorel={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      {...props}
      ref={ref}
    />
  );
});

StyledMenu = withStyles(menuStyles)(StyledMenu);

// merge cols to get render method; JSON.stringify() ignores obj methods
function mergeCols(cols1, cols2) {
  if (!cols1) return cols2;
  return cols1.map((col, index) =>
    Object.assign({ hide: false }, { render: cols2[index]?.render }, col),
  );
}

export default function SwitchColumns({
  columns = [],
  onChange = () => {},
  iconClasses = "",
  sortable = true,
}) {
  const { t } = useTranslation();
  const { tab = "" } = parseQuery();
  const location = useLocation();
  const dispatch = useDispatch();
  const storedOrder = useSelector(
    (state) => state.table[location.pathname + tab],
  );

  const [data, setData] = useState(mergeCols(storedOrder, columns));

  useEffect(() => {
    // keeping local cols in sync with persisted cols
    setData(mergeCols(storedOrder, columns));
  }, [storedOrder, columns]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [all, setAll] = useState(true);
  const menuRef = useRef();

  const switchType = useMemo(() => {
    if (data.every((elm) => !elm.hide)) return "allChecked";
    if (data.some((elm) => !elm.hide)) return "checked";
    return "unChecked";
  }, [data]);

  useEffect(() => {
    setAll((prev) => {
      return data.every((elm) => !elm.hide);
    });
    onChange(data.filter((elm) => !elm.hide));
  }, [data, onChange]);

  const onSwitchChange = (val, key) => {
    var sortedCols = data.map((elm) =>
      elm.key === key ? { ...elm, hide: !val } : elm,
    );
    dispatch(
      updateOrder({
        location: location.pathname,
        order: sortedCols,
        tab: tab ?? "",
      }),
    );
    setAll((prev) => {
      return !val && prev && !prev;
    });
  };

  const onAllClick = () => {
    setAll((prev) => !prev);
    if (switchType === "checked" || switchType === "unChecked") {
      const sortedCols = data.map((elm) => ({ ...elm, hide: false }));
      dispatch(
        updateOrder({
          location: location.pathname,
          order: sortedCols,
          tab: tab ?? "",
        }),
      );
    } else {
      const sortedCols = data.map((elm) => ({ ...elm, hide: true }));
      dispatch(
        updateOrder({
          location: location.pathname,
          order: sortedCols,
          tab: tab ?? "",
        }),
      );
    }
    setAnchorEl(null);
  };

  const resetOrder = () => {
    dispatch(
      clearOrder({
        location: location.pathname,
        order: columns,
        tab: tab ?? "",
      }),
    );
    setAnchorEl(null);
  };

  const title = (
    <div className="flex w-full justify-between items-center">
      <div>{t("all")}</div>
      <Switch checked={all} onChange={onAllClick} />
    </div>
  );

  const DragHandle = SortableHandle(() => (
    <DragIndicatorIcon
      style={{
        color: "#6e8bb7",
        cursor: "n-resize",
      }}
    />
  ));

  const ItemContainer = ({ element }) => (
    <div
      className="w-full py-2 px-4 border-b flex justify-between items-center"
      key={element.value}
      style={{ zIndex: 999999 }}
    >
      <div className="flex gap-0.5">
        {sortable && <DragHandle />}
        <div
          style={{
            marginLeft: typeof element.title === "object" ? "-2rem" : "",
          }}
        >
          {typeof element?.title === "string"
            ? element.title
            : element?.title?.props?.children[0]?.props?.children}
        </div>
      </div>

      <Switch
        checked={!element.hide}
        onChange={(val) => onSwitchChange(val, element.key)}
      />
    </div>
  );

  var SortableList = useMemo(() => {
    if (!sortable) return;
    const onSortEnd = ({ oldIndex, newIndex }) => {
      var sortedCols = arrayMove(data, oldIndex, newIndex);
      dispatch(
        updateOrder({
          location: location.pathname,
          order: sortedCols,
        }),
      );
    };

    const SortableItem = SortableElement(({ value }) => {
      return <ItemContainer element={value} />;
    });

    const SortableList = SortableContainer(({ items }) => {
      return (
        <div>
          {items.map((item, index) => (
            <SortableItem key={item.key} index={index} value={item} />
          ))}
        </div>
      );
    });

    return ({ items }) => (
      <SortableList items={items} onSortEnd={onSortEnd} useDragHandle />
    );
  }, [data, sortable, dispatch, location.pathname]);

  return (
    <div className="cursor-pointer transition-all duration-100">
      <div
        className={`fill-current text-primary cursor-pointer ${iconClasses}`}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        <TableChartIcon />
      </div>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        ref={menuRef}
      >
        <Card
          headerStyle={{ padding: "10px 12px" }}
          footerStyle={{ padding: "10px 12px" }}
          bodyStyle={{
            padding: 0,
            overflowY: "scroll",
            maxHeight: 336 - 56 * 2,
          }}
          footer={
            sortable && (
              <Button
                variant="outlined"
                onClick={(e) => {
                  e.stopPropagation();
                  resetOrder();
                }}
              >
                {t("reset")}
              </Button>
            )
          }
          filters={title}
        >
          {sortable ? (
            <SortableList items={data} />
          ) : (
            data.map((elm) => (
              <div key={elm.key + "-col"}>
                <ItemContainer element={elm} />
              </div>
            ))
          )}
        </Card>
      </StyledMenu>
    </div>
  );
}
