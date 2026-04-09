"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GoArrowUpRight } from "react-icons/go";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AppsListRegular } from "@fluentui/react-icons";
import UIContentLayout from "@/components/shared/content-layout";
import StatsCard from "@/components/shared/stats-card";

const OverviewPage = () => {
  return (
    <UIContentLayout>
      <div className="w-full flex flex-col gap-4">
        <Card className="bg-transparent ring-0 pt-0">
          <CardHeader className="px-0">
            <CardTitle className="font-playfair text-xl font-medium">
              Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-0">
            <StatsCard
              title="Total Active Pools"
              value="--"
              change="- -"
              icon={<GoArrowUpRight className="w-5 h-5 text-green" />}
            />
            <StatsCard
              title="Total Revenue"
              value="--"
              change="- -"
              icon={<GoArrowUpRight className="w-5 h-5 text-green" />}
            />
            <StatsCard
              title="New Users"
              value="--"
              change="- -"
              icon={<GoArrowUpRight className="w-5 h-5 text-green" />}
            />
            <StatsCard
              title="Pending Orders"
              value="--"
              change="- -"
              icon={<GoArrowUpRight className="w-5 h-5 text-green" />}
            />
          </CardContent>
        </Card>

        <Card className="bg-transparent ring-0">
          <CardHeader className="px-0">
            <CardTitle className="font-playfair text-lg font-medium">
              Recent Activities
            </CardTitle>
            <CardAction>
              <Button className="text-sm text-green" variant="link">
                See All
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="px-0">
            <div className="bg-white h-80 rounded-2xl flex justify-center items-center font-inter">
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="border border-gray-200 p-2 rounded-md">
                  <AppsListRegular className="w-6 h-6 text-gray-400" />
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
    </UIContentLayout>
  );
};

export default OverviewPage;
