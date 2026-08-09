"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, ImageOff } from "lucide-react";
import { Edit24Regular, Delete24Regular } from "@fluentui/react-icons";
import UIContentLayout from "@/components/shared/content-layout";
import ItemFormOverlay from "@/components/items/item-form-overlay";
import { getItemById, deleteItem } from "@/lib/api/admin-items.service";
import type { Item } from "@/lib/types/item.types";
import { useToastStore } from "@/stores/toast-store";

const formatDate = (iso?: string) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
};

const Field = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-1 border-b border-gray-200 pb-2">
    <span className="text-xs font-medium uppercase tracking-wide text-neutral-400 font-inter">
      {label}
    </span>
    <span className="text-base font-medium text-near-black font-inter wrap-break-word">
      {value}
    </span>
  </div>
);

const ItemDetailsPage = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { toastSuccess, toastError } = useToastStore();

  const [item, setItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const load = () => {
    if (!id) return;
    setIsLoading(true);
    getItemById(id)
      .then((data) => {
        setItem(data);
        setNotFound(false);
      })
      .catch((err: unknown) => {
        setNotFound(true);
        const message =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message ||
          (err as Error)?.message ||
          "Could not load this item.";
        toastError("Load failed", message);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDelete = async () => {
    if (!item) return;
    if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    setIsDeleting(true);
    try {
      await deleteItem(item.id);
      toastSuccess("Item deleted", `"${item.name}" was removed.`);
      router.push("/auth/admin/items");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err as Error)?.message ||
        "Could not delete the item.";
      toastError("Delete failed", message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <UIContentLayout>
      <div className="w-full max-w-3xl flex flex-col gap-6">
        <button
          type="button"
          onClick={() => router.push("/auth/admin/items")}
          className="flex items-center gap-2 text-sm font-medium text-grey-800 hover:text-green transition-colors font-inter w-fit"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Items
        </button>

        {isLoading ? (
          <div className="h-80 rounded-2xl bg-white ring-1 ring-gray-100 flex items-center justify-center text-text-sec font-inter">
            Loading…
          </div>
        ) : notFound || !item ? (
          <div className="h-80 rounded-2xl bg-white ring-1 ring-gray-100 flex items-center justify-center text-text-sec font-inter">
            Item not found.
          </div>
        ) : (
          <div className="bg-white rounded-2xl ring-1 ring-gray-100 overflow-hidden">
            <div className="relative w-full aspect-16/9 bg-neutral-100">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-grey-500">
                  <ImageOff className="w-10 h-10" />
                </div>
              )}
            </div>

            <div className="p-6 flex flex-col gap-5">
              <div className="flex items-start justify-between gap-3">
                <h1 className="font-playfair text-2xl font-bold text-green">
                  {item.name}
                </h1>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="Edit item"
                    onClick={() => setEditOpen(true)}
                    className="text-grey-800 hover:text-green transition-colors"
                  >
                    <Edit24Regular />
                  </button>
                  <button
                    type="button"
                    aria-label="Delete item"
                    disabled={isDeleting}
                    onClick={handleDelete}
                    className="text-grey-800 hover:text-fail transition-colors disabled:opacity-50"
                  >
                    <Delete24Regular />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <Field label="Unit" value={item.unit} />
                <Field label="Created On" value={formatDate(item.created_at)} />
                <Field label="Last Updated" value={formatDate(item.updated_at)} />
              </div>

              <Field label="Description" value={item.description || "—"} />
            </div>
          </div>
        )}
      </div>

      <ItemFormOverlay
        item={item}
        isOpen={isEditOpen}
        onClose={() => setEditOpen(false)}
        onSaved={load}
      />
    </UIContentLayout>
  );
};

export default ItemDetailsPage;
