import { ErrorMessage } from "src/application/ports/common";

export interface ControllerResponse<T> {
    data: T;
    errors: ErrorMessage[]
}