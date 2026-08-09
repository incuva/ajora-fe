
interface ListFilterBadgeProps {
  active: boolean;
  onClick: () => void;
  label: string;
  /** When true, inactive pills show a thin outline (used by table filter bars). */
  outlined?: boolean;
}

const ListFilterBadge = ({
  active,
  onClick,
  label,
  outlined = false,
}: ListFilterBadgeProps) => {
  return (
    <div
      className={`flex justify-center items-center rounded-full px-3.5 py-1.5 cursor-pointer capitalize whitespace-nowrap transition-colors ${
        active
          ? "bg-gold-400 text-green border border-transparent"
          : outlined
            ? "text-gray-900 border border-gray-300 hover:border-gray-400"
            : "text-gray-900 border border-transparent"
      }`}
      onClick={() => onClick()}
    >
      <p className="text-sm">{label}</p>
    </div>
  );
};

export default ListFilterBadge;
