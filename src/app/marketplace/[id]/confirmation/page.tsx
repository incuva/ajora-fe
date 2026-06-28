"use client";

import { Suspense } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ConfirmationCard from "@/components/marketplace/confirmation/confirmation-card";
import Button from "@/components/marketplace/common/button";
import Spinner from "@/components/shared/spinner";


function ConfirmationContent() {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id ?? "");
  const status = (searchParams.get("status") ?? "success") as "success" | "fail";
  const orderId = (searchParams.get('orderId'))
  const isSuccess = status === "success";

  return (
    <div className="flex flex-col flex-1 bg-white">

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="flex flex-col flex-1 items-center justify-center px-4 md:max-w-xl md:mx-auto md:w-full"
      >
        <ConfirmationCard status={status} orderId={orderId} />
      </motion.div>

      <div className="p-4 md:max-w-xl md:mx-auto md:w-full">
        <Button
          variant={isSuccess ? "primary" : "secondary"}
          fullWidth
          onClick={() => router.push(`/marketplace/${id}`)}
        >
          {isSuccess ? "Done" : "Return to Item"}
        </Button>
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
