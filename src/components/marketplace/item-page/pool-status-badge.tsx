interface PoolStatusBadgeProps {
  status: string;
}

const PoolStatusBadge = ({ status }: PoolStatusBadgeProps) => (
  <span className="inline-flex items-center px-3 py-1 rounded-full text-[13px] font-medium font-inter bg-badge-green text-success capitalize">
    {status}
  </span>
);

export default PoolStatusBadge;
