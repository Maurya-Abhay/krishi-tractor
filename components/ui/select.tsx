"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-input bg-card px-3.5",
      "text-base sm:text-sm text-left shadow-elev-1 transition-ui",
      "data-[placeholder]:text-muted-foreground/70",
      "hover:border-border-strong",
      "focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-ring/25",
      "disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60",
      "[&>span]:min-w-0 [&>span]:truncate",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 [[data-state=open]_&]:rotate-180" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollButton = ({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>) => (
  <div className="flex cursor-default items-center justify-center py-1 text-muted-foreground" {...props}>
    {children}
  </div>
);

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      position={position}
      className={cn(
        "relative z-50 max-h-[min(24rem,var(--radix-select-content-available-height))] min-w-[8rem] overflow-hidden",
        "rounded-lg border border-border bg-popover text-popover-foreground shadow-elev-3",
        "data-[state=open]:animate-slide-down data-[state=closed]:animate-zoom-out",
        position === "popper" &&
          "w-full min-w-[var(--radix-select-trigger-width)] data-[side=bottom]:translate-y-1.5 data-[side=top]:-translate-y-1.5",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ScrollUpButton asChild>
        <SelectScrollButton>
          <ChevronUp className="h-4 w-4" />
        </SelectScrollButton>
      </SelectPrimitive.ScrollUpButton>
      <SelectPrimitive.Viewport className="p-1.5">{children}</SelectPrimitive.Viewport>
      <SelectPrimitive.ScrollDownButton asChild>
        <SelectScrollButton>
          <ChevronDown className="h-4 w-4" />
        </SelectScrollButton>
      </SelectPrimitive.ScrollDownButton>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground",
      className
    )}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      // min-h-10 keeps options tappable on a phone
      "relative flex min-h-10 w-full cursor-pointer select-none items-center rounded-md py-2 pl-8 pr-2.5",
      "text-sm outline-none transition-fast",
      "focus:bg-primary-soft focus:text-primary-soft-foreground",
      "data-[state=checked]:font-semibold",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2.5 flex h-4 w-4 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4 text-primary" strokeWidth={3} />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem };
