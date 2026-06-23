interface PoolInfoRowProps {
  label: string;
  value: string;
}

const PoolInfoRow = ({ label, value }: PoolInfoRowProps) => (
  <div className="flex items-center justify-between w-full">
    <span className="text-xs font-inter text-black">{label}</span>
    <span className="text-sm font-semibold font-inter text-black">{value}</span>
  </div>
);

export default PoolInfoRow;
