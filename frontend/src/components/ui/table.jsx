export const Table = ({ className = "", ...props }) => (
  <table className={["w-full caption-bottom text-sm", className].join(" ")} {...props} />
);
export const TableHeader = ({ className = "", ...props }) => (
  <thead className={className} {...props} />
);
export const TableBody = ({ className = "", ...props }) => (
  <tbody className={className} {...props} />
);
export const TableRow = ({ className = "", ...props }) => (
  <tr className={["border-b border-gray-200", className].join(" ")} {...props} />
);
export const TableHead = ({ className = "", ...props }) => (
  <th
    className={["h-10 px-4 text-left align-middle font-medium text-gray-500", className].join(" ")}
    {...props}
  />
);
export const TableCell = ({ className = "", ...props }) => (
  <td className={["p-4 align-middle", className].join(" ")} {...props} />
);
