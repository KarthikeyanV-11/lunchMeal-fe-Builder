import { createContext, useContext } from "react";

const TooltipContext = createContext({});

export const TooltipProvider = ({ children, ...props }) => {
  return (
    <TooltipContext.Provider value={{}}>{children}</TooltipContext.Provider>
  );
};

export const Tooltip = ({ children }) => {
  return <>{children}</>;
};

export const TooltipTrigger = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};

export const TooltipContent = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-md ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
