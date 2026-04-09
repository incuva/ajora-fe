"use client";

import EmptyPool from "@/components/pools/empty-pool";
import UIContentLayout from "@/components/shared/content-layout";
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
              <div
                className={`flex justify-center items-center border rounded-full px-2 py-1 cursor-pointer ${activeTab === "all" ? "bg-gold-400 text-green" : "text-gray-900"}`}
                onClick={() => setActiveTab("all")}
              >
                <p>All Pools</p>
              </div>
              <div
                className={`flex justify-center items-center border rounded-full px-2 py-1 cursor-pointer ${activeTab === "active" ? "bg-gold-400 text-green" : "text-gray-900"}`}
                onClick={() => setActiveTab("active")}
              >
                <p>Active</p>
              </div>
              <div
                className={`flex justify-center items-center border rounded-full px-2 py-1 cursor-pointer ${activeTab === "closed" ? "bg-gold-400 text-green" : "text-gray-900"}`}
                onClick={() => setActiveTab("closed")}
              >
                <p>Closed</p>
              </div>
              <div
                className={`flex justify-center items-center border rounded-full px-2 py-1 cursor-pointer ${activeTab === "filled" ? "bg-gold-400 text-green" : "text-gray-900"}`}
                onClick={() => setActiveTab("filled")}
              >
                <p>Filled</p>
              </div>
              <div
                className={`flex justify-center items-center border rounded-full px-2 py-1 cursor-pointer ${activeTab === "distributed" ? "bg-gold-400 text-green" : "text-gray-900"}`}
                onClick={() => setActiveTab("distributed")}
              >
                <p>Distributed</p>
              </div>
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
