import React from "react";
import { TextareaAutosize } from "@mui/material";

const CaseHandlerComponent = ({ msg, setMsg }) => {
  return (
    <div className="mb-3">
      {
        <TextareaAutosize
          className="w-full rounded-md border border-lightgray-1 mt-1 p-2"
          multiline
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          maxRows={4}
          autoFocus
          placeholder="Причина...."
        />
      }
    </div>
  );
};

export default CaseHandlerComponent;
