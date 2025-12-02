import React from "react";

interface MainBodyProps {
  children: React.ReactNode;
}

export const MainBody: React.FC<MainBodyProps> = ({ children }) => {
  const lang = localStorage.getItem("i18nextLng");
  const isLargePadding =
    lang === "es" || lang === "de" || lang === "it" || lang === "fr";
  return (
    <main
      className={`flex-1 min-h-[90vh] w-full bg-background pb-[100px] md:pb-[100px] lg:pb-[100px] ${
        isLargePadding ? "pt-32 md:pt-44 lg:pt-32" : "pt-32 md:pt-32 lg:pt-32"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-6">{children}</div>
    </main>
  );
};
