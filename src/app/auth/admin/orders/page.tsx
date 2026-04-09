import UIContentLayout from "@/components/shared/content-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatsCard from "@/components/shared/stats-card";
import { GoArrowUpRight } from "react-icons/go";

const OrdersPage = () => {
  return (
    <UIContentLayout>
      <div className="w-full flex flex-col gap-4 p-2">
        <Card className="bg-transparent ring-0 pt-0">
          <CardHeader>
            <CardTitle className="font-playfair text-xl font-medium">
              Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <StatsCard
              title="Total Active Orders"
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
              title="Cancelled Orders"
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
      </div>
    </UIContentLayout>
  );
};

export default OrdersPage;
