import { isAxiosError } from "axios";

export function isApiNotFound(error: unknown): boolean {
  return isAxiosError(error) && error.response?.status === 404;
}

export function isApiConflict(error: unknown): boolean {
  return isAxiosError(error) && error.response?.status === 409;
}
