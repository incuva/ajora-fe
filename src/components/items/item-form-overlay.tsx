"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import OverlaySheet, { OverlayHeader } from "@/components/shared/overlay-sheet";
import {
  FormField,
  TextInput,
  TextArea,
} from "@/components/shared/form-fields";
import {
  createItemSchema,
  type CreateItemFormValues,
} from "@/utils/validators";
import { createItem, updateItem } from "@/lib/api/admin-items.service";
import type { Item, UpdateItemPayload } from "@/lib/types/item.types";
import { useToastStore } from "@/stores/toast-store";

interface ItemFormOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  /** Provide an item to open in edit mode; omit for the add flow. */
  item?: Item | null;
  /** Called after a successful create/update so the caller can refresh. */
  onSaved?: () => void;
}

const EMPTY: CreateItemFormValues = {
  name: "",
  unit: "",
  description: "",
  imageUrl: "",
};

/**
 * Add New Item / Edit Item overlay.
 * Create → POST /admin/item/create. Edit → PUT /admin/item/{id}, sending only
 * the fields that actually changed.
 */
const ItemFormOverlay = ({
  isOpen,
  onClose,
  item,
  onSaved,
}: ItemFormOverlayProps) => {
  const isEdit = Boolean(item);
  const { toastSuccess, toastError, toastInfo } = useToastStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateItemFormValues>({
    resolver: zodResolver(createItemSchema),
    defaultValues: EMPTY,
    mode: "onChange",
  });

  // Seed the form whenever the target item changes (edit) or the add flow opens.
  useEffect(() => {
    if (item) {
      reset({
        name: item.name,
        unit: item.unit,
        description: item.description ?? "",
        imageUrl: item.imageUrl ?? "",
      });
    } else {
      reset(EMPTY);
    }
  }, [item, isOpen, reset]);

  const handleClose = () => {
    reset(EMPTY);
    onClose();
  };

  const onSubmit = async (values: CreateItemFormValues) => {
    setIsSubmitting(true);
    try {
      if (isEdit && item) {
        // Diff against the source; send only what changed.
        const payload: UpdateItemPayload = {};
        if (values.name !== item.name) payload.name = values.name;
        if (values.unit !== item.unit) payload.unit = values.unit;
        if ((values.description || "") !== (item.description || ""))
          payload.description = values.description || undefined;
        if ((values.imageUrl || "") !== (item.imageUrl || ""))
          payload.imageUrl = values.imageUrl || undefined;

        if (Object.keys(payload).length === 0) {
          toastInfo("Nothing to update", "No fields were changed.");
          setIsSubmitting(false);
          return;
        }
        await updateItem(item.id, payload);
        toastSuccess("Item updated", `"${values.name}" has been saved.`);
      } else {
        await createItem({
          name: values.name,
          unit: values.unit,
          description: values.description || undefined,
          imageUrl: values.imageUrl || undefined,
        });
        toastSuccess("Item created", `"${values.name}" was added.`);
      }
      reset(EMPTY);
      onSaved?.();
      onClose();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err as Error)?.message ||
        "Could not save the item. Please try again.";
      toastError("Save failed", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OverlaySheet isOpen={isOpen} onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 p-6">
        <OverlayHeader
          title={isEdit ? `Edit ${item?.name}` : "Add New Item"}
          subtitle="Fill in the details to create a new catalogue entry."
          onClose={handleClose}
        />

        <FormField label="Item Name">
          <TextInput
            placeholder="eg. Cow, Rice, Beans"
            {...register("name")}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <span className="text-red-500 text-xs font-inter mt-1">
              {errors.name.message}
            </span>
          )}
        </FormField>

        <FormField label="Unit">
          <TextInput
            placeholder="eg. kg, bag, crate"
            {...register("unit")}
            className={errors.unit ? "border-red-500" : ""}
          />
          {errors.unit && (
            <span className="text-red-500 text-xs font-inter mt-1">
              {errors.unit.message}
            </span>
          )}
        </FormField>

        <FormField label="Image URL (optional)">
          <TextInput
            type="url"
            placeholder="https://…"
            {...register("imageUrl")}
            className={errors.imageUrl ? "border-red-500" : ""}
          />
          {errors.imageUrl && (
            <span className="text-red-500 text-xs font-inter mt-1">
              {errors.imageUrl.message}
            </span>
          )}
        </FormField>

        <FormField label="Description (optional)">
          <TextArea
            placeholder="Describe the item"
            {...register("description")}
          />
        </FormField>

        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="w-full h-12 rounded-md bg-green text-primary-foreground text-sm font-semibold font-inter transition-colors hover:bg-green/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              {isEdit ? "Saving..." : "Creating..."}
            </>
          ) : isEdit ? (
            "Save Changes"
          ) : (
            "Create Item"
          )}
        </button>
      </form>
    </OverlaySheet>
  );
};

export default ItemFormOverlay;
