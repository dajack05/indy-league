export class ReturnType {
    error: any | null = null;
    payload: any | null = null;

    static Error(error: any): ReturnType {
        return {
            error,
            payload: null,
        };
    }

    static Ok(payload: any): ReturnType {
        return {
            error: null,
            payload,
        };
    }
}