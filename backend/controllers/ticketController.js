const asyncHandler = require('express-async-handler');

const Ticket = require('../models/ticketModel');
const User = require('../models/userModel');

// @desc get tickets
// @route /api/tickets
// @access private
// GET request : we fetch current user tickets
const getTickets = asyncHandler(async (req, res) => {
    // Get user using the id in the JWT
    // const user = await User.findById(req.user.id);
    const user = req.user;
    
    if(!user){
        res.status(401);
        throw new Error('User not found');
    }

    const tickets = await Ticket.find({user: user.id}); 
    // const tickets = await Ticket.find({user: req.user.id}); 

    res.status(200).json(tickets);
})


// @desc get single user ticket
// @route /api/tickets/:id
// @access private
// GET request : we fetch single user ticket
const getTicket = asyncHandler(async (req, res) => {
    // Get user from req.user 
    const user = req.user;
    
    if(!user){
        res.status(401);
        throw new Error('User not found');
    }

    const ticket = await Ticket.findById(req.params.id); 

    if(!ticket){
        res.status(404);
        throw new Error('Ticket not found');
    }

    if(ticket.user.toString() !== user.id){
        res.status(401);
        throw new Error('Not Authorized');
    }

    res.status(200).json(ticket);
})


// @desc get delete user ticket
// @route /api/tickets/:id
// @access private
// DELETE request : we delete current user ticket by ticket id
const deleteTicket = asyncHandler(async (req, res) => {
    // Get user from req.user 
    const user = req.user;
    
    if(!user){
        res.status(401);
        throw new Error('User not found');
    }

    const ticket = await Ticket.findById(req.params.id); 

    if(!ticket){
        res.status(404);
        throw new Error('Ticket not found');
    }

    if(ticket.user.toString() !== user.id){
        res.status(401);
        throw new Error('Not Authorized');
    }

    await ticket.remove();

    res.status(200).json({ success: true });
})


// @desc put update user ticket
// @route /api/tickets/:id
// @access private
// PUT request : updating current user ticket by ticket id
const updateTicket = asyncHandler(async (req, res) => {
    // Get user from req.user 
    const user = req.user;
    
    if(!user){
        res.status(401);
        throw new Error('User not found');
    }

    const ticket = await Ticket.findById(req.params.id); 

    if(!ticket){
        res.status(404);
        throw new Error('Ticket not found');
    }

    if(ticket.user.toString() !== user.id){
        res.status(401);
        throw new Error('Not Authorized');
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.status(200).json(updatedTicket);
})


// @desc get Create a new tickets
// @route /api/tickets
// @access private
// POST request : we send data to create a new ticket
const createTicket = asyncHandler(async (req, res) => {
    const { product, description } = req.body;

    if(!product || !description){
        res.status(400);
        throw new Error(`Please add a product and description`);
    }

    const user = req.user;
    
    if(!user){
        res.status(401);
        throw new Error('User not found');
    }

    const ticket = await Ticket.create({
        product: product,
        description: description,
        user: user.id,
        status: 'new',
    }) 

    res.status(201).json(ticket);
})


module.exports = {
    getTicket,
    getTickets, 
    createTicket,
    deleteTicket,
    updateTicket
}