import { createContext, useContext, useState } from "react";

const TabsContext = createContext(null);

export const Tabs = ({ defaultValue, className = "", ...props }) => {
  const [value, setValue] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={className} {...props} />
    </TabsContext.Provider>
  );
};
export const TabsList = ({ className = "", ...props }) => (
  <div className={["inline-flex rounded-md p-1", className].join(" ")} {...props} />
);
export const TabsTrigger = ({ value, className = "", ...props }) => {
  const ctx = useContext(TabsContext);
  return (
    <button
      type="button"
      className={[
        "rounded px-3 py-1.5 text-sm font-medium",
        ctx.value === value ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900",
        className,
      ].join(" ")}
      onClick={() => ctx.setValue(value)}
      {...props}
    />
  );
};
export const TabsContent = ({ value, className = "", ...props }) => {
  const ctx = useContext(TabsContext);
  if (ctx.value !== value) return null;
  return <div className={className} {...props} />;
};
