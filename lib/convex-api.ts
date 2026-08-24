import { anyApi } from "convex/server";

// Convex's generated runtime API is the same `anyApi` proxy. The backend
// remains in acedzn-tools, while this standalone frontend only needs the
// client-side function references.
export const api = anyApi;
