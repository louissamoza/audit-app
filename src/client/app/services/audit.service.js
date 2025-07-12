class AuditService {

    constructor() {
        this.host = "http://localhost:8000";
    }

    async createAudit(auditObject) {
        const url = new URL("/api/audits", this.host);

        const headers = new Headers({
            "Content-Type": "application/json"
        })

        const options = {
            method: "POST",
            headers,
            body: JSON.stringify(auditObject)
        }

        const request = new Request(url, options);

        try {
            const response = await fetch(request);
            return response.json();
        } catch (error) {
            console.log("Error creating audit:", error);
            throw error;
        }
    }

    async findAudit(userId) {
        const url = new URL(`/api/audits/${userId}`, this.host);

        const headers = new Headers({
            "Content-Type": "application/json"
        })

        const options = {
            method: "GET",
            headers
        }

        const request = new Request(url, options);

        try {
            const response = await fetch(request);
            return response.json();
        } catch (error) {
            console.log("Error finding audit:", error);
            throw error;
        }
    }

    async updateAudit(auditObject) {
        const url = new URL(`/api/audits/${auditObject.userId}`, this.host);

        const headers = new Headers({
            "Content-Type": "application/json"
        })

        const options = {
            method: "PUT",
            headers,
            body: JSON.stringify(auditObject)
        }

        const request = new Request(url, options);

        try {
            const response = await fetch(request);
            return response.json();
        } catch (error) {
            console.log("Error updating audit:", error);
            throw error;
        }
    }
}

export default new AuditService();