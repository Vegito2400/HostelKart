import { forwardRef } from "react";

export const Textarea = forwardRef(({ className = "", ...props }, ref) => (
  <textarea
    ref={ref}
    className={[
      "flex min-h-20 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
      className,
    ].join(" ")}
    {...props}
  />
));

Textarea.displayName = "Textarea";
