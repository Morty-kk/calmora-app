const prisma = require("./prisma");

async function createAppointment(req, res) {
  try {
    const patientId = req.user.id;
    const { startsAt, note } = req.body;

    if (!startsAt) return res.status(400).json({ error: "startsAt is required" });

    const therapist = await prisma.user.findUnique({
      where: { email: "therapist@example.com" },
      select: { id: true },
    });

    if (!therapist) return res.status(404).json({ error: "Therapist not found" });

    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        therapistId: therapist.id,
        startsAt: new Date(startsAt),
        note: note ?? null,
        status: "BOOKED",
      },
    });

    res.json({ appointment });
  } catch (e) {
    console.error("createAppointment error:", e);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function listMyAppointments(req, res) {
  try {
    const patientId = req.user.id;

    const items = await prisma.appointment.findMany({
      where: { patientId },
      orderBy: { startsAt: "asc" },
      include: { therapist: { select: { id: true, email: true, name: true } } },
    });

    res.json({ items });
  } catch (e) {
    console.error("listMyAppointments error:", e);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function listTherapistAppointments(req, res) {
  try {
    const therapistId = req.user.id;

    const items = await prisma.appointment.findMany({
      where: { therapistId },
      orderBy: { startsAt: "asc" },
      include: { patient: { select: { id: true, email: true, name: true } } },
    });

    res.json({ items });
  } catch (e) {
    console.error("listTherapistAppointments error:", e);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getAppointmentById(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" });

    const appt = await prisma.appointment.findUnique({
      where: { id },
      include: {
        therapist: { select: { id: true, email: true, name: true } },
        patient: { select: { id: true, email: true, name: true } },
      },
    });

    if (!appt) return res.status(404).json({ error: "Appointment not found" });

    const uid = req.user.id;
    if (uid !== appt.patientId && uid !== appt.therapistId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    return res.json({ appointment: appt });
  } catch (e) {
    console.error("getAppointmentById error:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function cancelAppointment(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" });

    const appt = await prisma.appointment.findUnique({ where: { id } });
    if (!appt) return res.status(404).json({ error: "Appointment not found" });

    const uid = req.user.id;
    if (uid !== appt.patientId && uid !== appt.therapistId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const now = new Date();
    if (new Date(appt.startsAt).getTime() <= now.getTime()) {
      return res.status(400).json({ error: "Cannot cancel past appointments" });
    }

    if ((appt.status || "").toUpperCase() === "CANCELLED") {
      return res.status(400).json({ error: "Already cancelled" });
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: { status: "CANCELLED" },
      include: {
        therapist: { select: { id: true, email: true, name: true } },
        patient: { select: { id: true, email: true, name: true } },
      },
    });

    return res.json({ appointment: updated });
  } catch (e) {
    console.error("cancelAppointment error:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  createAppointment,
  listMyAppointments,
  listTherapistAppointments,

  getAppointmentById,
  cancelAppointment,
};
