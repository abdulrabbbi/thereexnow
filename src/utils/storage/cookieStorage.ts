import { parseCookies, setCookie, destroyCookie } from 'nookies';

export function saveCookie(key: string, value?: string | Record<string, any>, age?: number) {
	try {
		if (typeof value === 'string') {
			setCookie(null, key, value, { path: '/', age });
		} else {
			setCookie(null, key, JSON.stringify(value), { path: '/', age });
		}
	} catch (err) {
		// ignore event
	}
}

export function getCookie(key: string, isString = true) {
	try {
		const cookies = parseCookies();

		const value = cookies[key];
		if (value) {
			if (isString) return value;
			return JSON.parse(value);
		}
	} catch (err) {
		// ignore event
	}
}

export function clearCookie(key: string) {
	try {
		destroyCookie(null, key, { path: '/' });
	} catch (err) {
		// ignore event
	}
}
