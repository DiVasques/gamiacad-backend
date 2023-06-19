class HttpResponse {
    public readonly statusCode: number
    public readonly body?: string | object
    public readonly headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }

    constructor(statusCode: number, body?: string | object) {
        this.statusCode = statusCode
        this.body = body
    }
}

export default HttpResponse
