import React, { memo, useEffect, useState } from "react";
import Card from "components/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { withStyles } from "@mui/styles";
import { Placemark } from "@pbe/react-yandex-maps";
import { useTranslation } from "react-i18next";
import { CourierTrackStepper } from "./CourierTrackStepper";
import "./refactor_needed.scss";
import { getUserLog } from "services/userLog";
import { Distance } from "utils/Distance";
import { statusTag } from "../../statuses";
import YandexMap from "components/YandexMap";

const StyledTableCell = withStyles((theme) => ({
  body: {
    fontWeight: "bold",
  },
  head: {
    width: "50px",
    fontWeight: "bold",
  },
}))(TableCell);

function HistoryChanges({ data, isModal }) {
  const [userLogData, setUserLogData] = useState([]);
  const { t } = useTranslation();
  const [showIntegration, setShowIntegration] = useState(false);

  useEffect(() => {
    if (data?.id) {
      getUserLog(data?.id).then((res) => setUserLogData(res));
    }
  }, [data?.id]);

  const handleEditorName = (user_log) => {
    if (user_log?.operator_name) {
      return (
        <div className="flex flex-col">
          <span>{t("operator.name")}</span>
          <span>{user_log?.operator_name}</span>
        </div>
      );
    } else if (user_log?.vendor_name) {
      return (
        <div className="flex flex-col">
          <span>{t("name.branch")}</span>
          <span>{user_log?.vendor_name}</span>
        </div>
      );
    } else if (user_log?.courier_name) {
      return (
        <div className="flex flex-col">
          <span>{t("courier.name")}</span>
          <span>{user_log?.courier_name}</span>
        </div>
      );
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", detecKeyDown, true);
  }, []);

  const detecKeyDown = (e) => {
    if (e.key === "Z") {
      setShowIntegration(true);
    } else if (e.key === "X") {
      setShowIntegration(false);
    }
  };

  return (
    <div
      className={`flex ${isModal ? "" : "p-4"}`}
      style={{
        overflowY: isModal ? "auto" : "",
      }}
    >
      <Card>
        <CourierTrackStepper data={data} />
      </Card>
      <div className="w-full ml-4">
        <Card title={t("map")} className="mb-4" bodyStyle={{ height: 500 }}>
          <YandexMap
            state={{
              center: [data?.to_location?.lat, data?.to_location?.long],
              zoom: 13,
            }}
          >
            {data?.steps[0]?.branch_name && (
              <Placemark
                properties={{
                  iconContent: `${data?.steps[0]?.branch_name}`,
                }}
                options={{
                  preset: "islands#greenStretchyIcon",
                }}
                geometry={[
                  data?.steps[0]?.location?.lat,
                  data?.steps[0]?.location?.long,
                ]}
              />
            )}
            {data?.courier && (
              <Placemark
                properties={{
                  iconContent: `${data?.courier?.first_name} ${data?.courier?.last_name}`,
                }}
                options={{
                  preset: "islands#blueStretchyIcon",
                }}
                geometry={[
                  data?.courier?.location?.lat,
                  data?.courier?.location?.long,
                ]}
              />
            )}
            {data?.to_location && (
              <Placemark
                properties={{
                  iconContent: `${data?.to_address}`,
                }}
                options={{
                  preset: "islands#redStretchyIcon",
                }}
                geometry={
                  data?.to_location
                    ? [data?.to_location?.lat, data?.to_location?.long]
                    : []
                }
              />
            )}
          </YandexMap>
        </Card>
        <Card title="Информация о клиенте" className="mb-4">
          <div className="infoClient">
            {/* <p>Информация о клиенте</p> */}
            <TableContainer component={Paper}>
              <Table aria-label="customized table">
                <TableBody>
                  <TableRow>
                    <TableCell>Имя клиента</TableCell>
                    <TableCell>{data?.client_name || "-"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <StyledTableCell>Телефон клиента</StyledTableCell>
                    <TableCell>{data?.client_phone_number || "-"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <StyledTableCell>Дополнительный номер</StyledTableCell>
                    <TableCell>{data?.extra_phone_number || "-"}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Card>

        <Card title="Адрес" className="mb-4">
          <div className="address">
            {/* <p>Адрес</p> */}
            <TableContainer component={Paper}>
              <Table aria-label="customized table">
                <TableBody>
                  <TableRow>
                    <TableCell>Адрес</TableCell>
                    <TableCell>{data?.to_address || "-"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Расстояние</TableCell>
                    <TableCell>{Distance(data?.distance) || "-"}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Дом</TableCell>
                    <TableCell>{data?.accommodation || 0}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Этаж</TableCell>
                    <TableCell>{data?.floor || 0}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Квартира</TableCell>
                    <TableCell size="small">{data?.apartment || 0}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Подъезд</TableCell>
                    <TableCell size="small">{data?.building || 0}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Card>
        <Card title="Информация о заказе" className="mb-4">
          <div className="infoapplication">
            {/* <p>Информация о заказы</p> */}
            <TableContainer component={Paper}>
              <Table aria-label="order info">
                <TableBody>
                  <TableRow>
                    <TableCell>Оператор</TableCell>
                    <TableCell>{data?.shipper_user?.name || "-"}</TableCell>
                    <TableCell>Телефон oператора</TableCell>
                    <TableCell size="small">
                      {data?.shipper_user?.phone || "-"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Курьер</TableCell>
                    <TableCell>{data?.courier?.first_name || "-"}</TableCell>
                    <TableCell>Телефона курьера</TableCell>
                    <TableCell size="small">
                      {data?.courier?.phone || "-"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Название</TableCell>
                    <TableCell>{data?.steps[0]?.branch_name || "-"}</TableCell>
                    <TableCell>Статус</TableCell>
                    <TableCell size="small">
                      {/* <StatusMaker status={data?.status_id || "-"} /> */}
                      {statusTag(data?.status_id, t)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Описание</TableCell>
                    <TableCell colSpan={5}>
                      {data?.description || "-"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Card>
        <Card title="Информация о продуктe и Цена" className="mb-4">
          <div className="infoProduct">
            <TableContainer sx={{ mb: 2 }} component={Paper}>
              <Table
                style={{
                  border: "1px solid #e5e9eb !important",
                  borderRadius: "6px !important",
                }}
                className="rounded-md"
                aria-label="caption table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: "136px" }}>Название</TableCell>
                    <StyledTableCell>Цена</StyledTableCell>
                    <StyledTableCell>Количество</StyledTableCell>
                    <StyledTableCell>Описание</StyledTableCell>
                    <StyledTableCell>Всего</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.steps[0].products?.map((product) => (
                    <TableProduct
                      key={product.id + product.product_id}
                      data={product}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TableContainer sx={{ mb: 2 }} component={Paper}>
              <Table aria-label="caption table">
                <TableHead>
                  <TableRow>
                    <TableCell>Цена доставки</TableCell>
                    <StyledTableCell>Итоговая сумма</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{data?.delivery_price}</TableCell>
                    <TableCell>
                      {data ? data?.order_amount + data?.delivery_price : 0}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <TableContainer component={Paper}>
              <Table aria-label="caption table">
                <TableHead>
                  <TableRow>
                    <TableCell>Отзывы</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{data?.review || "-"}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Card>
        <Card title="Скидка" className="mb-4">
          <div className="infoProduct">
            <TableContainer>
              <Table aria-label="caption table">
                <TableHead>
                  <TableRow>
                    <TableCell>Название</TableCell>
                    <TableCell>Сумма</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.discounts?.map((dis) => (
                    <TableRow key={dis.id}>
                      <TableCell>{dis?.name?.ru}</TableCell>
                      <TableCell>{dis?.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Card>
        <Card title="Статус платежа" className="mb-4">
          <div className="infoProduct">
            {/* <p>Информация о продуктe и Цена</p> */}
            <TableContainer component={Paper}>
              <Table aria-label="caption table">
                {data?.paid ? (
                  <>
                    <TableHead>
                      <TableCell>Время</TableCell>
                      <TableCell>Статус</TableCell>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>{data?.paid_time}</TableCell>
                        <TableCell>Транзакция успешно выполнена</TableCell>
                      </TableRow>
                    </TableBody>
                  </>
                ) : (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center">Не оплачен</TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </div>
        </Card>
        <Card title="История изменений">
          <div className="historyChanged">
            <TableContainer sx={{ mb: 2 }} component={Paper}>
              <Table aria-label="address table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Действия</StyledTableCell>
                    <StyledTableCell align="center">Редактор</StyledTableCell>
                    <StyledTableCell> Описание</StyledTableCell>
                    <StyledTableCell>Время</StyledTableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {userLogData?.user_logs
                    // ?.filter(
                    //   (item) =>
                    //     item.action !== "3aпpoc нa интerpaцию oтпpaвлeн",
                    // )
                    ?.map((user_log) => (
                      <TableRow key={user_log?.id}>
                        <TableCell>{user_log?.action}</TableCell>
                        <TableCell align="center">
                          {handleEditorName(user_log)}
                        </TableCell>
                        <TableCell>{user_log?.description || "-"}</TableCell>
                        <TableCell>
                          {user_log?.time.slice(0, 10)}{" "}
                          {user_log?.time.slice(11, 16)}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            {showIntegration && (
              <TableContainer component={Paper}>
                <Table aria-label="address table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Запрос на интеграцию</StyledTableCell>
                      <StyledTableCell>Интеграционный ответ</StyledTableCell>
                      <StyledTableCell>Время</StyledTableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {userLogData?.user_logs
                      ?.filter(
                        (item) =>
                          item.action === "3aпpoc нa интerpaцию oтпpaвлeн" ||
                          item.action === "Ошибка в интerpaции",
                      )
                      .map((log) => (
                        <TableRow key={log.id + log?.time}>
                          <TableCell>
                            {log?.integration_request || "-"}
                          </TableCell>
                          <TableCell>
                            {log?.integration_response || "-"}
                          </TableCell>
                          <TableCell>
                            {log?.time?.slice(0, 10)} {log?.time?.slice(11, 19)}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

const TableProduct = ({ data }) => {
  return (
    <>
      <TableRow>
        <TableCell>{data?.name}</TableCell>
        <TableCell>{data?.price}</TableCell>
        <TableCell>{data?.quantity}</TableCell>
        <TableCell>{data?.description || "-"}</TableCell>
        <TableCell>{data?.total_amount}</TableCell>
      </TableRow>
      {data?.variants?.length > 0 &&
        data?.variants?.map((item) => (
          <TableRow key={item.variant_id + item.group_id}>
            <TableCell className="pl-3">-- {item?.variant_name?.ru}</TableCell>
            <TableCell>{"-"}</TableCell>
            <TableCell> {item.quantity}</TableCell>
            <TableCell>{"-"}</TableCell>
            <TableCell>{"-"}</TableCell>
          </TableRow>
        ))}
      {data?.order_modifiers?.length > 0 &&
        data?.order_modifiers?.map((item) => (
          <TableRow key={item.modifier_id}>
            <TableCell className="pl-3">-- {item?.modifier_name?.ru}</TableCell>
            <TableCell>{item?.modifier_price}</TableCell>
            <TableCell>{item?.modifier_quantity}</TableCell>
            <TableCell>{"-"}</TableCell>
            <TableCell>{item?.modifier_total_price}</TableCell>
          </TableRow>
        ))}
    </>
  );
};

export default memo(HistoryChanges);
