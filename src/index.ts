import dotenv from "dotenv";

dotenv.config();
// eslint-disable-next-line import/first
import { initializeServer } from "./server/index";
// eslint-disable-next-line import/first
import initializeMongoDBServer from "./database/index";

const port = process.env.PORT ?? process.env.LOCAL_PORT ?? 5000;

(async () => {
  try {
    await initializeServer(+port);
    await initializeMongoDBServer(process.env.MONGODB_STRING);
  } catch {
    process.exit(1);
  }
})();
