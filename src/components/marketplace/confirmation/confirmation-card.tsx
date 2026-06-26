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
          ? "Booking Confirmation successful"
          : "Booking Confirmation Unsuccessful"}
      </p>
    </div>
  );
};

// Inline Illustrations

const SuccessIllustration = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="112"
    height="112"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#16A34A"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21.801 10A10 10 0 1 1 17 3.335" />
    <path d="m9 11 3 3L22 4" />
  </svg>
);

const FailureIllustration = () => (
  <svg
    width="100"
    height="100"
    viewBox="0 0 100 100"
    fill="none"
    aria-hidden="true"
  >
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
