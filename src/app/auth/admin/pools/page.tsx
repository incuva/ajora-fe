"use client";

import { useEffect, useState } from "react";
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
import PoolFormOverlay from "@/components/pools/pool-form-overlay";
import PoolDetailsOverlay, {
  type PoolDetails,
} from "@/components/pools/pool-details-overlay";
import { usePoolsTableStore, type Pool } from "@/stores/pools-table.store";
import { buildColumns, POOL_FILTERS } from "@/constants/pool";

// Sample contributors — replace once the pool-detail endpoint lands.
const MOCK_CONTRIBUTORS = [
  { name: "Adaeze Okoro", slots: 3, paid: true, amount: 36000 },
  { name: "Bola Ahmed", slots: 2, paid: true, amount: 24000 },
  { name: "Chidi Eze", slots: 1, paid: false, amount: 12000 },
];

/** Expand a table Pool into the richer shape the details overlay renders. */
const toPoolDetails = (pool: Pool): PoolDetails => {
  const raised = pool.slotsFilled * pool.slotAmount;
  const target = pool.slotsTotal * pool.slotAmount;
  return {
    name: pool.name,
    description: `${pool.category} pool`,
    status: pool.status,
    raised,
    target,
    slotsTaken: pool.slotsFilled,
    slotsLeft: Math.max(0, pool.slotsTotal - pool.slotsFilled),
    image: "/assets/cow.png",
    item: pool.category,
    quantity: "13kg",
    amountPerSlot: pool.slotAmount,
    createdOn: "April 1st",
    deadline: pool.deadline,
    contributors: MOCK_CONTRIBUTORS,
  };
};

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

  const [isFormOpen, setFormOpen] = useState(false);
  const [selectedPool, setSelectedPool] = useState<PoolDetails | null>(null);

  useEffect(() => {
    fetchPools();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openDetails = (pool: Pool) => setSelectedPool(toPoolDetails(pool));

  const columns = buildColumns({
    onView: openDetails,
    onEdit: openDetails,
  });

  return (
    <UIContentLayout>
      <Card className="bg-transparent ring-0">
        <CardHeader className="px-0">
          <CardTitle className="font-playfair text-xl font-medium">
            Pools
          </CardTitle>
          <CardAction>
            <Button
              className="bg-green text-white"
              size="lg"
              onClick={() => setFormOpen(true)}
            >
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
            emptyState={<EmptyPool onCreate={() => setFormOpen(true)} />}
            filters={POOL_FILTERS}
            activeFilter={activeFilter}
            onFilterChange={setFilter}
            onRowClick={openDetails}
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </CardContent>
      </Card>

      <PoolFormOverlay
        isOpen={isFormOpen}
        onClose={() => setFormOpen(false)}
      />

      <PoolDetailsOverlay
        pool={selectedPool}
        isOpen={selectedPool !== null}
        onClose={() => setSelectedPool(null)}
      />
    </UIContentLayout>
  );
};

export default PoolsPage;
