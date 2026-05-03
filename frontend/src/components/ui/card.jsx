export const Card = ({ className = "", ...props }) => (
  <div className={["rounded-lg border bg-white text-gray-900 shadow-sm", className].join(" ")} {...props} />
);
