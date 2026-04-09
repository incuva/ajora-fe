"use client";

import { useEffect } from "react";
import UIContentLayout from "@/components/shared/content-layout";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DataTable from "@/components/shared/data-table/index";
import EmptyPool from "@/components/pools/empty-pool";
import { usePoolsTableStore, type Pool } from "@/stores/pools-table.store";
import { buildColumns, POOL_FILTERS } from "@/constants/pool";

const PoolsPage = () => {
  const {
    pools,
    isLoading,
    page,
    pageSize,
    total,
    activeFilter,
    setPage,
    setPageSize,
    setFilter,
    fetchPools,
  } = usePoolsTableStore();

  useEffect(() => {
    fetchPools();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = buildColumns();

  return (
    <UIContentLayout>
      <Card className="bg-transparent ring-0">
        <CardHeader className="px-0">
          <CardTitle className="font-playfair text-xl font-medium">
            Pools
          </CardTitle>
          <CardAction>
            <Button className="bg-green text-white" size="lg">
              <Plus className="w-4 h-4" /> Create New Pool
            </Button>
          </CardAction>
          <CardDescription className="mt-2" />
        </CardHeader>

        <CardContent className="px-0">
          <DataTable<Pool>
            columns={columns}
            data={pools}
            isLoading={isLoading}
            keyField="id"
            emptyState={<EmptyPool />}
            filters={POOL_FILTERS}
            activeFilter={activeFilter}
            onFilterChange={setFilter}
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </CardContent>
      </Card>
    </UIContentLayout>
  );
};

export default PoolsPage;
