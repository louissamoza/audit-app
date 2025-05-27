import { model, Schema } from 'mongoose';

const fields = {
    userId: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    answers: [{
        type: String,
        required: true
    }]
}

const options = {
    timestamps: true
}

const QuestionSchema = new Schema(fields, options);
const QuestionModel = model('Question', QuestionSchema);

export default QuestionModel;