import { CircularProgress } from "@mui/material"
import "./style.scss"

const AbsoluteTableLoader = ({isVisible = true}) => {

  if(!isVisible) return null

  return (
    <div className="AbsoluteTableLoader" >
      <CircularProgress  />
    </div>
  )
}

export default AbsoluteTableLoader
