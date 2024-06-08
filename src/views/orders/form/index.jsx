import { OrderFormProvider } from "context/OrderFormContext";
import Wrapper from "./wrapper";

export default function CreateOrder() {
  return (
    <OrderFormProvider>
      <Wrapper />
    </OrderFormProvider>
  );
}
