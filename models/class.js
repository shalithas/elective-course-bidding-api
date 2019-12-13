const mongoose = require("mongoose");
const Joi = require("joi");
const { courseSchema } = require("./course");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 20,
    trim: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  },
  instructor: {
    type: String,
    minlength: 3,
    maxlength: 255
  },
  assitant: {
    type: String,
    minlength: 3,
    maxlength: 255
  },
  waitlist: {
    type: Boolean,
    default: true
  },
  term: {
    type: String,
    required: true,
    min: 2,
    max: 6
  },
  period: {
    type: String,
    required: true,
    min: 2,
    max: 6
  },
  active: {
    type: Boolean,
    default: true
  }
});

exports.classSchema = schema;

exports.Class = mongoose.model("Class", schema);

exports.validate = function(classData) {
  const schema = {
    name: Joi.string()
      .min(2)
      .max(20)
      .required(),
    courseId: Joi.objectId().required(),
    instructor: Joi.string()
      .min(3)
      .max(255),
    assitant: Joi.string()
      .min(3)
      .max(255),
    waitlist: Joi.boolean(),
    term: Joi.string()
      .required()
      .min(2)
      .max(6),
    period: Joi.string()
      .required()
      .min(2)
      .max(6),
    active: Joi.boolean()
  };

  return Joi.validate(classData, schema);
};
