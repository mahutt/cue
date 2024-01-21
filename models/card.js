const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CardSchema = new Schema({
    deck: { type: Schema.Types.ObjectId, ref: 'Deck', required: true },
    index: { type: Number, required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    score: {
        type: Number,
        required: true,
        enum: [0, 1, 2],
        default: 0,
    },
});

CardSchema.index({ deck: 1, index: 1 }, { unique: true });

CardSchema.pre('save', async function (next) {
    try {
        if (!this.isNew) {
            return next();
        }

        this.index = await this.model('Card').countDocuments({
            deck: this.deck,
        });

        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Card', CardSchema);
