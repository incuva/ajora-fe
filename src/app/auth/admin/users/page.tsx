"use client";

import UIContentLayout from '@/components/shared/content-layout';
import { useState } from 'react'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ListFilterBadge from '@/components/shared/list-filter-badge';
import EmptyUsers from '@/components/users/empty-users';

const UsersPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [activeMenu, setActiveMenu] = useState("buyers")
  return (
    <UIContentLayout>
      <Card className="bg-transparent ring-0">
        <CardHeader>
          <CardTitle className="font-playfair text-xl font-medium">
            Users
          </CardTitle>
          <CardAction className='flex gap-2'>
            <Button className="bg-gold-400 text-green" size={"lg"}>
              <Plus className="w-4 h-4" /> Share Link
            </Button>
            <Button className="bg-green text-white" size={"lg"}>
              <Plus className="w-4 h-4" /> Add a User
            </Button>
          </CardAction>
          <CardDescription className="mt-2 flex flex-col gap-3">
            <div className="flex items-center gap-1 border w-fit p-1 bg-white font-inter rounded-lg">
              <div className={`text-gray-900 p-2 rounded-md cursor-pointer ${activeMenu === "buyers" && "bg-gold-100"}`} onClick={() => setActiveMenu("buyers")}><p className="font-playfair">Buyers</p></div>
              <div className={`text-gray-900 p-2 rounded-md cursor-pointer ${activeMenu === "admins" && "bg-gold-100"}`} onClick={() => setActiveMenu("admins")}><p className="font-playfair">Admins</p></div>
            </div>
            <div className="flex items-center gap-4">
              <ListFilterBadge
                active={activeTab === "all"}
                onClick={() => setActiveTab("all")}
                label="All Users"
              />
              <ListFilterBadge
                active={activeTab === "active"}
                onClick={() => setActiveTab("active")}
                label="Active"
              />
              <ListFilterBadge
                active={activeTab === "flagged"}
                onClick={() => setActiveTab("flagged")}
                label="Flagged"
              />
              <ListFilterBadge
                active={activeTab === "suspended"}
                onClick={() => setActiveTab("suspended")}
                label="Suspended"
              />
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Card className="ring-0">
            <EmptyUsers />
          </Card>
        </CardContent>
      </Card>
    </UIContentLayout>
  );
}

export default UsersPage