import { memo, useState } from "react";
import {
  Grid,
  List,
  Card,
  CardHeader,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Button,
  Divider,
} from "@mui/material";
import { useParams } from "react-router-dom";
import Form from "components/Form/Index";

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

function TransferList({
  left = [],
  right = [],
  formik,
  setLeft = () => {},
  setRight = () => {},
}) {
  const params = useParams();
  const [checked, setChecked] = useState([]);
  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const { setFieldValue } = formik;

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setFieldValue("permission", right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setFieldValue("permission", left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const customList = (title, items, selected = "") => (
    <Card style={{ height: "420px", overflow: "auto" }} className="mt-4">
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            color="primary"
            onClick={handleToggleAll(items)}
            checked={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              numberOfChecked(items) !== items.length &&
              numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{
              "aria-label": "all items selected",
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} ${selected}`}
      />
      <Divider />
      <List dense component="div" role="list">
        {items.map((value) => (
          <ListItem
            key={value.action_id + value.permission_id}
            role="listitem"
            onClick={handleToggle(value)}
          >
            <ListItemIcon>
              <Checkbox
                color="primary"
                checked={checked.indexOf(value) !== -1}
                tabIndex={-1}
                disableRipple
                inputProps={{
                  "aria-labelledby": `transfer-list-all-item-${
                    value.action_id + value?.permission_id
                  }-label`,
                }}
              />
            </ListItemIcon>
            <ListItemText
              id={`transfer-list-all-item-${
                value.action_id + value?.permission_id
              }-label`}
              primary={`${value.action_name}`}
            />
          </ListItem>
        ))}
        <ListItem />
      </List>
    </Card>
  );

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={5}>
        <Form.Item formik={formik} name="user_type_id">
          {customList("Все доступы", left)}
        </Form.Item>
      </Grid>
      <Grid item xs={2}>
        <div className="flex flex-col gap-2 justify-center">
          <Button
            sx={{ my: 0.5 }}
            variant="contained"
            style={
              leftChecked.length !== 0
                ? { color: "#fff", backgroundColor: "#0E73F6" }
                : {}
            }
            size="small"
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="contained"
            size="small"
            style={
              rightChecked.length !== 0
                ? { color: "#fff", backgroundColor: "#0E73F6" }
                : {}
            }
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
        </div>
      </Grid>
      <Grid item xs={5}>
        <Form.Item formik={formik} name="user_type_id">
          {customList(
            "Пользовательский доступ",
            params.id ? (right.length ? right : []) : right,
          )}
        </Form.Item>
      </Grid>
    </Grid>
  );
}

export default memo(TransferList);
