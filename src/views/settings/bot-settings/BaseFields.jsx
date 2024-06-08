import React, { memo } from "react";

function BaseFields({ formik, lang }) {
  return (
    <div className="mt-4">
      {React.cloneElement(lang, {
        formik: formik,
      })}
    </div>
  );
}

export default memo(BaseFields);
