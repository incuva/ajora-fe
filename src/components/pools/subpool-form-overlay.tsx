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
  addSubpoolSchema,
  type AddSubpoolFormValues,
} from "@/utils/validators";
import { addSubpool, updateSubpool } from "@/lib/api/admin-pools.service";
import type {
  AddSubpoolPayload,
  UpdateSubpoolPayload,
} from "@/lib/types/admin.types";
import type { Subpool } from "@/lib/types/marketplace.types";
import { useToastStore } from "@/stores/toast-store";

interface SubpoolFormOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  /** Parent pool id — required to add a subpool. */
  poolId: string | null;
  /** When provided, the overlay edits this subpool instead of adding one. */
  subpool?: Subpool | null;
  /** Called after a successful add/update so the caller can refresh. */
  onSaved?: () => void;
}

const EMPTY: AddSubpoolFormValues = {
  name: "",
  description: "",
  weight_per_slot: undefined,
  price: undefined as unknown as number,
  total_slots: undefined as unknown as number,
  status: undefined,
};

/**
 * Add/Edit-a-Subpool overlay.
 *   • add  → POST /admin/subpool/add/{poolId}
 *   • edit → PUT  /admin/subpool/{id}
 *
 * Both modes share the add-schema fields. In edit mode we seed from the source
 * subpool and send only the changed fields as an UpdateSubpoolPayload.
 */
const SubpoolFormOverlay = ({
  isOpen,
  onClose,
  poolId,
  subpool,
  onSaved,
}: SubpoolFormOverlayProps) => {
  const { toastSuccess, toastError } = useToastStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEdit = !!subpool;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<AddSubpoolFormValues>({
    // z.coerce.number() makes the schema's *input* type `unknown`; cast the
    // resolver to the form's output type so RHF's generics line up.
    resolver: zodResolver(addSubpoolSchema) as Resolver<AddSubpoolFormValues>,
    defaultValues: EMPTY,
    mode: "onChange",
  });

  // Seed from the source subpool in edit mode; clear in add mode.
  useEffect(() => {
    if (subpool) {
      reset({
        name: subpool.name,
        description: subpool.description ?? "",
        weight_per_slot: subpool.weight_per_slot,
        price: subpool.price,
        total_slots: subpool.total_slots,
        status: (subpool.status as AddSubpoolFormValues["status"]) ?? undefined,
      });
    } else {
      reset(EMPTY);
    }
  }, [subpool, reset]);

  const handleClose = () => {
    reset(EMPTY);
    onClose();
  };

  const onSubmit = async (values: AddSubpoolFormValues) => {
    setIsSubmitting(true);
    try {
      if (isEdit && subpool) {
        // Diff against the source so we send only real changes.
        const payload: UpdateSubpoolPayload = {};
        if (values.name !== subpool.name) payload.name = values.name;
        if (values.description !== (subpool.description ?? ""))
          payload.description = values.description || undefined;
        if (values.price !== subpool.price) payload.price = values.price;
        if (values.total_slots !== subpool.total_slots)
          payload.total_slots = values.total_slots;
        if (values.weight_per_slot !== subpool.weight_per_slot)
          payload.weight_per_slot = values.weight_per_slot;
        if (values.status !== undefined && values.status !== subpool.status)
          payload.status = values.status;

        if (Object.keys(payload).length === 0) {
          toastError("Nothing to update", "No fields were changed.");
          setIsSubmitting(false);
          return;
        }

        await updateSubpool(subpool.id, payload);
        toastSuccess("Subpool updated", `"${values.name}" has been updated.`);
      } else {
        if (!poolId) {
          toastError("No pool selected", "Cannot add a subpool without a pool.");
          setIsSubmitting(false);
          return;
        }
        const payload: AddSubpoolPayload = {
          name: values.name,
          description: values.description || undefined,
          weight_per_slot: values.weight_per_slot,
          price: values.price,
          total_slots: values.total_slots,
          status: values.status,
        };
        await addSubpool(poolId, payload);
        toastSuccess("Subpool added", `"${values.name}" was added to the pool.`);
      }
      reset(EMPTY);
      onSaved?.();
      onClose();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err as Error)?.message ||
        "Could not save the subpool. Please try again.";
      toastError(isEdit ? "Update failed" : "Add failed", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OverlaySheet isOpen={isOpen} onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 p-6">
        <OverlayHeader
          title={isEdit ? "Edit Subpool" : "Add Subpool"}
          subtitle={
            isEdit
              ? "Update the subpool details below"
              : "Fill in the details to add a subpool"
          }
          onClose={handleClose}
        />

        <FormField label="Name">
          <TextInput
            placeholder="e.g. Mackerel (heads only)"
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
              placeholder="10"
              {...register("total_slots")}
              className={errors.total_slots ? "border-red-500" : ""}
            />
            {errors.total_slots && (
              <span className="text-red-500 text-xs font-inter mt-1">
                {errors.total_slots.message}
              </span>
            )}
          </FormField>

          <FormField label="Price">
            <TextInput
              type="number"
              min={0}
              placeholder="10000"
              suffix="₦"
              {...register("price")}
              className={errors.price ? "border-red-500" : ""}
            />
            {errors.price && (
              <span className="text-red-500 text-xs font-inter mt-1">
                {errors.price.message}
              </span>
            )}
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Weight per Slot (kg, optional)">
            <TextInput
              type="number"
              min={0}
              placeholder="5"
              {...register("weight_per_slot")}
              className={errors.weight_per_slot ? "border-red-500" : ""}
            />
            {errors.weight_per_slot && (
              <span className="text-red-500 text-xs font-inter mt-1">
                {errors.weight_per_slot.message}
              </span>
            )}
          </FormField>

          <FormField label="Status (optional)">
            <SelectInput {...register("status")} defaultValue="">
              <option value="">—</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="filled">Filled</option>
            </SelectInput>
          </FormField>
        </div>

        <FormField label="Description (optional)">
          <TextArea
            placeholder="Short description"
            {...register("description")}
          />
        </FormField>

        <div className="flex flex-col gap-3 pt-1">
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="w-full h-12 rounded-md bg-green text-primary-foreground text-sm font-semibold font-inter transition-colors hover:bg-green/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                {isEdit ? "Saving..." : "Adding..."}
              </>
            ) : isEdit ? (
              "Save Changes"
            ) : (
              "Add Subpool"
            )}
          </button>
        </div>
      </form>
    </OverlaySheet>
  );
};

export default SubpoolFormOverlay;
