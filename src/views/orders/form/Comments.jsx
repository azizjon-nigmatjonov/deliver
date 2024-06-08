import TextArea from "components/Textarea";
import Card from "components/Card";
import Form from "components/Form/Index";
import { useTranslation } from "react-i18next";
import Button from "components/Button";
import { useState } from "react";
import { getCustomerComments } from "services/customerComment";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import moment from "moment";
import Modal from "components/ModalV2";

export default function Comments({ formik, handleUserLogs }) {
  const { t } = useTranslation();
  const { handleChange, values } = formik;
  const [modalStatus, setModalStatus] = useState(false);
  const [comments, setComments] = useState([]);

  const handleCustomerComments = () => {
    getCustomerComments(values?.client_id)
      .then((res) => setComments(res?.comments))
      .catch((err) => console.log(err));
  };

  return (
    <Card title={t("order_comments")}>
      <div className="w-full flex-col items-baseline mb-4">
        <Form.Item formik={formik} name="description">
          <TextArea
            size={5}
            id="description"
            placeholder={t("leave_a_comment_to_order")}
            value={values.description}
            onChange={(e) => {
              handleChange(e);
              handleUserLogs({ name: t("order.description") });
            }}
          />
        </Form.Item>
      </div>
      <Button
        onClick={() => {
          if (values?.client_phone_number) {
            setModalStatus(true);
            handleCustomerComments();
          }
        }}
      >
        {t("show.all.comments")}
      </Button>

      <Modal
        title={t("customer.comments")}
        open={modalStatus}
        onClose={() => setModalStatus(false)}
        maxWidth="lg"
        fullWidth={true}
      >
        <TableContainer className="border border-lightgray-1">
          <Table aria-label="simple-table">
            <TableHead>
              <TableRow>
                <TableCell>№</TableCell>
                <TableCell className="w-2/3">{t("comments")}</TableCell>
                <TableCell>{t("date.branch")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {comments?.map((elm, index) => (
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    {index + 1}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {elm.comment}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {moment(elm.created_at).format("YYYY-MM-DD HH:mm:ss")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Modal>
    </Card>
  );
}
