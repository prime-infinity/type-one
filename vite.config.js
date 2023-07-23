import dotenv from "dotenv";
dotenv.config();

export default {
  define: {
    "process.env.VITE_ACCESS_TOKEN": JSON.stringify(
      process.env.VITE_ACCESS_TOKEN
    ),
  },
};
