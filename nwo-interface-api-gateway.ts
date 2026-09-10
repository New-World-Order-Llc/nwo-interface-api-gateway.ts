import { ProjectionQuerySchema } from "beast-contracts/interface";
import { readCache } from "../data/ProjectionCache";
import { publishEvent } from "../data/EventPublisher";

export class ApiGateway {
  handle(queryEnvelope) {
    const valid = ProjectionQuerySchema.safeParse(queryEnvelope);
    if (!valid.success) throw new Error("Invalid projection query envelope");

    const { entity, requestId } = valid.data;

    const projection = readCache(entity);

    const response = {
      id: crypto.randomUUID(),
      requestId,
      entity,
      projection,
      respondedAt: new Date().toISOString()
    };

    publishEvent("interface.api.responded", response);
    return response;
  }
}
