require("express-async-errors");
const winston = require("winston");
const { format, transports } = winston;
require("winston-mongodb");

module.exports = function() {
  winston.add(new transports.File({ filename: "logs/combined.log" }));
  winston.add(
    new transports.MongoDB({
      db: "mongodb://localhost/electiveCourseBidding",
      level: "error"
    })
  );

  winston.exceptions.handle(
    new transports.Console({
      format: format.combine(
        format.timestamp(),
        format.colorize(),
        format.simple()
      )
    }),
    new transports.File({ filename: "logs/unhandledexceptions.log" })
  );

  process.on("unhandledRejection", ex => {
    throw ex;
  });
};
