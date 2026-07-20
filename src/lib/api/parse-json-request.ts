import { MAX_JSON_REQUEST_BYTES } from "@/lib/deal-limits";

export type JsonRequestFailureReason =
  | "malformed_json"
  | "payload_too_large"
  | "unsupported_media_type";

type JsonRequestResult =
  | { success: true; data: unknown }
  | { success: false; reason: JsonRequestFailureReason };

const jsonRequestErrors: Record<
  JsonRequestFailureReason,
  { message: string; status: 400 | 413 | 415 }
> = {
  malformed_json: { message: "Malformed JSON", status: 400 },
  payload_too_large: { message: "Request body is too large", status: 413 },
  unsupported_media_type: {
    message: "Content-Type must be application/json",
    status: 415,
  },
};

function hasJsonContentType(request: Request): boolean {
  const contentType = request.headers.get("content-type");

  if (!contentType) {
    return false;
  }

  const mediaType = contentType.split(";", 1)[0]?.trim().toLowerCase() ?? "";

  return mediaType === "application/json" || mediaType.endsWith("+json");
}

export function getJsonRequestError(reason: JsonRequestFailureReason) {
  return jsonRequestErrors[reason];
}

export async function parseJsonRequest(
  request: Request,
  maxBytes = MAX_JSON_REQUEST_BYTES,
): Promise<JsonRequestResult> {
  if (!hasJsonContentType(request)) {
    return { success: false, reason: "unsupported_media_type" };
  }

  const declaredLength = Number(request.headers.get("content-length"));

  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    return { success: false, reason: "payload_too_large" };
  }

  if (!request.body) {
    return { success: false, reason: "malformed_json" };
  }

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let body = "";
  let bytesRead = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      bytesRead += value.byteLength;

      if (bytesRead > maxBytes) {
        await reader.cancel();
        return { success: false, reason: "payload_too_large" };
      }

      body += decoder.decode(value, { stream: true });
    }

    body += decoder.decode();

    return { success: true, data: JSON.parse(body) };
  } catch {
    return { success: false, reason: "malformed_json" };
  } finally {
    reader.releaseLock();
  }
}
