# pastryjs

Platform and environment agnostic cookie module; Manage cookies on the browser and the backend.

# Importing

```javascript
// ES6 Module
import pastry, { SetWebCookieOptions, WebCookieHelpers, SetServerCookieOptions } from "pastryjs";

const cookie = pastry();

// Commonjs Module
const pastry, { SetWebCookieOptions, WebCookieHelpers, SetServerCookieOptions } = require("pastryjs");
```

You can also add the CDN via `jsDelivr`:

```html
<script src="https://cdn.jsdelivr.net/npm/pastryjs@0.1.0/lib/index.js"></script>
```

# Usage

**On the web**

```ts
import pastry from "pastryjs";

// for the web; has internal method
const webCookie = pastry().web()

// create a new cookie
webCookie.set(...)
```

**On the server**

```ts
import pastry from "pastryjs";
import server from "...";

const app = server();

app.get("/", (request, response) => {
	response.header.set(
		"Set-Cookie",
		pastry().server("foo", "bar", {
			domain: "https://www.foo.bar",
			maxAge: 3600,
		})
	);
	return response.json({ message: "Cookie set!" });
});

app.listen(8080);
```

# Exports

## pastry()

Initialise it as follows:

```ts
const cookie = pastry();

// This has five internal methods
const webCookie = cookie.web();

// server(...) is it's own method
const serverCookie = cookie.server(...);
```

### web()

Used for setting cookies on the web. It returns the following methods.

#### set(key: string, value: string, options?: SetWebCookieOptions) => boolean

Set a cookie client side using javascript.

#### get(key: string) => string | null

Get the specific value of a cookie string.

#### delete(key: string) => boolean

Delete a cookie that was already set.

#### update(key: string, value: string, options?: SetWebCookieOptions) => boolean

Update a cookie client side using javascript; It calls `cookie().set(...)` under the hood but with the extra step of validating whether or not the cookie exists.

#### keys() => string[] | null

View all available cookie keys.

#### values() => string[] | null

View all available cookie values.

### server(key: string, value: string, options?: SetServerCookieOptions)

It returns a string that you can use to set a `Set-Cookie` header.

# Types

### WebCookieHelpers

Typings for the internal methods of the `cookie().web()` method.

```ts
{
	set: (key: string, value: string, options?: SetCookieOptions) => boolean;
	get: (key: string) => string | null;
	delete: (key: string) => boolean;
	update: (key: string, value: string, options?: SetCookieOptions) => boolean;
	keys: () => string[] | null;
	values: () => string[] | null;
}
```

### SetWebCookieOptions

Options for setting the cookie.

```ts
{
	domain?: string;
	expiry?: Date;
	maxAge?: number;
	partitioned?: boolean;
	path?: string;
	sameSite?: "Lax" | "Strict" | "None";
	secure?: boolean;
	httpOnly?: boolean;
}
```

### SetServerCookieOptions

Options for setting the cookie on the server.

```ts
{
	domain?: string;
	expiry?: Date;
	maxAge?: number;
	partitioned?: boolean;
	path?: string;
	sameSite?: "Lax" | "Strict" | "None";
	secure?: boolean;
	httpOnly?: boolean;
}
```

# Changelog

## v0.1.x

<details>
<summary><strong>v0.1.0</strong></summary>

- Initial release

</details>
