"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Custom tabs components with enhanced dark mode support
const Tabs = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
  }
>(({ className, defaultValue, value, onValueChange, ...props }, ref) => {
  const [selectedValue, setSelectedValue] = React.useState(value || defaultValue);

  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  const handleValueChange = React.useCallback(
    (newValue: string) => {
      setSelectedValue(newValue);
      onValueChange?.(newValue);
    },
    [onValueChange]
  );

  return (
    <div
      ref={ref}
      className={cn("space-y-2", className)}
      {...props}
      data-selected-value={selectedValue}
    />
  );
});
Tabs.displayName = "Tabs";

const TabsList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      // Add this class for better dark mode styling 
      "relative dark:bg-gray-800/50 dark:backdrop-blur-sm",
      className
    )}
    {...props}
  />
));
TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    value: string;
  }
>(({ className, value, ...props }, ref) => {
  const tabsContext = React.useContext(
    React.createContext<{ selectedValue?: string; onValueChange?: (value: string) => void }>({})
  );

  const isActive = tabsContext.selectedValue === value;

  return (
    <button
      ref={ref}
      role="tab"
      aria-selected={isActive}
      data-state={isActive ? "active" : "inactive"}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        // Enhanced styling for both light and dark modes
        "relative overflow-hidden",
        isActive ?
          "bg-background text-foreground dark:bg-gray-900 dark:text-primary-foreground dark:shadow-[0_0_0_1px_rgba(var(--primary),0.3)]" :
          "hover:bg-muted/80 hover:text-foreground dark:hover:bg-gray-800/80",
        className
      )}
      onClick={() => {
        if (tabsContext.onValueChange) {
          tabsContext.onValueChange(value);
        }
      }}
      {...props}
    >
      {props.children}
      {/* Active indicator bar */}
      {isActive && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-primary rounded-full dark:bg-primary dark:shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
      )}
    </button>
  );
});
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value: string;
  }
>(({ className, value, ...props }, ref) => {
  const tabsContext = React.useContext(
    React.createContext<{ selectedValue?: string }>({})
  );

  const isSelected = tabsContext.selectedValue === value;

  if (!isSelected) return null;

  return (
    <div
      ref={ref}
      role="tabpanel"
      data-state={isSelected ? "active" : "inactive"}
      className={cn(
        "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "animate-in fade-in-0 zoom-in-95 duration-200",
        className
      )}
      {...props}
    />
  );
});
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };