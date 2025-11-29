import React from "react";

export default function Label({ className, ...props }) {
  const base = "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70";
  return <label className={(className ? base + " " + className : base)} {...props} />;
}
