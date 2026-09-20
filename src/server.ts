import express from "express";
import {
    getTrainInfo,
    trackTrain,
    searchTrainsBetweenStations,
    getLiveStation,
} from "indian-rail-mcp";

const app = express();
const routes = express.Router();

app.use(express.json());


routes.get("/health", (req, res) => {
    res.json({
        success: true,
        service: "indian-rail-data",
    });
});


routes.get("/train/:trainNumber", async (req, res) => {
    try {
        const { trainNumber } = req.params;

        const [trainInfo, liveData] = await Promise.all([
            getTrainInfo(trainNumber),
            trackTrain(trainNumber),
        ]);

        res.json({
            success: true,
            data: {
                ...trainInfo,

                status: liveData.liveStatus,
            },
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            error: String(error),
        });
    }
});

routes.get("/track/:trainNumber", async (req, res) => {
    try {
        const date = req.query.date as string | undefined;

        const data = await trackTrain(
            req.params.trainNumber,
            date
        );

        res.json({
            success: true,
            data,
        });
    } catch (error) {
        res.status(502).json({
            success: false,
            error: String(error),
        });
    }
});


routes.get("/trains-between", async (req, res) => {
    try {
        const from = req.query.from as string;
        const to = req.query.to as string;

        const data = await searchTrainsBetweenStations(
            from,
            to
        );

        res.json({
            success: true,
            data,
        });
    } catch (error) {
        res.status(502).json({
            success: false,
            error: String(error),
        });
    }
});


routes.get("/station/:stationCode", async (req, res) => {
    try {
        const data = await getLiveStation(
            req.params.stationCode
        );

        res.json({
            success: true,
            data,
        });
    } catch (error) {
        res.status(502).json({
            success: false,
            error: String(error),
        });
    }
});

app.get("/debug-ntes", async (req, res) => {
    try {
        const response = await fetch(
            "https://enquiry.indianrail.gov.in/"
        );

        res.json({
            success: true,
            status: response.status,
            statusText: response.statusText
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : String(error),
            cause:
                error instanceof Error
                    ? String(error.cause)
                    : null
        });
    }
});

routes.get("/debug-ntes", async (_req, res) => {
    const url = "https://enquiry.indianrail.gov.in/";

    try {
        const response = await fetch(url, {
            signal: AbortSignal.timeout(10_000),
            headers: {
                "user-agent": "node-railway-debug/1.0",
            },
        });

        res.status(response.ok ? 200 : 502).json({
            success: response.ok,
            requestedUrl: url,
            finalUrl: response.url,
            status: response.status,
            statusText: response.statusText,
            contentType: response.headers.get("content-type"),
            contentLength: response.headers.get("content-length"),
        });
    } catch (error) {
        res.status(502).json({
            success: false,
            requestedUrl: url,
            error: error instanceof Error ? error.message : String(error),
            name: error instanceof Error ? error.name : null,
            cause: error instanceof Error && error.cause
                ? String(error.cause)
                : null,
        });
    }
});

// Locally, routes are served from `/`. Vercel invokes serverless functions
// under `/api`, so support that base path as well.
app.use(routes);
app.use("/api", routes);

export default app;

// Vercel imports this module as a serverless handler, so it must not open a
// long-running HTTP listener there. Local development still uses port 3001.
if (!process.env.VERCEL) {
    app.listen(3001, () => {
        console.log("Indian Rail data service running on port 3001");
    });
}

