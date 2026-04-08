import React from "react";

const UITopbar = () => {
  return (
    <main className="w-full flex items-center justify-end border-b border-slate-200 p-3">
      <section className="w-52 flex flex-col items-end p-2 rounded-md border border-gray-300">
        
        <div>
          <p className="font-normal">Arme Inc</p>
          <p className="font-normal">Admin</p>
        </div>
      </section>
    </main>
  );
};

export default UITopbar;
