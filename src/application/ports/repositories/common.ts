export type InsertedId = string;

export type AffectedEntries = number;

export interface Condition<T extends string = string> {
    field: T;
    value: any;
}