import { ErrorMessage } from '../../application/ports/common';

export interface ControllerResponse<T> {
  data: T;
  errors: ErrorMessage[];
}
