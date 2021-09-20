const { Router } = require('express');
const router = Router();
const Conversation = require('../models/Conversation');
const auth = require('../middlewares/auth');
const decodeUserId = require('../utils/decodeToken');

router.get('/', auth, async (req, res) => {
    try {
    const token = req.headers.authorization.split(' ')[1];
    const userId = decodeUserId(token);
    const convs = await Conversation.find({
        members: userId
    });
    res.status(200).json(convs);
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Something went wrong"
        })
    }
    
})

module.exports = router;