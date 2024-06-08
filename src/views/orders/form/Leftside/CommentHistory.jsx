import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { CommentIcon } from "constants/icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getCustomerComments } from "services/customerComment";
import moment from "moment";
import Modal from "components/ModalV2";

export default function CommentHistory({ phoneNumber, clientId }) {
  const { t } = useTranslation();

  const [modalStatus, setModalStatus] = useState(false);
  const [comments, setComments] = useState([]);
  const handleCustomerComments = () => {
    getCustomerComments(phoneNumber)
      .then((res) => setComments(res.comments))
      .catch((err) => console.log(err));
  };
  return (
    <>
      <IconButton
        disabled={!clientId}
        color="primary"
        size="small"
        title={t("commentaries_to_the_client")}
        onClick={() => {
          setModalStatus(true);
          handleCustomerComments();
        }}
        sx={{
          border: "1px solid rgba(0, 0, 0, 0.08)",
          borderRadius: 1.5,
        }}
      >
        <CommentIcon
          color={clientId ? "var(--primary-color)" : "#00000042"}
          fontSize="inherit"
        />
      </IconButton>
      <Modal
        title={t("commentaries_to_the_client")}
        open={modalStatus}
        onClose={() => setModalStatus(false)}
        maxWidth="sm"
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
                <TableRow key={elm?.comment_id}>
                  <TableCell className="whitespace-nowrap">
                    {index + 1}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {elm?.comment}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {moment(elm?.created_at || new Date()).format(
                      "YYYY-MM-DD HH:mm:ss",
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Modal>
    </>
  );
}
