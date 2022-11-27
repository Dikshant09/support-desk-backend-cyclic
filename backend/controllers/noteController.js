const asyncHandler = require('express-async-handler');

const Ticket = require('../models/ticketModel');
const User = require('../models/userModel');
const Note = require('../models/noteModel');


// @desc get notes
// @route /api/tickets/:ticketId/notes
// @access private
// GET request : we fetch current ticket notes
const getNotes = asyncHandler(async (req, res) => {
    // Get user using the id in the JWT
    const user = req.user;
    
    if(!user){
        res.status(401);
        throw new Error('User not found');
    }

    const ticket = await Ticket.findById(req.params.ticketId); 

    if(ticket.user.toString() !== user.id){
        res.status(401);
        throw new Error('User not authorized');
    }

    const note = await Note.find({ ticket: req.params.ticketId })

    res.status(200).json(note);
})

// @desc Create a new note
// @route /api/tickets/:ticketId/notes
// @access private
// POST request : we create notes for current ticket
const createNote = asyncHandler(async (req, res) => {
    // Get user using the id in the JWT
    const user = req.user;
    
    if(!user){
        res.status(401);
        throw new Error('User not found');
    }

    const ticket = await Ticket.findById(req.params.ticketId); 

    if(ticket.user.toString() !== user.id){
        res.status(401);
        throw new Error('User not authorized');
    }

    const note = await Note.create({ 
        text: req.body.text,
        isStaff: false,
        user: req.user.id,
        ticket: req.params.ticketId 
    })

    res.status(200).json(note);
})

module.exports = {
    getNotes,
    createNote
}