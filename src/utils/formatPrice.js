export const formatPrice = (x) => {
  return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};
