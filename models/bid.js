const mongoose = require("mongoose");
const Joi = require("joi");

const schema = new mongoose.Schema({
  class: new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    code: String,
    courseName: String,
    courseCode: String
  }),
  user: new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    email: String
  }),
  points: {
    type: Number,
    min: 1,
    max: 999
  },
  status: {
    type: String,
    enum: ["pending", "enrolled", "dropped"],
    default: "pending"
  }
});

exports.bidSchema = schema;

exports.Bid = mongoose.model("Bid", schema);

exports.validate = function(bid) {
  const schema = {
    classId: Joi.string().required(),
    userId: Joi.string().required(),
    points: Joi.number()
      .min(1)
      .max(999),
    status: Joi.string()
  };

  return Joi.validate(bid, schema);
};
