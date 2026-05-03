import { forwardRef } from "react";

const variants = {
  default: "bg-gray-900 text-white hover:bg-gray-800",
  outline: "border border-gray-300 bg-white text-gray-800 hover:bg-gray-50",
  ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
};

const sizes = {
  default: "h-10 px-4 py-2",
  sm: "h-8 px-3 text-xs",
};

export const Button = forwardRef(
  ({ className = "", variant = "default", size = "default", asChild = false, children, ...props }, ref) => {
    const Comp = asChild && children?.type ? children.type : "button";
    const childProps = asChild && children?.props ? children.props : {};

    return (
      <Comp
        ref={ref}
        type={Comp === "button" ? props.type || "button" : undefined}
        {...childProps}
        {...props}
        className={[
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          variants[variant] || variants.default,
          sizes[size] || sizes.default,
          childProps.className || "",
          className,
        ].join(" ")}
      >
        {asChild ? childProps.children : children}
      </Comp>
    );
  },
);

Button.displayName = "Button";
