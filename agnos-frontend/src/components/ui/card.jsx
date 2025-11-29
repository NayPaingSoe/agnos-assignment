export default function Card({ className, children }) {
  const base = "rounded-2xl bg-card text-card-foreground shadow-xl border border-border";
  return <div className={(className ? base + " " + className : base)}>{children}</div>;
}

export function CardHeader({ className, children }) {
  const base = "px-8 pt-8";
  return <div className={(className ? base + " " + className : base)}>{children}</div>;
}

export function CardContent({ className, children }) {
  const base = "px-8 pb-8";
  return <div className={(className ? base + " " + className : base)}>{children}</div>;
}
