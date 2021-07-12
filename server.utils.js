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
    this.InitialiseDebugMsg();
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
      this.log(name + " server listening on " + bind);
    });
  }

  listen() {
      super.listen(this.port);
  }

  InitialiseDebugMsg() {
    console.oldLog = console.log;
    console.oldError = console.error;
    console.oldWarn = console.warn;
    
    let channelName = this.name;

    console.log = (...logs) => this.log(...logs);
    console.warn = (...warn) => this.warn(...warn);
    console.error = (...err) => this.error(...err);
  }

  log(...logs) {
    console.oldLog("["+this.name+"]",...logs)
  }

  warn(...warn) {
    console.oldWarn('['+this.name+"]", ...warn)
  }

  error(...err) {
    console.oldError('['+this.name+"]", ...err)
  }
};
