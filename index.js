import express        from "express";
import cors           from "cors";
import ProvinceRouter from "./src/controllers/province-controller.js";
import AuthRouter     from "./src/controllers/auth-controller.js";
import verifyToken    from "./src/middlewares/jwt-middleware.js";

const app  = express();
const port = 3000;

// ── Middlewares globales ──────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Rutas públicas (no requieren token) ──────────────────────────────────────
app.use("/api/auth", AuthRouter);

// ── Rutas protegidas (requieren JWT válido) ───────────────────────────────────
app.use("/api/province", verifyToken, ProvinceRouter);

// ── Inicio del server ─────────────────────────────────────────────────────────
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
