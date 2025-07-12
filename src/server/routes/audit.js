import express from "express";
const router = express.Router();

import AuditController from "../controllers/AuditController.js";

router.post("/audits", AuditController.createAudit);
router.put("/audits/:userId", AuditController.updateAudit);
router.get("/audits/:userId", AuditController.findAudit);

export default router;