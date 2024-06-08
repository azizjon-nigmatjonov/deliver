const TabLabel = ({ isActive = false, count, children }) => {
  return (
    <div className="flex items-center">
      <span className={`px-1 ${isActive ? "text-blue-600" : "text-secondary"}`}>
        {children}
      </span>
      {count > 0 && (
        <span
          className={`inline-flex items-center 
              justify-center px-1.5 py-1 ml-2 text-xs 
              font-bold leading-none text-white
              ${isActive ? "bg-blue-600" : "bg-secondary"} rounded-full`}
        >
          {count}
        </span>
      )}
    </div>
  );
};

export default TabLabel;
