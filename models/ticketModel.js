const mongoose  = require("mongoose");

const ticketSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    product: {
        type: String,
        required: [true, 'Please select a product'],
        enum: ['iPhone', 'iPod', 'Macbook Pro', 'iMac', 'iPad']
    },
    description: {
        type: String,
        required: [true, 'Please enter a description of the issue'],
        minlength: 6,
    },
    status: {
        type: String,
        enum: ['new', 'open', 'closed'],
        default: 'new',
        required: true,
        default: false,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Ticket', ticketSchema);