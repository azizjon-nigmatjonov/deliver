export default function InputWithAdornment({
  prefix,
  suffix,
  mask,
  className = "",
  style = {
    container: {},
    input: {},
  },
  onKeyDown,
  ...rest
}) {
  return (
    <div className={`flex items-center ${className}`} style={style.container}>
      {!!prefix && prefix}
      <input
        style={style.input}
        className="border:none focus:outline-none outline-none h-full"
        onKeyDown={(e) => {
          onKeyDown && onKeyDown(e);
          // disabling up and down arrow keys
          if (e.keyCode === 38 || e.keyCode === 40) {
            e.preventDefault();
          }
        }}
        {...rest}
      />
      {!!suffix && suffix}
    </div>
  );
}
