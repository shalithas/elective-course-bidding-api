const express = require("express");
const router = express.Router();
const _ = require("lodash");
const authMiddleware = require("../middleware/auth");

const { Course, validate } = require("../models/course");

router.get("/", async (req, res) => {
  res.send(await Course.find().sort("name"));
});

router.get("/:id", async (req, res) => {
  const course = await Course.findById(req.params.id);
  if(!course) res
                .status(404)
                .send("The Course with the given ID was not found.");

  res.send(course);
});

router.post("/", authMiddleware, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let courseData = _.pick(req.body, ["name", "code", "credit"]);

  if (req.body.conflicts) {
    const conflicts = await Course.find({ _id: { $in: req.body.conflicts } });
    if (error) return res.status(400).send(error.details[0].message);

    courseData.conflicts = conflicts.map(conflict => {
      return _.pick(conflict, ["_id", "name", "code"]);
    });
  }

  const course = new Course(courseData);

  const result = await course.save();
  res.send(result);
});

router.put("/:id", authMiddleware, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const conflicts = await Course.findById(req.body.conflicts);
  console.log(conflicts);
  return res.send(conflicts);

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
