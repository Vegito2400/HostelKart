import { createContext, useContext, useState } from "react";

const DialogContext = createContext(null);

export const Dialog = ({ open, onOpenChange, children }) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;

  const setOpen = (nextOpen) => {
    if (!isControlled) setInternalOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  return (
    <DialogContext.Provider value={{ open: isControlled ? open : internalOpen, onOpenChange: setOpen }}>
      {children}
    </DialogContext.Provider>
  );
};

export const DialogTrigger = ({ asChild = false, children }) => {
  const { onOpenChange } = useContext(DialogContext);
  if (asChild && children?.type) {
    const Comp = children.type;
    return (
      <Comp {...children.props} onClick={(e) => {
        children.props.onClick?.(e);
        onOpenChange?.(true);
      }} />
    );
  }
  return <button type="button" onClick={() => onOpenChange?.(true)}>{children}</button>;
};

export const DialogContent = ({ className = "", children, ...props }) => {
  const { open, onOpenChange } = useContext(DialogContext);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        className={[
          "relative w-full max-w-lg rounded-lg border border-gray-200 bg-white p-6 shadow-lg",
          className,
        ].join(" ")}
        {...props}
      >
        <button
          type="button"
          aria-label="Close"
          className="absolute right-3 top-3 rounded-md px-2 text-xl leading-none text-gray-400 hover:text-gray-700"
          onClick={() => onOpenChange(false)}
        >
          x
        </button>
        {children}
      </div>
    </div>
  );
};

export const DialogHeader = ({ className = "", ...props }) => (
  <div className={["mb-4 space-y-1.5", className].join(" ")} {...props} />
);
export const DialogFooter = ({ className = "", ...props }) => (
  <div className={["mt-5 flex justify-end gap-2", className].join(" ")} {...props} />
);
export const DialogTitle = ({ className = "", ...props }) => (
  <h2 className={["text-lg font-semibold text-gray-900", className].join(" ")} {...props} />
);
export const DialogDescription = ({ className = "", ...props }) => (
  <p className={["text-sm text-gray-500", className].join(" ")} {...props} />
);
