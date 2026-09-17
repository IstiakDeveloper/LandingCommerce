"use client";

export function ThumbBar({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={style}
      className={`fixed bottom-0 left-0 z-40 w-full thumb-bar md:static md:mt-6 md:w-auto md:max-w-none md:translate-x-0 ${className}`}
    >
      {children}
    </div>
  );
}
