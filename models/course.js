const mongoose = require("mongoose");
const Joi = require("joi");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
    trim: true
  },
  code: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
    trim: true
  },
  credit: {
    type: Number,
    required: true
  },
  conflicts: [
    new mongoose.Schema({
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
      },
      name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255,
        trim: true
      },
      code: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
        trim: true
      }
    })
  ],
  active: {
    type: Boolean,
    default: true
  }
});

exports.courseSchema = schema;

exports.Course = mongoose.model("Course", schema);

exports.validate = function validateGenre(course) {
  const schema = {
    name: Joi.string()
      .min(3)
      .max(255)
      .required(),
    code: Joi.string()
      .min(3)
      .max(50)
      .required(),
    credit: Joi.number()
      .required()
      .positive(),
    conflicts: Joi.array().items(Joi.objectId()),
    active: Joi.boolean()
  };

  return Joi.validate(course, schema);
};
