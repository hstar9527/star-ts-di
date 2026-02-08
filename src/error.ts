export class StarDiError extends Error {
    constructor(message: string) {
        super(`[starDi]: ${message}`);
    }
}