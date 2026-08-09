export interface Item {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  unit: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateItemPayload {
  name: string;
  unit: string;
  description?: string;
  imageUrl?: string;
}

// PUT /admin/item/{id} accepts any subset of the create fields.
export type UpdateItemPayload = Partial<CreateItemPayload>;
