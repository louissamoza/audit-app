import { model, Schema } from 'mongoose';

const optionFields = {
    text: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        required: true
    }
}

const OptionSchema = new Schema(optionFields);

const questionFields = {
    question: {
        type: String,
        required: true
    },
    options: [OptionSchema]
}

const questionOptions = {
    timestamps: true
}

const QuestionSchema = new Schema(questionFields, questionOptions);

const auditFields = {
    userId: {
        type: String,
        required: true
    },
    locations: [{
        type: String,
    }],
    questions: [QuestionSchema]
}

const auditOptions = {
    timestamps: true
}

const AuditSchema = new Schema(auditFields, auditOptions);
const AuditModel = model('Audit', AuditSchema);

export default AuditModel;