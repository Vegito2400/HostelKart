export const Avatar = ({ className = "", ...props }) => (
  <div className={["relative flex shrink-0 overflow-hidden rounded-full", className].join(" ")} {...props} />
);

export const AvatarFallback = ({ className = "", ...props }) => (
  <div
    className={[
      "flex h-full w-full items-center justify-center rounded-full bg-gray-100",
      className,
    ].join(" ")}
    {...props}
  />
);
