export default class Audit {
    constructor({ userId, locations = [], questions = []}) {
        this.userId = userId;
        this.locations = locations;
        this.questions = questions;
    }
}