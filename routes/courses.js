const express = require("express");
const router = express.Router();
const _ = require("lodash");
const authMiddleware = require("../middleware/auth");

const { Course, validate } = require("../models/course");

router.get("/", async (req, res) => {
  res.send(await Course.find().sort("name"));
});

router.post("/", authMiddleware, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const course = new Course(_.pick(req.body, ["name", "code", "credit"]));

  const result = await course.save();
  res.send(result);
});

router.put("/:id", authMiddleware, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const course = await Course.findByIdAndUpdate(
    req.params.id,
    _.pick(req.body, ["name", "code", "credit"]),
    { new: true }
  );

  if (!course)
    return res.status(404).send("The course with the given ID was not found.");

  await course.save();
  res.send(course);
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const course = await Course.findByIdAndDelete(req.params.id);

  if (!course)
    return res.status(404).send("The course with the given ID was not found.");

  res.send(course);
});

module.exports = router;
