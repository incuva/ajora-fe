"use client";

import { useState } from "react";
import OverlaySheet, { OverlayHeader } from "@/components/shared/overlay-sheet";
import {
  FormField,
  TextInput,
  SelectInput,
  TextArea,
} from "@/components/shared/form-fields";

interface PoolFormOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate?: (values: Record<string, string>) => void;
}

type Mode = "pool" | "subpool";

const ITEM_OPTIONS = [
  "Frozen Food",
  "Meat",
  "Poultry",
  "Grains",
  "Fish",
];

/**
 * Add-a-Pool overlay with the Add-a-Subpool variant.
 * The primary form creates a pool; its "Add Subpool" secondary action swaps the
 * sheet to the subpool form, which can return to the main pool details.
 */
const PoolFormOverlay = ({ isOpen, onClose, onCreate }: PoolFormOverlayProps) => {
  const [mode, setMode] = useState<Mode>("pool");
  const [poolName, setPoolName] = useState("");

  const handleClose = () => {
    setMode("pool");
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate?.({ mode, poolName });
    handleClose();
  };

  const isSubpool = mode === "subpool";

  return (
    <OverlaySheet isOpen={isOpen} onClose={handleClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6">
        <OverlayHeader
          title={isSubpool ? "Add a Subpool" : "Create a Pool"}
          subtitle={
            isSubpool ? (
              <>
                Add a Subpool to{" "}
                <span className="font-semibold text-grey-800">
                  {poolName || "this"}
                </span>{" "}
                Pool
              </>
            ) : (
              "Fill in the following details to create a new pool"
            )
          }
          onClose={handleClose}
        />

        <FormField label={isSubpool ? "Subpool Name" : "Pool Name"}>
          <TextInput
            value={poolName}
            onChange={(e) => setPoolName(e.target.value)}
            placeholder={isSubpool ? "e.g. Mackrel Fish (heads only)" : "e.g. Mackrel Fish"}
          />
        </FormField>

        <FormField label="Number of Slots">
          <TextInput placeholder="20 Slots" />
        </FormField>

        <FormField label="Price per Slot">
          <TextInput placeholder="₦20,000" />
        </FormField>

        {!isSubpool && (
          <FormField label="Item">
            <SelectInput defaultValue="">
              <option value="" disabled>
                Select an item
              </option>
              {ITEM_OPTIONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </SelectInput>
          </FormField>
        )}

        <FormField label="Quantity">
          <TextInput type="number" placeholder="13" suffix="kg" />
        </FormField>

        {!isSubpool && (
          <div className="grid grid-cols-1 gap-5">
            <FormField label="Start Date">
              <TextInput type="date" />
            </FormField>
            <FormField label="End Date">
              <TextInput type="date" />
            </FormField>
          </div>
        )}

        <FormField label={isSubpool ? "Subpool Description" : "Pool Description"}>
          <TextArea placeholder="Describe the item" />
        </FormField>

        <div className="flex flex-col gap-3 pt-1">
          <button
            type="submit"
            className="w-full h-12 rounded-md bg-green text-primary-foreground text-sm font-semibold font-inter transition-colors hover:bg-green/90"
          >
            Create Pool
          </button>

          {isSubpool ? (
            <button
              type="button"
              onClick={() => setMode("pool")}
              className="w-full h-12 rounded-md border border-green bg-bg text-sm font-semibold font-inter text-green transition-colors hover:bg-soft-green"
            >
              Return to Main Pool Details
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setMode("subpool")}
              className="w-full h-12 rounded-md border border-green bg-bg text-sm font-semibold font-inter text-green transition-colors hover:bg-soft-green"
            >
              Add Subpool
            </button>
          )}
        </div>
      </form>
    </OverlaySheet>
  );
};

export default PoolFormOverlay;
