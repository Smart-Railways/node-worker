import type { IncomingMessage, ServerResponse } from "node:http";
import app from "../src/server.js";

/**
 * Vercel invokes this catch-all Node.js function under `/api`. Strip that
 * internal prefix so Express receives the public route (`/health`, `/train`,
 * and so on).
 */
export default function handler(req: IncomingMessage, res: ServerResponse) {
    if (req.url?.startsWith("/api/")) {
        req.url = req.url.slice(4);
    } else if (req.url === "/api") {
        req.url = "/";
    }

    return app(req, res);
}
