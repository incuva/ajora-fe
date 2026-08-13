"use client";

import { useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import OverlaySheet, { OverlayHeader } from "@/components/shared/overlay-sheet";
import {
  FormField,
  TextInput,
  TextArea,
  SelectInput,
} from "@/components/shared/form-fields";
import {
  updatePoolSchema,
  type UpdatePoolFormValues,
} from "@/utils/validators";
import { updatePool } from "@/lib/api/admin-pools.service";
import type { UpdatePoolPayload } from "@/lib/types/admin.types";
import type { Pool } from "@/lib/types/marketplace.types";
import { useToastStore } from "@/stores/toast-store";

interface PoolEditOverlayProps {
  pool: Pool | null;
  isOpen: boolean;
  onClose: () => void;
  /** Called after a successful update so the caller can refresh the list. */
  onUpdated?: () => void;
}

/**
 * Edit-a-Pool overlay 
 */
const PoolEditOverlay = ({
  pool,
  isOpen,
  onClose,
  onUpdated,
}: PoolEditOverlayProps) => {
  const { toastSuccess, toastError } = useToastStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdatePoolFormValues>({
    // z.coerce.number() makes the schema's *input* type `unknown`; cast the
    // resolver to the form's output type so RHF's generics line up.
    resolver: zodResolver(updatePoolSchema) as Resolver<UpdatePoolFormValues>,
    mode: "onChange",
  });

  // Re-seed the form whenever a different pool is opened.
  useEffect(() => {
    if (pool) {
      reset({
        name: pool.name,
        description: pool.description ?? "",
        total_slots: pool.total_slots,
        slot_price: pool.slot_price,
        imageUrl: pool.imageUrl ?? "",
        total_value: pool.total_value,
        weight_per_slot: pool.weight_per_slot,
        status: (pool.status as UpdatePoolFormValues["status"]) ?? undefined,
      });
    }
  }, [pool, reset]);

  const onSubmit = async (values: UpdatePoolFormValues) => {
    if (!pool) return;
    setIsSubmitting(true);
    try {
      // Send only fields that changed from the source pool.
      const payload: UpdatePoolPayload = {};
      if (values.name !== undefined && values.name !== pool.name)
        payload.name = values.name;
      if (
        values.description !== undefined &&
        values.description !== (pool.description ?? "")
      )
        payload.description = values.description || undefined;
      if (
        values.total_slots !== undefined &&
        values.total_slots !== pool.total_slots
      )
        payload.total_slots = values.total_slots;
      if (
        values.slot_price !== undefined &&
        values.slot_price !== pool.slot_price
      )
        payload.slot_price = values.slot_price;
      if (
        values.imageUrl !== undefined &&
        values.imageUrl !== (pool.imageUrl ?? "")
      )
        payload.imageUrl = values.imageUrl || undefined;
      if (
        values.total_value !== undefined &&
        values.total_value !== pool.total_value
      )
        payload.total_value = values.total_value;
      if (
        values.weight_per_slot !== undefined &&
        values.weight_per_slot !== pool.weight_per_slot
      )
        payload.weight_per_slot = values.weight_per_slot;
      if (values.status !== undefined && values.status !== pool.status)
        payload.status = values.status;

      if (Object.keys(payload).length === 0) {
        toastError("Nothing to update", "No fields were changed.");
        setIsSubmitting(false);
        return;
      }

      await updatePool(pool.id, payload);
      toastSuccess("Pool updated", `"${pool.name}" has been updated.`);
      onUpdated?.();
      onClose();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err as Error)?.message ||
        "Could not update the pool. Please try again.";
      toastError("Update failed", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OverlaySheet isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 p-6">
        <OverlayHeader
          title="Edit Pool"
          subtitle="Update the pool details below"
          onClose={onClose}
        />

        <FormField label="Pool Name">
          <TextInput
            placeholder="e.g. Mackerel Fish"
            {...register("name")}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <span className="text-red-500 text-xs font-inter mt-1">
              {errors.name.message}
            </span>
          )}
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Total Slots">
            <TextInput
              type="number"
              min={1}
              placeholder="20"
              {...register("total_slots")}
              className={errors.total_slots ? "border-red-500" : ""}
            />
            {errors.total_slots && (
              <span className="text-red-500 text-xs font-inter mt-1">
                {errors.total_slots.message}
              </span>
            )}
          </FormField>

          <FormField label="Price per Slot">
            <TextInput
              type="number"
              min={0}
              placeholder="20000"
              suffix="₦"
              {...register("slot_price")}
              className={errors.slot_price ? "border-red-500" : ""}
            />
            {errors.slot_price && (
              <span className="text-red-500 text-xs font-inter mt-1">
                {errors.slot_price.message}
              </span>
            )}
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Total Value">
            <TextInput
              type="number"
              min={0}
              placeholder="400000"
              suffix="₦"
              {...register("total_value")}
              className={errors.total_value ? "border-red-500" : ""}
            />
            {errors.total_value && (
              <span className="text-red-500 text-xs font-inter mt-1">
                {errors.total_value.message}
              </span>
            )}
          </FormField>

          <FormField label="Weight per Slot (kg)">
            <TextInput
              type="number"
              min={0}
              placeholder="13"
              {...register("weight_per_slot")}
              className={errors.weight_per_slot ? "border-red-500" : ""}
            />
            {errors.weight_per_slot && (
              <span className="text-red-500 text-xs font-inter mt-1">
                {errors.weight_per_slot.message}
              </span>
            )}
          </FormField>
        </div>

        <FormField label="Status">
          <SelectInput {...register("status")}>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="filled">Filled</option>
          </SelectInput>
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

        <FormField label="Pool Description (optional)">
          <TextArea placeholder="Describe the item" {...register("description")} />
        </FormField>

        <div className="flex flex-col gap-3 pt-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 rounded-md bg-green text-primary-foreground text-sm font-semibold font-inter transition-colors hover:bg-green/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </OverlaySheet>
  );
};

export default PoolEditOverlay;
