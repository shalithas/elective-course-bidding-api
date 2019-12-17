const express = require("express");
const router = express.Router();
const _ = require("lodash");
const error = require('../middleware/error');

const { Bid, validate } = require("../models/bid");
const { Class } = require("../models/class");
const { User } = require("../models/user");

router.get("/", async (req, res) => {
  const bids = await Bid.find();
  return res.send(bids);
});

router.post("/", error, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const bidData = _.pick(req.body, "points", "status");

  bidData.user = await User.findById(req.body.userId).select("name email");
  if (!bidData.user) return res.status(400).send("User not found");

  const classData = await Class.findById(req.body.classId).populate(
    "course",
    "name code"
  );
  if (!classData) return res.status(400).send("Class not found");

  bidData.class = {
    _id: classData._id,
    name: classData.name,
    code: classData.code,
    courseName: classData.course.name,
    courseCode: classData.course.code
  };

  const bid = new Bid(bidData);

  return res.send(await bid.save());
});

module.exports = router;
