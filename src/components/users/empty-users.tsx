import { AppsListRegular, Person16Regular } from "@fluentui/react-icons";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

const EmptyUsers = () => {
  return (
    <div className="bg-white h-[55svh] rounded-2xl flex justify-center items-center font-inter">
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="border border-gray-200 px-3 py-2 rounded-md">
          <Person16Regular className="text-gray-400" />
        </div>
        <p className="text-lg font-bold text-green">
          You do not have any buyers yet
        </p>

        <p className="text-xs text-gray-800">
          Add a user manually or share a registration link with them.
        </p>
        <div className="flex gap-3">
          <Button className="text-green bg-gold-400" size="lg">
            <Plus /> Share Link
          </Button>

          <Button className="text-white bg-green" size="lg">
            <Plus /> Add a User
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmptyUsers;
