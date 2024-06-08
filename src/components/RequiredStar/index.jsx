const RequiredStar = ({ isVisible = true }) =>
  isVisible ? (
    <span style={{ color: "#ff0000", fontSize: "19px" }}>*</span>
  ) : null;

export default RequiredStar;
