import Tag from "./index"
import DateRangeIcon from "@mui/icons-material/DateRange"

export default function DateTag ({ children }) {
  return (
    <Tag
      color="gray"
      shape="subtle"
      icon={DateRangeIcon}
      className="text-xs py-1.5 px-3"
    >
      {children}
    </Tag>
)
}