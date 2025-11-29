export default function Badge({ className, variant = "default", children }) {
  const variants = {
    default: "bg-muted text-muted-foreground",
    active: "bg-teal-600 text-white",
    success: "bg-green-600 text-white",
    warning: "bg-yellow-400 text-black",
    secondary: "bg-secondary text-secondary-foreground",
  };
  const base =
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium";
  const v = variants[variant] || variants.default;
  return (
    <span
      className={className ? base + " " + v + " " + className : base + " " + v}
    >
      {children}
    </span>
  );
}
