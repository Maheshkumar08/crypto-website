/**
 * Startup file for cPanel "Setup Node.js App" (Phusion Passenger).
 *
 * Passenger starts an app with require(startupFile). server.js is an ES
 * module, which require() can't load on many Node 20/22 releases
 * (ERR_REQUIRE_ESM), so Passenger is pointed at this CommonJS file, which
 * loads server.js with import(). Passenger then takes over the server's
 * listen() call (server.js listens on "passenger").
 */
import("./server.js").catch((err) => {
  console.error("[passenger] could not load server.js:", err);
  process.exit(1);
});
