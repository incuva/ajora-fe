import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GoArrowUpRight } from "react-icons/go";
import OverviewStatCard from "@/components/overview/overview-stat-card";

const OverviewPage = () => {
  return (
    <main className="w-full h-full p-4">
      <ScrollArea className="h-full w-full rounded-md p-2">
        <div className="flex flex-col gap-4 p-2">
          <Card className="border-none">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
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

          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Card Content</p>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </main>
  );
};

export default OverviewPage;
