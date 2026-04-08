import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GoArrowUpRight } from "react-icons/go";
import OverviewStatCard from "@/components/overview/overview-stat-card";
import { Button } from "@/components/ui/button";
import { TbApps } from "react-icons/tb";
import { Plus } from "lucide-react";

const OverviewPage = () => {
  return (
    <main className="w-full h-full px-3 py-1">
      <div className="w-full flex flex-col gap-4 p-2">
        <Card className="bg-transparent ring-0 pt-0">
          <CardHeader>
            <CardTitle className="font-playfair text-xl font-medium">
              Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-4 gap-4">
            <OverviewStatCard
              title="Total Active Pools"
              value="--"
              change="- -"
              icon={<GoArrowUpRight className="w-5 h-5 text-green" />}
            />
            <OverviewStatCard
              title="Total Revenue"
              value="--"
              change="- -"
              icon={<GoArrowUpRight className="w-5 h-5 text-green" />}
            />
            <OverviewStatCard
              title="New Users"
              value="--"
              change="- -"
              icon={<GoArrowUpRight className="w-5 h-5 text-green" />}
            />
            <OverviewStatCard
              title="Pending Orders"
              value="--"
              change="- -"
              icon={<GoArrowUpRight className="w-5 h-5 text-green" />}
            />
          </CardContent>
        </Card>

        <Card className="bg-transparent ring-0">
          <CardHeader>
            <CardTitle className="font-playfair text-lg font-medium">
              Recent Activities
            </CardTitle>
            <CardAction>
              <Button className="text-sm text-green" variant="link">
                See All
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="bg-white h-80 rounded-2xl flex justify-center items-center font-inter">
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="border border-gray-200 p-2 rounded-md">
                  <TbApps className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-lg font-bold text-green">
                  No Activities Yet
                </p>

                <p className="text-xs text-gray-800">
                  Add an item to your inventory to get started
                </p>
                <Button className="text-white bg-green" size="lg">
                  <Plus /> Add an Item
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default OverviewPage;
