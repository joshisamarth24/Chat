import {Conversation} from "../models/conversationModel.js";
import {Message} from "../models/messageModel.js";


export const sendMessage = async (req, res) => {
    try {
        const {message} = req.body;
        const {id:recieverId} = req.params;
        const senderId = req.user._id;
        let conversation = await Conversation.findOne({participants: {$all: [senderId, recieverId]}});
        
        if(!conversation) {
            conversation = await Conversation.create({participants: [senderId, recieverId]});
        }

        const newMessage = new Message({
            senderId,
            recieverId,
            message
        });

        if(newMessage){
            conversation.messages.push(newMessage);
        }
        await Promise.all([conversation.save(),newMessage.save()]);
        res.status(201).json(newMessage);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Server error"});
    }
}

export const getMessages = async (req, res) => {
    try {
        const {id:recieverId} = req.params;
        const senderId = req.user._id;
        let conversation = await Conversation.findOne({
            participants:{$all:[senderId,recieverId]}
        }).populate("messages");
        if(!conversation) {
            res.status(200).json([]);
        }
        res.status(200).json(conversation.messages);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Server error"});
    }
}