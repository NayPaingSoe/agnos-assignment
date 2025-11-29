export const config = {
  websocket: {
    url: process.env.NEXT_PUBLIC_WS_URL || "http://localhost:8080",
  },
};

export default config;
