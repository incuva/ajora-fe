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
import { useEffect } from "react";
import EmptyItems from "@/components/items/empty-item";
import ItemsDataTable from "@/components/items/table";
import { useItemsTableStore } from "@/stores/items-table.store";
import { ITEMS_FILTERS } from "@/constants/items";

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
  } = useItemsTableStore();

  useEffect(() => {
    fetchitems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <UIContentLayout>
      <Card className="bg-transparent ring-0">
        <CardHeader className="px-0">
          <CardTitle className="font-playfair text-xl font-medium">
            Items
          </CardTitle>
          <CardAction>
            <Button className="bg-green text-white">
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
            filters={ITEMS_FILTERS}
            activeFilter={activeFilter}
            onFilterChange={setFilter}
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            pageSizeOptions={[10, 15, 20, 30, 40]}
          />
        </CardContent>
      </Card>
    </UIContentLayout>
  );
};

export default ItemsPage;
