import app from "./src/app.js";
import dotenv from "dotenv";
import cors from "cors";
import router from "./src/routes/task.routes.js";

dotenv.config();
const allowedOrigins = [process.env.CLIENT_APP_URL, "http://localhost:5173"];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

const PORT = process.env.PORT || 8000;
app.get("/", (req, res) => {
  res.status(200).json("App working");
});

app.use("/tasks", router);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
