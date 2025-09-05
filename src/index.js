import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

// Export the app for Vercel
export default app;

// Start server only if not in Vercel environment
if (process.env.NODE_ENV !== "production" || process.env.VERCEL !== "1") {
  connectDB()
    .then(() => {
      app.listen(process.env.PORT || 8000, () => {
        console.log("Server is running at PORT:", process.env.PORT || 8000);
      });
    })
    .catch((error) => {
      console.log("MONGODB connection failed  | ", error);
    });
}

// const app = express()(async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//     app.on("error", (err) => {
//       console.log("ERR", err);
//       throw err;
//     });
//     app.listen(process.env.PORT, () => {
//       console.log("App is listening on port ", process.env.PORT);
//     });
//   } catch (err) {
//     console.log("Error", err);
//     throw err;
//   }
// })();
