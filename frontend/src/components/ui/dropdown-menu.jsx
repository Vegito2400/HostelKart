import { createContext, useContext, useState } from "react";

const DropdownContext = createContext(null);

export const DropdownMenu = ({ children }) => {
  const [open, setOpen] = useState(false);
  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </DropdownContext.Provider>
  );
};

export const DropdownMenuTrigger = ({ asChild = false, children }) => {
  const { setOpen } = useContext(DropdownContext);
  if (asChild && children?.type) {
    const Comp = children.type;
    return (
      <Comp
        {...children.props}
        onClick={(e) => {
          children.props.onClick?.(e);
          setOpen((v) => !v);
        }}
      />
    );
  }
  return <button type="button" onClick={() => setOpen((v) => !v)}>{children}</button>;
};

export const DropdownMenuContent = ({ className = "", align = "start", ...props }) => {
  const { open } = useContext(DropdownContext);
  if (!open) return null;
  return (
    <div
      className={[
        "absolute z-50 mt-2 rounded-md border border-gray-200 bg-white p-1 text-sm shadow-lg",
        align === "end" ? "right-0" : "left-0",
        className,
      ].join(" ")}
      {...props}
    />
  );
};

export const DropdownMenuItem = ({ className = "", ...props }) => (
  <button
    type="button"
    className={[
      "flex w-full items-center rounded-sm px-2 py-1.5 text-left text-gray-700 hover:bg-gray-100",
      className,
    ].join(" ")}
    {...props}
  />
);
export const DropdownMenuLabel = ({ className = "", ...props }) => (
  <div className={["px-2 py-1.5", className].join(" ")} {...props} />
);
export const DropdownMenuSeparator = ({ className = "" }) => (
  <div className={["my-1 h-px bg-gray-200", className].join(" ")} />
);
