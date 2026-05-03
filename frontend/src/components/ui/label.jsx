export const Label = ({ className = "", ...props }) => (
  <label className={["text-sm font-medium text-gray-800", className].join(" ")} {...props} />
);
