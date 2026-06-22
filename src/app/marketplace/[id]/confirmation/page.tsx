"use client";

import { Suspense } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ConfirmationCard from "@/components/marketplace/confirmation/confirmation-card";

const Spinner = () => (
  <div className="w-6 h-6 rounded-full border-2 border-green border-t-transparent animate-spin" />
);

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id ?? "");
  const status = (searchParams.get("status") ?? "success") as "success" | "fail";
  const isSuccess = status === "success";

  return (
    <div className="flex flex-col flex-1 bg-white">

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="flex flex-col flex-1 items-center justify-center px-4 md:max-w-xl md:mx-auto md:w-full"
      >
        <ConfirmationCard status={status} />
      </motion.div>

      <div className="p-4 md:max-w-xl md:mx-auto md:w-full">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push(`/marketplace/${id}`)}
          className={`w-full h-10 rounded-md flex items-center justify-center text-sm font-semibold font-inter ${
            isSuccess
              ? "bg-green text-soft-green"
              : "border border-green text-green bg-transparent"
          }`}
        >
          {isSuccess ? "Done" : "Return to Item"}
        </motion.button>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <Spinner />
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
