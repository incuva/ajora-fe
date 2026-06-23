import React from 'react'
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ChevronsUpDown } from 'lucide-react';

const UserBadge = () => {
  return (
    <section className="w-52 flex justify-between items-center gap-2 p-2 rounded-md border border-gray-300">
      <section className="flex gap-2 items-center">
        <Avatar className="w-9 h-9">
          <AvatarImage
            className="rounded-md"
            src="https://github.com/shadcn.png"
            alt="@shadcn"
          />
          <AvatarFallback>GU</AvatarFallback>
          <AvatarBadge className="bg-green-600" />
        </Avatar>
        <div className="flex flex-col font-inter gap-1">
          <p className="font-bold text-sm text-gray-900">Arme Inc</p>
          <p className="text-xs text-gray-600">Admin</p>
        </div>
      </section>
      <ChevronsUpDown className="w-5 h-5 text-slate-700" />
    </section>
  );
};

export default UserBadge;