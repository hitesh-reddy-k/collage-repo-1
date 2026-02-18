const Message = require('../databasemodels/message');
const Conversation = require('../databasemodels/conversations');
const { getReceiverSocketId, io } = require('../socketServer/socket');

exports.sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        // Find or create the conversation
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        // Create the new message with senderId, receiverId, and message
        const newMessage = new Message({
            sender: senderId,
            recipient: receiverId,
            text: message,
        });

        await newMessage.save();

        // Update conversation messages array with new message _id
        conversation.messages.push(newMessage._id);
        await conversation.save();

        // Emit the new message event to the receiver's socket
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// controllers/messageController.js

// const Conversation = require('../databasemodels/conversation'); // Adjust this path according to your actual file structure

exports.getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] },
        }).populate("messages");

        if (!conversation) {
            return res.status(200).json([]);
        }

        const messages = conversation.messages;

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};