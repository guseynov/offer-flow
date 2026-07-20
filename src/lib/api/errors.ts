import { isAxiosError } from "axios";

export function isApiNotFound(error: unknown): boolean {
  return isAxiosError(error) && error.response?.status === 404;
}

