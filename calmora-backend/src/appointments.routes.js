const express = require("express");
const { authRequired } = require("./middleware/auth");
const {
  createAppointment,
  listMyAppointments,
  listTherapistAppointments,
  getAppointmentById,
  cancelAppointment,
} = require("./appointments.controller");

const router = express.Router();

router.post("/", authRequired, createAppointment);
router.get("/mine", authRequired, listMyAppointments);
router.get("/therapist", authRequired, listTherapistAppointments);
router.get("/:id", authRequired, getAppointmentById);
router.patch("/:id/cancel", authRequired, cancelAppointment);

module.exports = router;
