const prisma = require("./prisma");

const MAX_MESSAGE_LENGTH = 2000;

function serializeUser(user) {
  return { id: user.id, email: user.email, role: user.role };
}

function isParticipant(conversation, userId) {
  return conversation.patientId === userId || conversation.therapistId === userId;
}

async function createOrOpenConversation(req, res) {
  const currentUser = req.user;
  const { patientId, therapistId } = req.body;

  let resolvedPatientId = patientId;
  let resolvedTherapistId = therapistId;

  if (currentUser.role === "PATIENT") {
    resolvedPatientId = currentUser.id;
    if (!therapistId) {
      return res.status(400).json({ error: "therapistId is required" });
    }
    resolvedTherapistId = therapistId;
  } else if (currentUser.role === "THERAPIST") {
    resolvedTherapistId = currentUser.id;
    if (!patientId) {
      return res.status(400).json({ error: "patientId is required" });
    }
    resolvedPatientId = patientId;
  } else {
    return res.status(403).json({ error: "Invalid user role" });
  }

  const patientIdNumber = Number(resolvedPatientId);
  const therapistIdNumber = Number(resolvedTherapistId);

  if (!Number.isInteger(patientIdNumber) || !Number.isInteger(therapistIdNumber)) {
    return res.status(400).json({ error: "Invalid participant id" });
  }

  const [patient, therapist] = await Promise.all([
    prisma.user.findUnique({ where: { id: patientIdNumber } }),
    prisma.user.findUnique({ where: { id: therapistIdNumber } }),
  ]);

  if (!patient || patient.role !== "PATIENT") {
    return res.status(400).json({ error: "Invalid patientId" });
  }
  if (!therapist || therapist.role !== "THERAPIST") {
    return res.status(400).json({ error: "Invalid therapistId" });
  }

  const conversation = await prisma.conversation.upsert({
    where: { patientId_therapistId: { patientId: patientIdNumber, therapistId: therapistIdNumber } },
    update: {},
    create: {
      patientId: patientIdNumber,
      therapistId: therapistIdNumber,
    },
    include: {
      patient: true,
      therapist: true,
    },
  });

  return res.json({
    conversation: {
      ...conversation,
      patient: serializeUser(conversation.patient),
      therapist: serializeUser(conversation.therapist),
    },
  });
}

async function listConversations(req, res) {
  const currentUser = req.user;
  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [{ patientId: currentUser.id }, { therapistId: currentUser.id }],
    },
    include: {
      patient: true,
      therapist: true,
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: [{ lastMessageAt: "desc" }, { updatedAt: "desc" }],
  });

  const payload = conversations.map((conversation) => ({
    id: conversation.id,
    patientId: conversation.patientId,
    therapistId: conversation.therapistId,
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
    lastMessageAt: conversation.lastMessageAt,
    patient: serializeUser(conversation.patient),
    therapist: serializeUser(conversation.therapist),
    lastMessage: conversation.messages[0] || null,
  }));

  return res.json({ conversations: payload });
}

async function listMessages(req, res) {
  const currentUser = req.user;
  const conversationId = Number(req.params.id);
  if (!Number.isInteger(conversationId)) {
    return res.status(400).json({ error: "Invalid conversation id" });
  }

  const conversation = await prisma.conversation.findUnique({ where: { id: conversationId } });
  if (!conversation || !isParticipant(conversation, currentUser.id)) {
    return res.status(404).json({ error: "Conversation not found" });
  }

  const limitParam = Number(req.query.limit);
  const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 100) : 30;
  const cursorParam = req.query.cursor ? Number(req.query.cursor) : null;
  if (cursorParam !== null && !Number.isFinite(cursorParam)) {
    return res.status(400).json({ error: "Invalid cursor" });
  }

  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "desc" },
    take: limit,
    ...(cursorParam ? { cursor: { id: cursorParam }, skip: 1 } : {}),
  });

  const nextCursor = messages.length === limit ? messages[messages.length - 1].id : null;

  return res.json({ messages, nextCursor });
}

async function sendMessage(req, res) {
  const currentUser = req.user;
  const conversationId = Number(req.params.id);

  if (!Number.isInteger(conversationId)) {
    return res.status(400).json({ error: "Invalid conversation id" });
  }

  const { content, type, metadata } = req.body;
  const trimmed = typeof content === "string" ? content.trim() : "";
  if (!trimmed) {
    return res.status(400).json({ error: "content is required" });
  }
  if (trimmed.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({ error: "content exceeds max length" });
  }

  const conversation = await prisma.conversation.findUnique({ where: { id: conversationId } });
  if (!conversation || !isParticipant(conversation, currentUser.id)) {
    return res.status(404).json({ error: "Conversation not found" });
  }

  const message = await prisma.$transaction(async (tx) => {
    const createdMessage = await tx.message.create({
      data: {
        conversationId,
        senderId: currentUser.id,
        content: trimmed,
        type,
        metadata,
      },
    });

    await tx.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: createdMessage.createdAt },
    });

    return createdMessage;
  });

  return res.status(201).json({ message });
}

async function markMessageRead(req, res) {
  const currentUser = req.user;
  const messageId = Number(req.params.id);
  if (!Number.isInteger(messageId)) {
    return res.status(400).json({ error: "Invalid message id" });
  }

  const message = await prisma.message.findUnique({
    where: { id: messageId },
    include: { conversation: true },
  });

  if (!message || !isParticipant(message.conversation, currentUser.id)) {
    return res.status(404).json({ error: "Message not found" });
  }

  if (message.senderId === currentUser.id) {
    return res.status(403).json({ error: "Cannot mark own message as read" });
  }

  const updated = await prisma.message.update({
    where: { id: messageId },
    data: { readAt: new Date() },
  });

  return res.json({ message: updated });
}

module.exports = {
  createOrOpenConversation,
  listConversations,
  listMessages,
  sendMessage,
  markMessageRead,
};
