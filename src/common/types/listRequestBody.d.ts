export interface ListRequestBody {
  order_by: string;
  limit: number;
  offset: number;
}

export interface OrderBy {
  field: string;
  direction: 'desc' | 'asc';
}

export interface PaginationOption extends OrderBy {
  offset: number;
  limit: number;
}
