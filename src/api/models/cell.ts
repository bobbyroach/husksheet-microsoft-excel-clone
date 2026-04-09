import mongoose, { Mongoose } from 'mongoose';

const cellSchema = new mongoose.Schema({
    type: { type: String, required: true },
    row: { type: Number, required: true },
    column: { type: Number, required: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    formula: { type: String, required: false }
});

const Cell = mongoose.model('Cell', cellSchema);

export default Cell;