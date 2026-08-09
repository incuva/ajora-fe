import { create } from "zustand";
import { getItems, deleteItem } from "@/lib/api/admin-items.service";
import type { Item } from "@/lib/types/item.types";

export type Items = Item;

interface ItemsTableState {
  items: Item[];
  isLoading: boolean;
  page: number;
  pageSize: number;
  total: number;
  activeFilter: string;
  // actions
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setFilter: (filter: string) => void;
  fetchitems: () => Promise<void>;
  removeItem: (id: string) => Promise<void>;
}

export const useItemsTableStore = create<ItemsTableState>((set, get) => ({
  items: [],
  isLoading: false,
  page: 1,
  pageSize: 15,
  total: 0,
  activeFilter: "all",

  setPage: (page) => {
    set({ page });
    get().fetchitems();
  },

  setPageSize: (pageSize) => {
    set({ pageSize, page: 1 });
    get().fetchitems();
  },

  setFilter: (filter) => {
    set({ activeFilter: filter, page: 1 });
    get().fetchitems();
  },

  // GET /admin/items returns the full catalogue (no server pagination), so we
  // hold every item and let the table paginate client-side.
  fetchitems: async () => {
    set({ isLoading: true });
    try {
      const items = await getItems();
      set({ items, total: items.length, isLoading: false });
    } catch {
      set({ items: [], total: 0, isLoading: false });
    }
  },

  // DELETE /admin/item/{id} then drop the row locally.
  removeItem: async (id) => {
    await deleteItem(id);
    set((state) => {
      const items = state.items.filter((i) => i.id !== id);
      return { items, total: items.length };
    });
  },
}));
