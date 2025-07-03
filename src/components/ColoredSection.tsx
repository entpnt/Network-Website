import React from "react";

interface ColoredSectionProps {
  title?: string;
  content?: string;
  children?: React.ReactNode;
}

export default function ColoredSection({
  title = "Colored Section",
  content = "This is a section with a custom background color.",
  children,
}: ColoredSectionProps) {
  return (
    <section className="py-16 px-4" style={{ backgroundColor: "#ffebde" }}>
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">{title}</h2>
        <p className="text-lg text-gray-600 mb-8">{content}</p>
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
