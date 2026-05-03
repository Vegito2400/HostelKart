import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./dialog";

export { Dialog as Sheet, DialogTrigger as SheetTrigger, DialogHeader as SheetHeader, DialogTitle as SheetTitle, DialogDescription as SheetDescription };

export const SheetContent = ({ className = "", side = "right", children, ...props }) => {
  const sideClass = side === "right" ? "right-0 top-0 h-full" : "left-0 top-0 h-full";
  return (
    <DialogContent
      className={[
        "fixed max-w-md translate-x-0 translate-y-0 rounded-none p-0",
        sideClass,
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </DialogContent>
  );
};
