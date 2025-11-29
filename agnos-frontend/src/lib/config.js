export const config = {
  websocket: {
    url:
      process.env.NEXT_PUBLIC_WS_URL ||
      "https://agnos-websocket-production.up.railway.app",
    // "http://localhost:8080",
  },
};

export default config;
