import styles from "./styles.module.scss";

export default function CardContent({
  title,
  children,
  extra,
  className = "",
  style,
  headerStyle,
  filterStyle = "",
  headerClass = "",
  bodyStyle,
  bodyClass,
  filters,
  boldTitle,
  footer,
  footerStyle,
  ...args
}) {
  return (
    <div className={`${className} rounded-lg bg-white`} style={style} {...args}>
      {(title || extra) && (
        <div
          style={headerStyle}
          className={`px-3 py-2 border-b flex justify-between items-center rounded-t-lg ${headerClass}`}
        >
          {typeof title === "string" ? (
            <p className={`${styles.title} ${boldTitle ? "text-2xl" : ""}`}>
              {title}
            </p>
          ) : (
            title
          )}
          <div>{extra}</div>
        </div>
      )}
      {filters && (
        <div
          style={{ ...headerStyle, ...filterStyle }}
          className={`px-4 border-b flex justify-between items-center flex-wrap rounded-t-lg ${headerClass}`}
        >
          {filters}
        </div>
      )}
      <div className={`p-4 ${bodyClass ? bodyClass : ""}`} style={bodyStyle}>
        {children}
      </div>
      {footer && (
        <div className="px-4 py-3 border-t" style={footerStyle}>
          {footer}
        </div>
      )}
    </div>
  );
}
