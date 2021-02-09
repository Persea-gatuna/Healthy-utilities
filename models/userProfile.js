const moongose = require('mongoose');

const profileSchema = new moongose.Schema({
    _id: moongose.Schema.Types.ObjectId,
    userId: String,
    xp: Number,
    points: Number,
    messageCount: { type: Number, default: 0 }
});

module.exports = moongose.model('Profile', profileSchema);