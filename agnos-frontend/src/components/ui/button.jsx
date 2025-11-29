import React from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Button({ className, variant = "default", size = "md", ...props }) {
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input bg-transparent hover:bg-muted",
    ghost: "hover:bg-muted",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "bg-destructive text-white hover:bg-destructive/80",
  };

  const sizes = {
    sm: "h-8 px-3 text-sm",
    md: "h-9 px-4",
    lg: "h-10 px-6 text-sm",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md transition-colors disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
