import AuditService from "../services/AuditService.js";

class AuditController {

    async createAudit(req, res, next) {
        try {
            const { userId, locations = [], questions = [] } = req.body;
            const audit = await AuditService.createAudit({ userId, locations, questions });
            res.json(audit);
        } catch (error) {
            next(error);
        }
    }

    async updateAudit(req, res, next) {
        try {
            const { userId } = req.params;
            const body = req.body;
            const audit = await AuditService.updateAudit(userId, body);
            res.json(audit);
        } catch (error) {
            next(error);
        }
    }

    async findAudit(req, res, next) {
        try {
            const { userId } = req.params;
            const audit = await AuditService.findAudit(userId);
            res.json(audit);
        } catch (error) {
            next(error);
        }
    }
}

export default new AuditController;