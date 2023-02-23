import { customAlphabet } from 'nanoid';

const base64url = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789-_=';
export function base64rand(count: number): string {
    const nanoid = customAlphabet(base64url, count);
    return nanoid();
}