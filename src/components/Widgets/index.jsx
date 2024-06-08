import "./style.scss";
import Widget from "./Widget";

const Widgets = ({ data, removeMargin }) => {
  return (
    <div
      className={`flex flex-wrap gap-4 Widgets ${!removeMargin ? "mb-5" : ""}`}
    >
      {data?.map((widget, index) => (
        <Widget
          key={widget.id || index}
          page={widget.pathname}
          Icon={widget.icon}
          title={widget.title}
          number={widget.number}
        />
      ))}
    </div>
  );
};

export default Widgets;
