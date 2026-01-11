const express = require("express");

const chatController = require("./chat.controller");
const { authRequired } = require("./middleware/auth");

const router = express.Router();

router.use(authRequired);

router.post("/conversations", chatController.createOrOpenConversation);
router.get("/conversations", chatController.listConversations);
router.get("/conversations/:id/messages", chatController.listMessages);
router.post("/conversations/:id/messages", chatController.sendMessage);
router.patch("/messages/:id/read", chatController.markMessageRead);

module.exports = router;
