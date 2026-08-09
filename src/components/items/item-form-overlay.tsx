"use client";

import { useState } from "react";
import Image from "next/image";
import { CloudArrowUp24Regular } from "@fluentui/react-icons";
import { Plus } from "lucide-react";
import OverlaySheet, { OverlayHeader } from "@/components/shared/overlay-sheet";
import {
  FormField,
  TextInput,
  TextArea,
} from "@/components/shared/form-fields";
import type { Items } from "@/stores/items-table.store";

interface ItemFormOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  /** Provide an item to open in edit mode; omit for the add flow. */
  item?: Items | null;
  onSubmit?: (values: Record<string, string>) => void;
}

/**
 * Add New Item / Edit Item  overlay. Edit mode
 * pre-fills the fields and previews the current photo behind the upload zone.
 */
const ItemFormOverlay = ({
  isOpen,
  onClose,
  item,
  onSubmit,
}: ItemFormOverlayProps) => {
  const isEdit = Boolean(item);
  const [name, setName] = useState(item?.name ?? "");
  const [unitType, setUnitType] = useState(isEdit ? "Kg" : "");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ name, unitType, description });
    onClose();
  };

  return (
    <OverlaySheet isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6">
        <OverlayHeader
          title={isEdit ? `Edit ${item?.name}` : "Add New Item"}
          subtitle="Fill in the details to create a new catalogue entry."
          onClose={onClose}
        />

        {/* Photo upload */}
        <FormField label="Photo of Item">
          <label className="relative flex flex-col items-center justify-center gap-2 h-44 rounded-xl border-2 border-dashed border-input-border cursor-pointer overflow-hidden text-center transition-colors hover:border-green/50">
            {isEdit && item?.img && (
              <Image
                src={item.img}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 100vw, 448px"
                className="object-cover opacity-40"
              />
            )}
            <div className="relative flex flex-col items-center gap-1">
              <CloudArrowUp24Regular className="w-7 h-7 text-grey-500" />
              <span className="text-base font-medium text-near-black font-inter">
                Upload item photography
              </span>
              <span className="text-xs text-grey-500 font-inter">
                PNG, JPG up to 10MB
              </span>
            </div>
            <input type="file" accept="image/png,image/jpeg" className="hidden" />
          </label>
        </FormField>

        <FormField label="Item Name">
          <TextInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="eg. Cow, Rice, Beans"
          />
        </FormField>

        <FormField label="Unit Type">
          <TextInput
            value={unitType}
            onChange={(e) => setUnitType(e.target.value)}
            placeholder="eg. Bag, kg,"
          />
        </FormField>

        <FormField label="Description">
          <TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the item"
          />
        </FormField>

        <button
          type="button"
          className="w-full h-12 flex items-center justify-center gap-2 rounded-md border border-input-border bg-bg text-sm font-semibold font-inter text-green transition-colors hover:bg-soft-green"
        >
          <Plus className="w-4 h-4" /> Add Item Part
        </button>

        <button
          type="submit"
          className="w-full h-12 rounded-md bg-green text-primary-foreground text-sm font-semibold font-inter transition-colors hover:bg-green/90"
        >
          {isEdit ? "Save Changes" : "Create Item"}
        </button>
      </form>
    </OverlaySheet>
  );
};

export default ItemFormOverlay;
