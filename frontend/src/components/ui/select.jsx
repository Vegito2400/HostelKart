import { createContext, useContext, useState } from "react";

const SelectContext = createContext(null);

export const Select = ({ value, onValueChange, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
};

export const SelectTrigger = ({ className = "", children, ...props }) => {
  const { open, setOpen } = useContext(SelectContext);
  return (
    <button
      type="button"
      aria-expanded={open}
      className={[
        "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-ring",
        className,
      ].join(" ")}
      onClick={() => setOpen((v) => !v)}
      {...props}
    >
      {children}
      <span className="text-gray-400">v</span>
    </button>
  );
};

export const SelectValue = () => {
  const { value } = useContext(SelectContext);
  return <span>{value}</span>;
};

export const SelectContent = ({ className = "", ...props }) => {
  const { open } = useContext(SelectContext);
  if (!open) return null;
  return (
    <div
      className={[
        "absolute z-40 mt-1 max-h-64 w-full overflow-auto rounded-md border border-gray-200 bg-white p-1 shadow-lg",
        className,
      ].join(" ")}
      {...props}
    />
  );
};

export const SelectItem = ({ value, className = "", children, ...props }) => {
  const { onValueChange, setOpen } = useContext(SelectContext);
  return (
    <button
      type="button"
      className={["w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-gray-100", className].join(" ")}
      onClick={() => {
        onValueChange(value);
        setOpen(false);
      }}
      {...props}
    >
      {children}
    </button>
  );
};
