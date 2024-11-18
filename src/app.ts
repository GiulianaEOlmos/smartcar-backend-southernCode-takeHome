import express, { Application } from "express";
import dotenv from "dotenv";
import vehicleRoutes from "./../src/routes/vehicleRoutes";

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use("/api", vehicleRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
