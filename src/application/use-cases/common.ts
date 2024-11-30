import { ErrorMessage } from "../ports/common";

export interface UseCaseResult<T> {
    result: T;
    errors: ErrorMessage[];
}