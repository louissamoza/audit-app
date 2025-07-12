import Audit from "../models/Audit.js";

class AuditService {
    constructor() {}

    async createAudit({ userId, locations = [], questions = [] }) {
        return Audit.create({
            userId,
            locations,
            questions 
        })
    }

    async updateAudit(userId, body) {
        const { locations, questions } = body;
        const filter = { userId: userId };
        const update = {
            locations: locations,
            questions: questions
        };
        const options = { new: true };
        return Audit.findOneAndUpdate(filter, update, options);
    }

    async findAudit(userId) {
        const filter = { userId: userId };
        return Audit.findOne(filter);
    }
}

export default new AuditService;