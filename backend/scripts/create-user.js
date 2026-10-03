#!/usr/bin/env node
/**
 * Creates a user, or resets an existing user's password and role.
 *
 *   npm run create-user -- --email you@example.com --password "a long password" [--role admin|editor] [--name "Your Name"]
 */
import { parseArgs } from "node:util";
import "../models/index.js";
import { connectDatabase, disconnectDatabase } from "../config/db.js";
import { ROLES } from "../models/User.js";
import { upsertUser } from "../services/authService.js";

const { values } = parseArgs({
  options: {
    email: { type: "string" },
    password: { type: "string" },
    role: { type: "string", default: "admin" },
    name: { type: "string" },
  },
});

if (!values.email || !values.password || !ROLES.includes(values.role)) {
  console.error(`Usage: npm run create-user -- --email <email> --password <password> [--role ${ROLES.join("|")}] [--name <name>]`);
  process.exit(1);
}

try {
  await connectDatabase();
  const user = await upsertUser(values);
  console.log(`Saved ${user.role} ${user.email}. Existing sessions for this user were signed out.`);
} catch (err) {
  console.error(`Could not save the user: ${err.message}`);
  process.exitCode = 1;
} finally {
  await disconnectDatabase();
}
