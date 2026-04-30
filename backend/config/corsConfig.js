const allowedOrigins = process.env.NODE_ENV === "production" 
  ? [
      process.env.FRONTEND_URL,
      "https://yourdomain.com",
      "https://www.yourdomain.com",
    ].filter(Boolean)
  : ["http://localhost:5173", "http://localhost:3000"];

export const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== "production") {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};