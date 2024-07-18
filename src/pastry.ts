export interface SetWebCookieOptions {
	/**The domain the cookie is valid for; If not set then the cookie will not be valid for subdomains where applicable. */
	domain?: string;
	/**The expiry date for the cookie; If not set and if `maxAge` not set then the cookie will expire after the session. **NOTE** that maxAge takes precedence over this if both are set. */
	expiry?: Date;
	/**The maximum age of the cookie in seconds; **NOTE** this takes precedence over `expiry` if both are set. */
	maxAge?: number;
	/**Whether or not the cookie should be stored using a storage partition. */
	partitioned?: boolean;
	/**Predetermined path for the cookie to be valid; If not set it'll use the "current" path. */
	path?: string;
	/**
	 * Modifies browser behaviour for sending the cookie with cross-site requests
	 *
	 * - `Lax` is the default value (in modern browsers) and will send the cookie for all same-site requests and top-level navigation GET requests
	 * - `Strict` prevents the browser from sending the cookie to target sites in all cross-site browsing contexts
	 * - `None` enables the browser to send the cookie in all cross-site and same-site requests
	 */
	sameSite?: "Lax" | "Strict" | "None";
	/**If true, then the cookie will only be transmitted over a secure protocol. */
	secure?: boolean;
	/**If true, then the cookie value will not be accessible via Javascript. */
	httpOnly?: boolean;
}

/**
 * Typings for the internal methods of the `cookie` function.
 */
export interface WebCookieHelpers {
	/**
	 * Set a cookie client side using js
	 * @param key the cookie's key
	 * @param value the cookie's value; It will be URI encoded by the method
	 * @param options enable finer control over the cookie's behaviour
	 * @returns a `boolean` indicating the success of setting the cookie
	 */
	set: (key: string, value: string, options?: SetWebCookieOptions) => boolean;
	/**
	 * Get the specific value of a cookie string
	 * @param key the cookie's key
	 * @returns either the `string` value if the cookie key exists, or `null` if the key does not exist
	 */
	get: (key: string) => string | null;
	/**
	 * Delete a cookie that was already set.
	 *
	 * **IMPORTANT** it validates the existence of a key and will return `false` if the key doesn't exist
	 * @param key the cookie's key
	 * @returns a `boolean` indicating the success of deleting the cookie
	 */
	delete: (key: string) => boolean;
	/**
	 * Update a cookie client side using js; It calls `cookie().set(...)` under the hood but with the extra step of validating whether or not the cookie exists
	 * @param key the cookie's key
	 * @param value the cookie's value; It will be URI encoded by the method
	 * @returns a `boolean` indicating the success of updating the cookie
	 */
	update: (
		key: string,
		value: string,
		options?: SetWebCookieOptions
	) => boolean;
	/**
	 * View all available cookie keys
	 * @returns `null` if there's an error or no keys otherwise an array of strings representing the keys
	 */
	keys: () => string[] | null;
	/**
	 * View all available cookie values
	 * @returns `null` if there's an error or no values otherwise an array of strings representing the cookie values
	 */
	values: () => string[] | null;
}

