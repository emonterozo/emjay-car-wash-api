export type InsertedId = string;

export type AffectedEntries = number;

export interface Condition<T extends string = string> {
    field: T;
    value: any; // typeof T[keyof T];
}

export interface OrderBy<T extends string = string> {
    field: T;
    direction: 'desc' | 'asc';
}

export type Offset = number;

export type Limit = number;

export interface Range<T extends string = string> {
    field: T;
    start: any;
    end: any;
}

export interface FindAllOptions<T extends object> {
    limit?: number;
    offset?: number;
    order_by?: OrderBy<keyof T extends string ? keyof T : never>;
    and_conditions?: Condition<keyof T extends string ? keyof T : never>[];
    or_conditions?: Condition<keyof T extends string ? keyof T : never>[];
    not?: Condition<keyof T extends string ? keyof T : never>[];
    range?: Range;
}