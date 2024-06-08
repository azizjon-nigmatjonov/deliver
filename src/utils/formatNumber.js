export const formatNumber = (number) => {
  const num = number?.toString();
  const num1 = num?.split(".")[0];
  const num2 = num?.split(".")[1]?.slice(0, 2);
  return (
    <>
      {num2
        ? `${num1?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}.${num2}`
        : 0}
    </>
  );
};
