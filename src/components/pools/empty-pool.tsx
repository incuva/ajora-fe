import { AppsListRegular } from "@fluentui/react-icons";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

const EmptyPool = () => {
  return (
    <div className="bg-white h-[55svh] rounded-2xl flex justify-center items-center font-inter">
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="border border-gray-200 p-2 rounded-md">
          <AppsListRegular className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-lg font-bold text-green">No Pool Yet</p>

        <p className="text-xs text-gray-800">
          Add an item to your inventory to get started
        </p>
        <Button className="text-white bg-green" size="lg">
          <Plus /> Add an Item
        </Button>
      </div>
    </div>
  );
};

export default EmptyPool;
