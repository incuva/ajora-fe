interface CheckoutSummaryRowProps {
  label: string;
  value: string;
  bold?: boolean;
}

const CheckoutSummaryRow = ({ label, value, bold }: CheckoutSummaryRowProps) => (
  <div className="flex flex-col gap-2">
    <span
      className={`font-inter text-[13px] text-green ${
        bold ? "font-semibold" : "font-medium"
      }`}
    >
      {label}
    </span>
    <span className="text-xs font-inter text-pool-green">{value}</span>
  </div>
);

export default CheckoutSummaryRow;
