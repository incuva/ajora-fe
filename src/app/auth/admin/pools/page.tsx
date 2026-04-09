"use client";

import EmptyPool from "@/components/pools/empty-pool";
import UIContentLayout from "@/components/shared/content-layout";
import ListFilterBadge from "@/components/shared/list-filter-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useState } from "react";

const PoolsPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  return (
    <UIContentLayout>
      <Card className="bg-transparent ring-0">
        <CardHeader>
          <CardTitle className="font-playfair text-xl font-medium">
            Pools
          </CardTitle>
          <CardAction>
            <Button className="bg-green text-white">
              <Plus className="w-4 h-4" /> Create New Pool
            </Button>
          </CardAction>
          <CardDescription className="mt-2">
            <div className="flex items-center gap-4">
              <ListFilterBadge
                active={activeTab === "all"}
                onClick={() => setActiveTab("all")}
                label="All Pools"
              />
              <ListFilterBadge
                active={activeTab === "active"}
                onClick={() => setActiveTab("active")}
                label="Active"
              />
              <ListFilterBadge
                active={activeTab === "closed"}
                onClick={() => setActiveTab("closed")}
                label="Closed"
              />
              <ListFilterBadge
                active={activeTab === "filled"}
                onClick={() => setActiveTab("filled")}
                label="Filled"
              />
              <ListFilterBadge
                active={activeTab === "distributed"}
                onClick={() => setActiveTab("distributed")}
                label="Distributed"
              />
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <section>
            <EmptyPool />
          </section>
        </CardContent>
      </Card>
    </UIContentLayout>
  );
};

export default PoolsPage;
