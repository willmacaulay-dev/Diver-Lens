import "dotenv/config";
import express from "express";
import cors from "cors";
import { prisma } from "./prisma.js";

const app = express();

app.use((req, res, next) => {
	console.log("INCOMING:", req.method, req.url);
	next();
});

const ORIGIN = process.env.FRONTEND_URL || "*";

app.use(cors({
	origin: ORIGIN,
}));

app.options(/.*/, cors({ origin: ORIGIN }));
app.use(express.json());


app.get("/api/profiles", async (req, res) => {
	const profiles = await prisma.publicProfile.findMany({
		orderBy: { createdAt: "desc" },
	});
	res.json(profiles);
});

app.post("/api/profiles", async (req, res) => {
	const created = await prisma.publicProfile.create({
		data: {
			profileName: req.body.profileName,
			authorName: req.body.authorName,
			animals: req.body.animals,
			settings: req.body.settings,
		},
	});
	res.json(created);
});

app.put("/api/profiles/:id", async (req, res) => {
	const id = Number(req.params.id);
	const updated = await prisma.publicProfile.update({
		where: { id },
		data: {
			profileName: req.body.profileName,
			authorName: req.body.authorName,
			animals: req.body.animals,
			settings: req.body.settings,
		}
	});
	res.json(updated);
});

app.delete("/api/profiles/:id", async (req, res) => {
	const id = Number(req.params.id);
	const deleted = await prisma.publicProfile.delete({ where: { id } });
	res.json(deleted);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API on :${PORT}`));
