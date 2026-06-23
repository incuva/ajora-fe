import { PlusCircle } from "lucide-react";

const EmptyItems = () => {
  return (
    <div className="h-[55svh] rounded-2xl flex justify-center items-center font-inter">
      <div className="flex flex-col justify-center items-center w-96 h-80 gap-4 border-2 border-neutral-300 border-dashed rounded-lg">
        <div className="bg-neutral-300 w-16 h-16 rounded-full flex justify-center items-center">
            <PlusCircle className="text-gray-500 w-6 h-6" />
        </div>
        <div className="flex flex-col gap-3 justify-center items-center px-8">
          <p className="text-lg font-bold">Have a new item?</p>
          <p className="text-sm font-normal text-center text-gray-500">
            Add a new commodity to begin bulk collective pooling
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptyItems;