const _web = (): WebCookieHelpers => {
	const _set = (
		key: string,
		value: string,
		options?: SetWebCookieOptions
	): boolean => {
		let cookieValue = `${key}=${encodeURIComponent(value)}`;

		if (options) {
			const {
				domain,
				expiry,
				maxAge,
				partitioned,
				path,
				sameSite,
				secure,
				httpOnly,
			} = options;

			if (domain) cookieValue += `; Domain=${domain}`;
			if (expiry) cookieValue += `; Expires=${expiry.toUTCString()}`;
			if (maxAge) cookieValue += `; Max-Age=${maxAge}`;
			if (partitioned) cookieValue += `; Partitioned`;
			if (path) cookieValue += `; Path=${path}`;
			if (sameSite) cookieValue += `; SameSite=${sameSite}`;
			if (secure) cookieValue += `; Secure`;
			if (httpOnly) cookieValue += `; HttpOnly`;
		}

		if (document) {
			document.cookie = cookieValue;

			if (document.cookie.includes(`${key}=${encodeURIComponent(value)}`))
				return true;
			else return false;
		} else return false;
	};

	const _get = (key: string): string | null => {
		if (document) {
			const cookies = document.cookie.split(";");
			let returnValue: string | null = null;

			cookies.some((cookie) => {
				if (cookie.trim().startsWith(`${key}=`))
					returnValue = cookie.replace(`${key}=`, "");
			});

			return returnValue;
		} else return null;
	};

	const _delete = (key: string): boolean => {
		const keyExists = _get(key);

		switch (!keyExists) {
			case true:
				return false;
			default:
				return _set(key, "", { maxAge: 0, secure: false, path: "/" });
		}
	};

	const _update = (
		key: string,
		value: string,
		options?: SetWebCookieOptions
	): boolean => {
		const keyExists = _get(key);

		switch (!keyExists) {
			case true:
				return false;
			default:
				return _set(key, value, options);
		}
	};

	const _keys = (): string[] | null => {
		if (document) {
			if (document.cookie.length === 0) return null;

			const cookies = document.cookie.split(";");
			let cookieKeys: string[] = [];

			cookies.map((cookie) => {
				cookieKeys.push(cookie.split("=")[0].trim());
			});

			return cookieKeys.length === 0 ? null : cookieKeys;
		} else return null;
	};

	const _values = (): string[] | null => {
		if (document) {
			if (document.cookie.length === 0) return null;

			const cookies = document.cookie.split(";");
			let cookieValues: string[] = [];

			cookies.map((cookie) => {
				cookieValues.push(cookie.split("=")[1].trim());
			});

			return cookieValues.length === 0 ? null : cookieValues;
		} else return null;
	};

	return {
		set: _set,
		get: _get,
		delete: _delete,
		update: _update,
		keys: _keys,
		values: _values,
	};
};

export interface SetServerCookieOptions {
	/**The domain the cookie is valid for; If not set then the cookie will not be valid for subdomains where applicable. */
	domain?: string;
	/**The expiry date for the cookie; If not set and if `maxAge` not set then the cookie will expire after the session. **NOTE** that maxAge takes precedence over this if both are set. */
	expiry?: Date;
	/**The maximum age of the cookie in seconds; **NOTE** this takes precedence over `expiry` if both are set. */
	maxAge?: number;
	/**Whether or not the cookie should be stored using a storage partition. */
	partitioned?: boolean;
	/**Predetermined path for the cookie to be valid; If not set it'll use the "current" path. */
	path?: string;
	/**
	 * Modifies browser behaviour for sending the cookie with cross-site requests
	 *
	 * - `Lax` is the default value (in modern browsers) and will send the cookie for all same-site requests and top-level navigation GET requests
	 * - `Strict` prevents the browser from sending the cookie to target sites in all cross-site browsing contexts
	 * - `None` enables the browser to send the cookie in all cross-site and same-site requests
	 */
	sameSite?: "Lax" | "Strict" | "None";
	/**If true, then the cookie will only be transmitted over a secure protocol. */
	secure?: boolean;
	/**If true, then the cookie value will not be accessible via Javascript. */
	httpOnly?: boolean;
}

const _server = (
	key: string,
	value: string,
	options?: SetServerCookieOptions
): string => {
	let cookieValue = `${key}=${encodeURIComponent(value)}`;

	if (options) {
		const {
			domain,
			expiry,
			maxAge,
			partitioned,
			path,
			sameSite,
			secure,
			httpOnly,
		} = options;

		if (domain) cookieValue += `; Domain=${domain}`;
		if (expiry) cookieValue += `; Expires=${expiry.toUTCString()}`;
		if (maxAge) cookieValue += `; Max-Age=${maxAge}`;
		if (partitioned) cookieValue += `; Partitioned`;
		if (path) cookieValue += `; Path=${path}`;
		if (sameSite) cookieValue += `; SameSite=${sameSite}`;
		if (secure) cookieValue += `; Secure`;
		if (httpOnly) cookieValue += `; HttpOnly`;
	}

	return cookieValue;
};

interface PastryMethods {
	/**
	 * A helper function that returns internal methods that enable you to handle cookies on the client with ease!
	 */
	web: () => WebCookieHelpers;
	/**Create a cookie from the server to set on the client */
	server: (
		key: string,
		value: string,
		options?: SetServerCookieOptions
	) => string;
}

export const pastry = (): PastryMethods => {
	return {
		server: _server,
		web: _web,
	};
};
