import { createContext, useContext } from "react";

const RadioContext = createContext(null);

export const RadioGroup = ({ value, onValueChange, className = "", ...props }) => (
  <RadioContext.Provider value={{ value, onValueChange }}>
    <div className={className} {...props} />
  </RadioContext.Provider>
);

export const RadioGroupItem = ({ value, className = "", ...props }) => {
  const ctx = useContext(RadioContext);
  return (
    <input
      type="radio"
      checked={ctx.value === value}
      onChange={() => ctx.onValueChange(value)}
      className={["h-4 w-4 accent-orange-500", className].join(" ")}
      {...props}
    />
  );
};
