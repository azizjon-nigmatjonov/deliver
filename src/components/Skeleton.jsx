import Skeleton from "@mui/material/Skeleton";

export default function CustomSkeleton() {
  return (
    <div>
      <Skeleton variant="rect" width="100%" height={64} animation="wave" />
      <div className="p-4 w-full grid grid-cols-2 gap-4 box-border">
        <div className="col-span-2 fade" style={{ animationDelay: "100ms" }}>
          <Skeleton
            variant="rect"
            width="100%"
            height={300}
            animation="wave"
            style={{ borderRadius: 6 }}
          />
        </div>
        <div className="fade" style={{ animationDelay: "200ms" }}>
          <Skeleton
            variant="rect"
            width="100%"
            height={200}
            animation="wave"
            style={{ borderRadius: 6 }}
          />
        </div>
        <div className="fade" style={{ animationDelay: "300ms" }}>
          <Skeleton
            variant="rect"
            width="100%"
            height={200}
            animation="wave"
            style={{ borderRadius: 6 }}
          />
        </div>
      </div>
    </div>
  );
}
