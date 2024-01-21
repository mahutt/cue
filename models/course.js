const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    name: { type: String, required: true, maxLength: 100 },
    department: { type: String, required: true, maxLength: 4 },
    number: { type: Number, required: true },
});

// Converts department to lower case prior to saving.
CourseSchema.pre('save', function (next) {
    if (this.department && typeof this.department === 'string') {
        this.department = this.department.toLowerCase();
    }
    next();
});

// Returns course code.
CourseSchema.virtual('code').get(function () {
    return `${this.department}${this.number}`;
});

// Enforces course code uniqueness.
CourseSchema.index({ department: 1, number: 1 }, { unique: true });

module.exports = mongoose.model('Course', CourseSchema);
