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
import PoolEditOverlay from "@/components/pools/pool-edit-overlay";
import PoolDetailsOverlay from "@/components/pools/pool-details-overlay";
import SubpoolFormOverlay from "@/components/pools/subpool-form-overlay";
import { buildColumns, normalizePoolStatus, POOL_FILTERS } from "@/constants/pool";
import { getPools } from "@/lib/api/marketplace.service";
import type { Pool, Subpool } from "@/lib/types/marketplace.types";
import { useToastStore } from "@/stores/toast-store";

const PoolsPage = () => {
  const { toastError } = useToastStore();
  const [pools, setPools] = useState<Pool[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  // Overlay state — the selected real Pool drives every write endpoint.
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [detailsPool, setDetailsPool] = useState<Pool | null>(null);
  const [editPool, setEditPool] = useState<Pool | null>(null);
  const [subpoolTarget, setSubpoolTarget] = useState<{
    poolId: string;
    subpool: Subpool | null;
  } | null>(null);

  const fetchPoolsData = async () => {
    setIsLoading(true);
    try {
      const data = await getPools();
      setPools(data);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err as Error)?.message ||
        "Could not load pools.";
      toastError("Load failed", message);
      setPools([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPoolsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = buildColumns({
    onView: setDetailsPool,
    onEdit: setEditPool,
    onAddSubpool: (pool) => setSubpoolTarget({ poolId: pool.id, subpool: null }),
  });

  // Client-side filter (the API returns all pools; no server pagination yet).
  const filteredPools = pools.filter((p) => {
    if (activeFilter === "all") return true;
    return normalizePoolStatus(p.status) === activeFilter;
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
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="w-4 h-4" /> Create New Pool
            </Button>
          </CardAction>
          <CardDescription className="mt-2" />
        </CardHeader>

        <CardContent className="px-0">
          <DataTable<Pool>
            columns={columns}
            data={filteredPools}
            isLoading={isLoading}
            keyField="id"
            emptyState={<EmptyPool onCreate={() => setCreateOpen(true)} />}
            filters={POOL_FILTERS}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            onRowClick={setDetailsPool}
            page={1}
            pageSize={filteredPools.length || 1}
            total={filteredPools.length}
            onPageChange={() => {}}
            onPageSizeChange={() => {}}
          />
        </CardContent>
      </Card>

      {/* Create */}
      <PoolFormOverlay
        isOpen={isCreateOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={fetchPoolsData}
      />

      {/* View → GET /user/pools (list) + subpool/edit entry points */}
      <PoolDetailsOverlay
        pool={detailsPool}
        isOpen={detailsPool !== null}
        onClose={() => setDetailsPool(null)}
        onEditPool={(pool) => {
          setDetailsPool(null);
          setEditPool(pool);
        }}
        onAddSubpool={(pool) => {
          setDetailsPool(null);
          setSubpoolTarget({ poolId: pool.id, subpool: null });
        }}
        onEditSubpool={(pool, subpool) => {
          setDetailsPool(null);
          setSubpoolTarget({ poolId: pool.id, subpool });
        }}
      />

      {/* Edit → PUT /admin/pool/{id} */}
      <PoolEditOverlay
        pool={editPool}
        isOpen={editPool !== null}
        onClose={() => setEditPool(null)}
        onUpdated={fetchPoolsData}
      />

      {/* Add/Edit subpool */}
      <SubpoolFormOverlay
        isOpen={subpoolTarget !== null}
        onClose={() => setSubpoolTarget(null)}
        poolId={subpoolTarget?.poolId ?? null}
        subpool={subpoolTarget?.subpool ?? null}
        onSaved={fetchPoolsData}
      />
    </UIContentLayout>
  );
};

export default PoolsPage;
