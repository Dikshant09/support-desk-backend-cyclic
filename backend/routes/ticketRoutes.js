const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Re-route into note router : to get notes
const noteRouter = require('./noteRoutes');
router.use('/:ticketId/notes', noteRouter);

const {
    getTicket,
    getTickets,
    createTicket,
    deleteTicket,
    updateTicket
} = require('../controllers/ticketController');

router.route('/').get(protect, getTickets).post(protect, createTicket);


router.route('/:id').get(protect, getTicket).delete(protect, deleteTicket).put(protect, updateTicket);

module.exports = router;