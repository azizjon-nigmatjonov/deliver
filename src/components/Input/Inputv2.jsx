import { OutlinedInput } from "@mui/material";

export default function InputV2({ ...props }) {
  return (
    <OutlinedInput
      id="outlined-search"
      sx={{
        input: { padding: 0, height: "32px" },
        borderRadius: "0.375rem",
        paddingLeft: "8px",
      }}
      {...props}
    />
  );
}
