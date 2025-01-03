export type InsertedId = string;

export type AffectedEntries = number;

export interface Condition<T extends string = string> {
    field: T;
    value: any;
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