import React from "react";

const UIContentLayout = ({ children }: { children: React.ReactNode }) => {
  return <main className="w-full h-full px-3 py-1">{children}</main>;
};

export default UIContentLayout;
