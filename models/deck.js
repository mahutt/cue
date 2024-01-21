const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DeckSchema = new Schema({
    course: { type: Schema.Types.ObjectId, ref: 'Course' },
    name: { type: String, required: true, maxLength: 100 },
});

module.exports = mongoose.model('Deck', DeckSchema);
