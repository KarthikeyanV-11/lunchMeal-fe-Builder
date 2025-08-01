import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Switch = forwardRef(({ className, ...props }, ref) => (
  <button
    type="button"
    role="switch"
    aria-checked={props.checked || props.defaultChecked}
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className,
    )}
    ref={ref}
    {...props}
  >
    <span
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
        props.checked || props.defaultChecked
          ? "translate-x-5"
          : "translate-x-0",
      )}
    />
  </button>
));
Switch.displayName = "Switch";

export { Switch };
