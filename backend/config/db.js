import mongoose from "mongoose";
import { config, envFile } from "./env.js";

mongoose.set("strictQuery", true);
// Never queue queries while disconnected: a query either runs or fails at
// once (no "buffering timed out after 10000ms" on the first request).
mongoose.set("bufferCommands", false);
// Collections and indexes are created once connected (connectDatabase),
// not when a model is defined — that would run before the connection.
mongoose.set("autoCreate", false);
mongoose.set("autoIndex", false);

/** Explains the usual causes of a failed connection in plain words. */
function explain(err) {
  const text = `${err?.name || ""} ${err?.message || ""} ${err?.cause?.message || ""}`;
  if (/ENOTFOUND|querySrv|EAI_AGAIN/i.test(text)) return "the database host name could not be resolved — check the cluster address in MONGODB_URI.";
  if (/ECONNREFUSED/i.test(text)) return "nothing is listening at that address — is MongoDB running (local), or is the host/port in MONGODB_URI right?";
  if (/bad auth|Authentication failed|auth failed/i.test(text)) return "the username or password in MONGODB_URI was rejected.";
  if (/whitelist|IP.*not allowed|ReplicaSetNoPrimary|Server selection timed out/i.test(text)) {
    return "the server could not be reached in time. For MongoDB Atlas, add this machine's IP under Network Access.";
  }
  if (/Invalid scheme|Invalid connection string|URI/i.test(text)) return 'MONGODB_URI is not a valid connection string (it starts with "mongodb://" or "mongodb+srv://").';
  return err?.message || String(err);
}

/**
 * Connects before the server starts. Throws (with an explanation) after
 * DB_CONNECT_ATTEMPTS failed attempts, so the process never runs without a
 * database.
 */
export async function connectDatabase() {
  if (!config.mongoUri) {
    throw new Error(`MONGODB_URI is not set. Add your MongoDB connection string to ${envFile}, e.g.\n  MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/cryptolearner\n  MONGODB_URI=mongodb://127.0.0.1:27017/cryptolearner`);
  }

  let lastError;
  for (let attempt = 1; attempt <= config.dbConnectAttempts; attempt += 1) {
    try {
      await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 10000 });
      // Unique slugs, emails and card ids are enforced by these indexes.
      await Promise.all(Object.values(mongoose.models).map((model) => model.createIndexes()));
      console.log(`[db] connected to MongoDB database "${mongoose.connection.name}"`);
      connectedOnce = true;
      return mongoose.connection;
    } catch (err) {
      lastError = err;
      console.error(`[db] connection attempt ${attempt}/${config.dbConnectAttempts} failed: ${explain(err)}`);
      if (attempt < config.dbConnectAttempts) await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
    }
  }
  throw new Error(`Could not connect to MongoDB: ${explain(lastError)}`);
}

export function isDatabaseReady() {
  return mongoose.connection.readyState === 1;
}

export async function disconnectDatabase() {
  closing = true;
  await mongoose.disconnect();
}

// After a successful start Mongoose reconnects by itself; say so in the log
// (failed first attempts are reported by connectDatabase instead).
let connectedOnce = false;
let closing = false;
mongoose.connection.on("disconnected", () => {
  if (connectedOnce && !closing) console.error("[db] lost the connection to MongoDB — reconnecting…");
});
mongoose.connection.on("reconnected", () => console.log("[db] reconnected to MongoDB"));
