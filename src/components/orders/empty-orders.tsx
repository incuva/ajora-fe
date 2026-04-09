import { AppsListRegular } from "@fluentui/react-icons";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

const EmptyOrders = () => {
  return (
    <div className="bg-white h-[55svh] rounded-2xl flex justify-center items-center font-inter">
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="border border-gray-200 p-2 rounded-md">
          <AppsListRegular className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-lg font-bold text-green">No Orders Yet</p>
        <p className="text-xs text-gray-800 text-center max-w-[220px]">
          Orders will appear here once users start purchasing pool slots.
        </p>
        <Button className="text-white bg-green" size="lg">
          <Plus /> Create a Pool
        </Button>
      </div>
    </div>
  );
};

export default EmptyOrders;
