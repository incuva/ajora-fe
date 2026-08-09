"use client";

import UIContentLayout from "@/components/shared/content-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import EmptyItems from "@/components/items/empty-item";
import ItemsDataTable from "@/components/items/table";
import ItemFormOverlay from "@/components/items/item-form-overlay";
import { useItemsTableStore, type Items } from "@/stores/items-table.store";
import { useToastStore } from "@/stores/toast-store";

const ItemsPage = () => {
  const {
    items,
    isLoading,
    page,
    pageSize,
    total,
    activeFilter,
    setPage,
    setPageSize,
    setFilter,
    fetchitems,
    removeItem,
  } = useItemsTableStore();

  const { toastSuccess, toastError } = useToastStore();

  const [isAddOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<Items | null>(null);

  useEffect(() => {
    fetchitems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (item: Items) => {
    if (
      !window.confirm(
        `Delete "${item.name}"? This cannot be undone.`,
      )
    )
      return;
    try {
      await removeItem(item.id);
      toastSuccess("Item deleted", `"${item.name}" was removed.`);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err as Error)?.message ||
        "Could not delete the item.";
      toastError("Delete failed", message);
    }
  };
  return (
    <UIContentLayout>
      <Card className="bg-transparent ring-0">
        <CardHeader className="px-0">
          <CardTitle className="font-playfair text-xl font-medium">
            Items
          </CardTitle>
          <CardAction>
            <Button
              className="bg-green text-white"
              onClick={() => setAddOpen(true)}
            >
              <Plus className="w-4 h-4" /> Add New Item
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="px-0">
          {/* Items table */}
          <ItemsDataTable
            data={items}
            isLoading={isLoading}
            emptyState={<EmptyItems />}
            filters={[]}
            activeFilter={activeFilter}
            onFilterChange={setFilter}
            onEditItem={setEditItem}
            onDeleteItem={handleDelete}
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            pageSizeOptions={[10, 15, 20, 30, 40]}
          />
        </CardContent>
      </Card>

      <ItemFormOverlay
        isOpen={isAddOpen}
        onClose={() => setAddOpen(false)}
        onSaved={fetchitems}
      />

      <ItemFormOverlay
        item={editItem}
        isOpen={editItem !== null}
        onClose={() => setEditItem(null)}
        onSaved={fetchitems}
      />
    </UIContentLayout>
  );
};

export default ItemsPage;
