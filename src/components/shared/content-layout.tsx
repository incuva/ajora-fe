import React from "react";

const UIContentLayout = ({ children }: { children: React.ReactNode }) => {
  return <main className="w-full h-full px-4 md:px-6 py-2">{children}</main>;
};

export default UIContentLayout;
