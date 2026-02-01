import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { X, AlertTriangle, CheckCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/* ROOT */
/* ------------------------------------------------------------------ */

const AlertDialog = AlertDialogPrimitive.Root;
const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
const AlertDialogPortal = AlertDialogPrimitive.Portal;

/* ------------------------------------------------------------------ */
/* OVERLAY */
/* ------------------------------------------------------------------ */

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=open]:fade-in-0",
      "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
      className
    )}
    {...props}
  />
));
AlertDialogOverlay.displayName = "AlertDialogOverlay";

/* ------------------------------------------------------------------ */
/* CONTENT */
/* ------------------------------------------------------------------ */

interface AlertDialogContentProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content> {
  showClose?: boolean;
  variant?: "default" | "danger" | "success";
}

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  AlertDialogContentProps
>(({ className, children, showClose = false, variant = "default", ...props }, ref) => {
  const iconMap = {
    default: null,
    danger: <AlertTriangle className="h-6 w-6 text-destructive" />,
    success: <CheckCircle className="h-6 w-6 text-green-600" />,
  };

  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-full max-w-lg",
          "-translate-x-1/2 -translate-y-1/2",
          "rounded-xl border bg-background p-6 shadow-xl",
          "focus:outline-none",
          "data-[state=open]:animate-in data-[state=open]:zoom-in-95 data-[state=open]:fade-in-0",
          "data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=closed]:fade-out-0",
          className
        )}
        {...props}
      >
        {/* CLOSE BUTTON */}
        {showClose && (
          <AlertDialogPrimitive.Cancel className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground hover:text-foreground focus:outline-none">
            <X className="h-4 w-4" />
          </AlertDialogPrimitive.Cancel>
        )}

        {/* ICON */}
        {iconMap[variant] && (
          <div className="mb-3 flex justify-center">{iconMap[variant]}</div>
        )}

        {children}
      </AlertDialogPrimitive.Content>
    </AlertDialogPortal>
  );
});
AlertDialogContent.displayName = "AlertDialogContent";

/* ------------------------------------------------------------------ */
/* HEADER */
/* ------------------------------------------------------------------ */

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col gap-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
AlertDialogHeader.displayName = "AlertDialogHeader";

/* ------------------------------------------------------------------ */
/* FOOTER */
/* ------------------------------------------------------------------ */

const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
      className
    )}
    {...props}
  />
);
AlertDialogFooter.displayName = "AlertDialogFooter";

/* ------------------------------------------------------------------ */
/* TITLE */
/* ------------------------------------------------------------------ */

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
));
AlertDialogTitle.displayName = "AlertDialogTitle";

/* ------------------------------------------------------------------ */
/* DESCRIPTION */
/* ------------------------------------------------------------------ */

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground leading-relaxed", className)}
    {...props}
  />
));
AlertDialogDescription.displayName = "AlertDialogDescription";

/* ------------------------------------------------------------------ */
/* ACTION */
/* ------------------------------------------------------------------ */

interface AlertDialogActionProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action> {
  loading?: boolean;
}

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  AlertDialogActionProps
>(({ className, loading, children, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants(), "relative", className)}
    disabled={loading}
    {...props}
  >
    {loading ? "Please wait..." : children}
  </AlertDialogPrimitive.Action>
));
AlertDialogAction.displayName = "AlertDialogAction";

/* ------------------------------------------------------------------ */
/* CANCEL */
/* ------------------------------------------------------------------ */

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className
    )}
    {...props}
  />
));
AlertDialogCancel.displayName = "AlertDialogCancel";

/* ------------------------------------------------------------------ */

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
