export const Badge = ({ className = "", variant = "default", ...props }) => {
  const base =
    variant === "secondary"
      ? "bg-gray-100 text-gray-700"
      : "bg-gray-900 text-white";
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold transition-colors",
        base,
        className,
      ].join(" ")}
      {...props}
    />
  );
};
