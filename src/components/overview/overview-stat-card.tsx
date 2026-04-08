import React from 'react'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '../ui/card'

interface OverviewStatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
}

const OverviewStatCard = ({ title, value, change, icon }: OverviewStatCardProps) => {
  return (
    <Card className="col-span-1 bg-white py-3 px-1 rounded-md shadow-none">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-gray-900">{title}</CardTitle>
        <CardAction className="p-1 rounded-full bg-gold-light">
          {icon}
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-3xl font-bold text-gray-700 font-playfair">{value}</p>
        <p className="text-xs font-normal text-green-600">{change}</p>
      </CardContent>
    </Card>
  )
}

export default OverviewStatCard