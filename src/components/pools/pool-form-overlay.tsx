"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import OverlaySheet, { OverlayHeader } from "@/components/shared/overlay-sheet";
import {
  FormField,
  TextInput,
  TextArea,
  SelectInput,
} from "@/components/shared/form-fields";
import { createPoolSchema, type CreatePoolFormValues } from "@/utils/validators";
import { createPool } from "@/lib/api/admin-pools.service";
import { getItems } from "@/lib/api/admin-items.service";
import type { CreatePoolPayload } from "@/lib/types/admin.types";
import type { Item } from "@/lib/types/item.types";
import { useToastStore } from "@/stores/toast-store";

interface PoolFormOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  /** Called after a successful create so the caller can refresh the list. */
  onCreated?: () => void;
}

/**
 * Create-a-Pool overlay.
 */
const PoolFormOverlay = ({ isOpen, onClose, onCreated }: PoolFormOverlayProps) => {
  const { toastSuccess, toastError } = useToastStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CreatePoolFormValues>({
    resolver: zodResolver(createPoolSchema) as Resolver<CreatePoolFormValues>,
    defaultValues: {
      name: "",
      item_id: "",
      deadline: "",
      start_time: "",
      description: "",
      total_slots: undefined,
      slot_price: undefined,
      total_value: undefined,
      imageUrl: "",
      subpools: [],
    },
    mode: "onChange",
  });

  // Load the catalogue items to populate the "Item" selector when the overlay
  // opens. Pools must reference an existing item (item_id is required).
  useEffect(() => {
    if (!isOpen) return;
    let active = true;
    setItemsLoading(true);
    getItems()
      .then((data) => {
        if (active) setItems(data);
      })
      .catch(() => {
        if (active) setItems([]);
      })
      .finally(() => {
        if (active) setItemsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [isOpen]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subpools",
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (values: CreatePoolFormValues) => {
    setIsSubmitting(true);
    try {
      const payload: CreatePoolPayload = {
        name: values.name,
        item_id: values.item_id,
        description: values.description || undefined,
        deadline: values.deadline
          ? new Date(values.deadline).toISOString()
          : undefined,
        start_time: values.start_time
          ? new Date(values.start_time).toISOString()
          : undefined,
        total_slots: values.total_slots,
        slot_price: values.slot_price,
        total_value: values.total_value,
        imageUrl: values.imageUrl || undefined,
        subpools:
          values.subpools && values.subpools.length > 0
            ? values.subpools.map((s) => ({
                name: s.name,
                total_slots: s.total_slots,
                description: s.description || undefined,
                price: s.price,
              }))
            : undefined,
      };
      await createPool(payload);
      toastSuccess("Pool created", `"${values.name}" is now open.`);
      reset();
      onCreated?.();
      onClose();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err as Error)?.message ||
        "Could not create the pool. Please try again.";
      toastError("Create failed", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OverlaySheet isOpen={isOpen} onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 p-6">
        <OverlayHeader
          title="Create a Pool"
          subtitle="Fill in the following details to create a new pool"
          onClose={handleClose}
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

        <FormField label="Item">
          <SelectInput
            {...register("item_id")}
            disabled={itemsLoading || items.length === 0}
            className={errors.item_id ? "border-red-500" : ""}
          >
            <option value="">
              {itemsLoading
                ? "Loading items…"
                : items.length === 0
                  ? "No items yet — create one first"
                  : "Select an item"}
            </option>
            {items.map((it) => (
              <option key={it.id} value={it.id}>
                {it.name}
                {it.unit ? ` (${it.unit})` : ""}
              </option>
            ))}
          </SelectInput>
          {errors.item_id && (
            <span className="text-red-500 text-xs font-inter mt-1">
              {errors.item_id.message}
            </span>
          )}
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Start Time (optional)">
            <TextInput
              type="datetime-local"
              {...register("start_time")}
              className={errors.start_time ? "border-red-500" : ""}
            />
          </FormField>

          <FormField label="Reservation Deadline (optional)">
            <TextInput
              type="datetime-local"
              {...register("deadline")}
              className={errors.deadline ? "border-red-500" : ""}
            />
          </FormField>
        </div>

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

        {/* Inline subpools */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-label font-inter">
              Subpools (optional)
            </span>
            <button
              type="button"
              onClick={() =>
                append({
                  name: "",
                  total_slots: undefined as unknown as number,
                  description: "",
                  price: undefined,
                })
              }
              className="flex items-center gap-1 text-sm font-semibold text-green hover:underline"
            >
              <Plus className="w-4 h-4" /> Add Subpool
            </button>
          </div>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col gap-3 rounded-xl border border-input-border p-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400 font-inter">
                  Subpool {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  aria-label="Remove subpool"
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <FormField label="Name">
                <TextInput
                  placeholder="e.g. Mackerel (heads only)"
                  {...register(`subpools.${index}.name` as const)}
                  className={
                    errors.subpools?.[index]?.name ? "border-red-500" : ""
                  }
                />
                {errors.subpools?.[index]?.name && (
                  <span className="text-red-500 text-xs font-inter mt-1">
                    {errors.subpools[index]?.name?.message}
                  </span>
                )}
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Total Slots">
                  <TextInput
                    type="number"
                    min={1}
                    placeholder="10"
                    {...register(`subpools.${index}.total_slots` as const)}
                    className={
                      errors.subpools?.[index]?.total_slots
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {errors.subpools?.[index]?.total_slots && (
                    <span className="text-red-500 text-xs font-inter mt-1">
                      {errors.subpools[index]?.total_slots?.message}
                    </span>
                  )}
                </FormField>

                <FormField label="Price (optional)">
                  <TextInput
                    type="number"
                    min={0}
                    placeholder="10000"
                    suffix="₦"
                    {...register(`subpools.${index}.price` as const)}
                  />
                </FormField>
              </div>

              <FormField label="Description (optional)">
                <TextInput
                  placeholder="Short description"
                  {...register(`subpools.${index}.description` as const)}
                />
              </FormField>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 pt-1">
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="w-full h-12 rounded-md bg-green text-primary-foreground text-sm font-semibold font-inter transition-colors hover:bg-green/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                Creating...
              </>
            ) : (
              "Create Pool"
            )}
          </button>
        </div>
      </form>
    </OverlaySheet>
  );
};

export default PoolFormOverlay;
