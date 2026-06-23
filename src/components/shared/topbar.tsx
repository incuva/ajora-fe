import UserBadge from "./userbadge";
import { Field } from "../ui/field";
import { Input } from "../ui/input";
import { Alert24Regular } from "@fluentui/react-icons";

const UITopbar = () => {
  return (
    <main className="w-full flex items-center justify-between border-b border-slate-200 px-8 py-2 gap-3">
      <Field orientation="horizontal" className="w-96">
        <Input className="bg-white" type="search" placeholder="Type a command or search..." />
      </Field>
      <section className="flex items-center gap-10">
        <Alert24Regular className="text-green" />
        <UserBadge />
      </section>
    </main>
  );
};

export default UITopbar;
