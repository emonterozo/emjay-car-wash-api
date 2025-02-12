export interface ListRequestBody {
  order_by: string;
  date_range?: {
    start: string;
    end: string;
  };
  limit: string;
  offset: string;
}

export interface OrderBy {
  field: string;
  direction: 'desc' | 'asc';
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface PaginationOption extends OrderBy {
  offset: number;
  limit: number;
}

export interface PaginationOptionWithDateRange extends PaginationOption {
  date_range?: {
    start: Date;
    end: Date;
  };
}
