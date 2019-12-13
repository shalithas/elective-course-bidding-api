const express = require("express");
const router = express.Router();
const _ = require("lodash");
const authMiddleware = require("../middleware/auth");

const { Class, validate } = require("../models/class");
const { Course } = require("../models/course");

router.get("/", async (req, res) => {
  res.send(
    await Class.find()
      .sort("name")
      .populate("course", "name code")
  );
});

router.get("/:id", async (req, res) => {
  const classOb = await Class.findById(req.params.id).populate(
    "course",
    "name code"
  );
  if (!classOb)
    res.status(404).send("The Class with the given ID was not found.");

  res.send(classOb);
});

router.post("/", authMiddleware, async (req, res) => {
  let classData = _.pick(req.body, [
    "name",
    "instructor",
    "assitant",
    "waitlist",
    "term",
    "period",
    "active"
  ]);

  const course = await Course.findById(req.body.courseId);
  if (!course)
    return res.status(400).send("The course with given ID was not found");

  classData.course = course;

  const { error } = validate(classData);
  if (error) return res.status(400).send(error.details[0]);

  const classOb = new Class(classData);

  const result = await classOb.save();
  res.send(result);
});

router.put("/:id", authMiddleware, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let classData = _.pick(req.body, [
    "name",
    "instructor",
    "assitant",
    "waitlist",
    "term",
    "period",
    "active"
  ]);

  const course = await Course.findById(req.body.courseId);
  if (!course)
    return res.status(400).send("The course with given ID was not found");

  classData.course = course;

  const classOb = await Class.findByIdAndUpdate(req.params.id, classData, {
    new: true
  });

  if (!classOb)
    return res.status(404).send("The class with the given ID was not found.");

  await classOb.save();
  res.send(classOb);
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const classOb = await Class.findByIdAndDelete(req.params.id);

  if (!classOb)
    return res.status(404).send("The course with the given ID was not found.");

  res.send(classOb);
});

module.exports = router;
