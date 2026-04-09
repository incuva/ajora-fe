"use client";

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
import EmptyItems from "@/components/items/empty-item";

const ItemsPage = () => {
  const [activeTab, setActiveTab] = useState("all");
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
          <CardDescription className="mt-2">
            <div className="flex items-center gap-4">
              <ListFilterBadge
                active={activeTab === "all"}
                onClick={() => setActiveTab("all")}
                label="All Items"
              />
              <ListFilterBadge
                active={activeTab === "meat"}
                onClick={() => setActiveTab("meat")}
                label="Meat"
              />
              <ListFilterBadge
                active={activeTab === "frozen"}
                onClick={() => setActiveTab("frozen")}
                label="Frozen Food"
              />
              <ListFilterBadge
                active={activeTab === "grains"}
                onClick={() => setActiveTab("grains")}
                label="Grains"
              />
              <ListFilterBadge
                active={activeTab === "tubers"}
                onClick={() => setActiveTab("tubers")}
                label="Tubers"
              />
              <ListFilterBadge
                active={activeTab === "livestocks"}
                onClick={() => setActiveTab("livestocks")}
                label="Livestocks"
              />
              <ListFilterBadge
                active={activeTab === "proteins"}
                onClick={() => setActiveTab("proteins")}
                label="Proteins"
              />
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <section>
            <EmptyItems />
          </section>
        </CardContent>
      </Card>
    </UIContentLayout>
  );
};

export default ItemsPage;
