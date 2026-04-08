import { GoBell } from "react-icons/go";
import UserBadge from "./userbadge";
import { Field } from "../ui/field";
import { Input } from "../ui/input";

const UITopbar = () => {
  return (
    <main className="w-full flex items-center justify-between border-b border-slate-200 px-8 py-2">
      <Field orientation="horizontal" className="w-96">
        <Input type="search" placeholder="Type a command or search..." />
      </Field>
      <section className="flex items-center gap-10">
        <GoBell className="w-6 h-6 text-green" />
        <UserBadge />
      </section>
    </main>
  );
};

export default UITopbar;
