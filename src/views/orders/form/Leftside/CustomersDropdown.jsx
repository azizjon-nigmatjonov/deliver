import Card from "components/Card";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const CustomersDropdown = ({
  clientAddressess,
  setFieldValue,
  setClientFocus,
  handleUserLogs,
}) => {
  return (
    <Card
      style={{
        backgroundColor: "#fff",
        position: "absolute",
        zIndex: 99,
        filter: "drop-shadow(0px 16px 40px rgba(0, 0, 0, 0.1))",
      }}
      headerStyle={{ padding: "10px 12px" }}
      bodyStyle={{
        padding: 0,
        overflowY: "auto",
        maxHeight: 336 - 56 * 2,
      }}
    >
      {clientAddressess?.map((client, index) => (
        <div
          className={`px-4 py-3 text-sm flex items-start cursor-pointer hover:bg-gray-50 ${
            index + 1 === clientAddressess.length ? "" : "border-b"
          } `}
          onClick={() => {
            setFieldValue("client_name", client.name);
            setFieldValue("client_id", client.id);
            setFieldValue("client_phone_number", client.phone);
            handleUserLogs({ name: "Клиент" });
            setClientFocus(false);
          }}
          key={client.id}
        >
          <div className="mr-2 pt-0.5">
            <AccountCircleIcon />
          </div>
          <div>
            <div className="text-sm mb-1 font-medium">{client?.name}</div>
            <span className="text-xs">{client?.phone}</span>
          </div>
        </div>
      ))}
    </Card>
  );
};

export default CustomersDropdown;
