import { Button } from "../ui/button";
import { Gift, Plus } from "lucide-react";

interface EmptyPoolProps {
  onCreate?: () => void;
}

const EmptyPool = ({ onCreate }: EmptyPoolProps) => {
  return (
    <div className="bg-white min-h-[55svh] rounded-2xl flex justify-center items-center font-inter">
      <div className="flex flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="border border-gray-200 p-2.5 rounded-xl">
          <Gift className="w-6 h-6 text-green" />
        </div>

        <p className="text-xl font-bold text-green">
          You haven&apos;t Created any pool
        </p>

        <p className="text-sm text-gray-800">
          Add an item to your inventory to get started
        </p>

        <Button className="text-white bg-green mt-1" size="lg" onClick={onCreate}>
          <Plus className="w-4 h-4" /> Create a Pool
        </Button>
      </div>
    </div>
  );
};

export default EmptyPool;
