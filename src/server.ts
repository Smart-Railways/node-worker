import express from "express";
import {
    getTrainInfo,
    trackTrain,
    searchTrainsBetweenStations,
    getLiveStation,
} from "indian-rail-mcp";

const app = express();

app.use(express.json());


app.get("/health", (req, res) => {
    res.json({
        success: true,
        service: "indian-rail-data",
    });
});


app.get("/train/:trainNumber", async (req, res) => {
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

app.get("/track/:trainNumber", async (req, res) => {
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


app.get("/trains-between", async (req, res) => {
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


app.get("/station/:stationCode", async (req, res) => {
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


export default app;

// Vercel imports this module as a serverless handler, so it must not open a
// long-running HTTP listener there. Local development still uses port 3001.
if (!process.env.VERCEL) {
    app.listen(3001, () => {
        console.log("Indian Rail data service running on port 3001");
    });
}
