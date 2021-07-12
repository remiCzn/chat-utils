const http = require("http");

const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

module.exports = class ChatServer extends http.Server {
  /**
   *
   * @param {string} name
   * @param {Express} app
   */
  constructor(name, app, port) {
    super(app);
    this.name = name;
    this.port = normalizePort(process.env.PORT || port);
    app.set("port", port);

    this.on("error", (error) => {
      if (error.syscall !== "listen") {
        throw error;
      }
      const address = this.address();
      const bind =
        typeof address === "string" ? "pipe " + address : "port: " + this.port;
      switch (error.code) {
        case "EACCES":
          this.error(bind + " requires elevated privileges.");
          process.exit(1);
          break;
        case "EADDRINUSE":
          this.error(bind + " is already in use.");
          process.exit(1);
          break;
        default:
          throw error;
      }
    });

    this.on("listening", () => {
      const address = super.address();
      const bind =
        typeof address === "string" ? "pipe " + address : "port " + port;
      this.log("Socket server listening on " + bind);
    });
  }

  listen() {
      super.listen(this.port);
  }

  log(...logs) {
    console.log("[" + this.name + "]-", ...logs);
  }

  error(...error) {
    console.error("[" + this.name + "]-", ...error);
  }

  warn(...warn) {
    console.warn("[" + this.name + "]-", ...warn);
  }
};
