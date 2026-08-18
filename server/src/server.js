import "dotenv/config";

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    //--->>> CONNECT DATABASE

    await connectDB();

    //--->>> START SERVER

    app.listen(PORT, () => {
      console.log(`Heliosyn AI server running on port ${PORT}`);

      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);

    process.exit(1);
  }
};

startServer();
