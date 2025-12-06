import mongoose from "mongoose";

export function graceFullyShutDown(signal,server) {
  console.log(
    `-------------------${signal} - Shutting Down Server GraceFully-------------------`
  );
  server.close(() => {
    console.log(`-------------------${signal} - closing http server-------------------`);
    if (mongoose.connection.readyState === 1) {
      mongoose.connection.close(false, () => {
        console.log("MongoDB connection closed.");
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  });
  setTimeout(() => {
    console.error("Forcing shutdown...");
    process.exit(1);
  }, 10000);
}
