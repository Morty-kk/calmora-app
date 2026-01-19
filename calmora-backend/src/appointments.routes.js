const express = require("express");
const { authRequired } = require("./middleware/auth");
const {
  createAppointment,
  listMyAppointments,
  listTherapistAppointments,
} = require("./appointments.controller");

const router = express.Router();

router.post("/", authRequired, createAppointment);
router.get("/mine", authRequired, listMyAppointments);
router.get("/therapist", authRequired, listTherapistAppointments);

module.exports = router;
