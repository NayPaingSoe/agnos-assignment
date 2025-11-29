import React from "react";

const Input = React.forwardRef(function Input(
  { className, type = "text", error, ...props },
  ref
) {
  const base =
    "flex h-10 w-full rounded-md border bg-transparent px-3 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2";
  const errorBase = "border-red-500 focus:ring-red-300";
  const normalBase = "border-teal-600 focus:ring-[#20746c4f]";

  return (
    <div className="space-y-1">
      <input
        ref={ref}
        type={type}
        className={
          className
            ? `${base} ${error ? errorBase : normalBase} ${className}`
            : `${base} ${error ? errorBase : normalBase}`
        }
        {...props}
      />
      {error && <p className="text-red-600 text-xs">{error}</p>}
    </div>
  );
});

export default Input;
