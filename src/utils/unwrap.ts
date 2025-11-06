import type { ApiResponse } from "@interfaces/api-response";

function unwrap<T>(envelope: ApiResponse<T>): T {
    if(!envelope.success || envelope.data == null)
        throw new Error(envelope.message || "Houve uma falha na requisição.")

    return envelope.data;
}

export default unwrap;