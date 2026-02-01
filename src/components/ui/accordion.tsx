import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* ROOT */
/* ------------------------------------------------------------------ */

const Accordion = AccordionPrimitive.Root;

/* ------------------------------------------------------------------ */
/* ITEM */
/* ------------------------------------------------------------------ */

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      "border-b last:border-b-0 focus-within:relative focus-within:z-10",
      className
    )}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

/* ------------------------------------------------------------------ */
/* TRIGGER */
/* ------------------------------------------------------------------ */

interface AccordionTriggerProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> {
  icon?: React.ReactNode;
  subtitle?: string;
  badge?: React.ReactNode;
}

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(({ className, children, icon, subtitle, badge, disabled, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      disabled={disabled}
      className={cn(
        "group flex flex-1 items-center justify-between gap-3 py-4 text-left",
        "font-medium transition-all",
        "hover:text-primary",
        "data-[state=open]:text-primary",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      <div className="flex items-start gap-3">
        {/* LEFT ICON */}
        {icon && (
          <span className="mt-0.5 text-muted-foreground group-hover:text-primary transition-colors">
            {icon}
          </span>
        )}

        {/* TITLE + SUBTITLE */}
        <div className="flex flex-col">
          <span>{children}</span>
          {subtitle && (
            <span className="text-xs text-muted-foreground">
              {subtitle}
            </span>
          )}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-2">
        {badge}
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 data-[state=open]:rotate-180" />
      </div>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = "AccordionTrigger";

/* ------------------------------------------------------------------ */
/* CONTENT */
/* ------------------------------------------------------------------ */

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      "overflow-hidden text-sm",
      "data-[state=open]:animate-accordion-down",
      "data-[state=closed]:animate-accordion-up"
    )}
    {...props}
  >
    <div
      className={cn(
        "pb-4 pt-2 text-muted-foreground leading-relaxed",
        className
      )}
    >
      {children}
    </div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = "AccordionContent";

/* ------------------------------------------------------------------ */

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
};
