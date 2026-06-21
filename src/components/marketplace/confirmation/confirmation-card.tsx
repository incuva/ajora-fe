interface ConfirmationCardProps {
  status: "success" | "fail";
}

const ConfirmationCard = ({ status }: ConfirmationCardProps) => {
  const isSuccess = status === "success";

  return (
    <div className="flex flex-col items-center justify-center gap-8 flex-1 px-6">
      {/* Illustrated circle */}
      <div
        className={`w-56 h-56 rounded-full flex items-center justify-center ${
          isSuccess ? "bg-soft-green" : "bg-fail-bg"
        }`}
      >
        {isSuccess ? <SuccessIllustration /> : <FailureIllustration />}
      </div>

      {/* Message */}
      <p
        className={`font-playfair text-xl font-medium text-center max-w-xs leading-snug ${
          isSuccess ? "text-success" : "text-fail"
        }`}
      >
        {isSuccess
          ? "Reservation Confirmation successful"
          : "Reservation Confirmation Unsuccessful"}
      </p>
    </div>
  );
};

// Inline Illustrations

const SuccessIllustration = () => (
  <svg width="100" height="100" viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <circle cx="50" cy="50" r="45" fill="#114B3A" opacity="0.12" />
    <circle cx="50" cy="50" r="32" fill="#114B3A" opacity="0.2" />
    <path
      d="M32 50L44 62L68 38"
      stroke="#114B3A"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const FailureIllustration = () => (
  <svg width="100" height="100" viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <circle cx="50" cy="50" r="45" fill="#E74C3C" opacity="0.12" />
    <circle cx="50" cy="50" r="32" fill="#E74C3C" opacity="0.2" />
    <path
      d="M38 38L62 62M62 38L38 62"
      stroke="#E74C3C"
      strokeWidth="5"
      strokeLinecap="round"
    />
  </svg>
);

export default ConfirmationCard;
