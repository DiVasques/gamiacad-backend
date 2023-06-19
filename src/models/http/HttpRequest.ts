import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

interface HttpRequest {
    body: any;
    query: ParsedQs;
    params: ParamsDictionary;
    ip: string;
    method: string;
    path: string;
    headers: {
        'Content-Type': string | undefined;
        Referer: string | undefined;
        'User-Agent': string | undefined;
    };
}
export default HttpRequest
