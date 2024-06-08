import Skeleton from "@mui/material/Skeleton";

function LoaderComponent({ isLoader = true, height = 62, rows = 8 }) {
  if (!isLoader) return null;
  const skeletonArray = Array(rows).fill("");

  return (
    <div className="w-full">
      {isLoader &&
        skeletonArray.map((_, index) => (
          <Skeleton height={height} key={index} />
        ))}
    </div>
  );
}

export default LoaderComponent;
