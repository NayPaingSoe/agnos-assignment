import React from "react";

const Select = React.forwardRef(function Select(
  { className, children, error, ...props },
  ref
) {
  const base =
    "flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2";
  const errorBase = "border-red-500 focus:ring-red-300";
  const normalBase = "border-teal-600 focus:ring-[#20746c4f]";

  return (
    <div className="space-y-1">
      <select
        ref={ref}
        className={
          className
            ? `${base} ${error ? errorBase : normalBase} ${className}`
            : `${base} ${error ? errorBase : normalBase}`
        }
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-red-600 text-xs">{error}</p>}
    </div>
  );
});

export default Select;
