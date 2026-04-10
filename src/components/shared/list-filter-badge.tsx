
interface ListFilterBadgeProps {
  active: boolean;
  onClick: () => void;
  label: string;
}

const ListFilterBadge = ({ active, onClick, label }: ListFilterBadgeProps) => {
  return (
    <div
      className={`flex justify-center items-center border rounded-full px-2 py-1 cursor-pointer border-none capitalize ${active ? "bg-gold-400 text-green" : "text-gray-900"}`}
      onClick={() => onClick()}
    >
      <p>{label}</p>
    </div>
  );
};

export default ListFilterBadge;
