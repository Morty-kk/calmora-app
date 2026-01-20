const prisma = require("./prisma");

// POST /appointments
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

// GET /appointments/mine
async function listMyAppointments(req, res) {
  try {
    const patientId = req.user.id;

    const items = await prisma.appointment.findMany({
      where: { patientId },
      orderBy: { startsAt: "asc" },
      include: { therapist: { select: { id: true, email: true } } },
    });

    res.json({ items });
  } catch (e) {
    console.error("listMyAppointments error:", e);
    res.status(500).json({ error: "Internal server error" });
  }
}

// GET /appointments/therapist
async function listTherapistAppointments(req, res) {
  try {
    const therapistId = req.user.id;

    const items = await prisma.appointment.findMany({
      where: { therapistId },
      orderBy: { startsAt: "asc" },
      include: { patient: { select: { id: true, email: true } } },
    });

    res.json({ items });
  } catch (e) {
    console.error("listTherapistAppointments error:", e);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  createAppointment,
  listMyAppointments,
  listTherapistAppointments,
};
