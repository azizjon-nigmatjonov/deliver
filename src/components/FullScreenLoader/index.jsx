import { CircularProgress } from "@mui/material"
import "./style.scss"

const FullScreenLoader = () => {
  return (
    <div className="FullScreenLoader bg-background">
      <CircularProgress />
    </div>
  )
}

export default FullScreenLoader
