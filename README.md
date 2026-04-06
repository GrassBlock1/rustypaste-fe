# rustypaste-fe

A frontend for [rustypaste: A minimal file upload/pastebin service](https://github.com/orhun/rustypaste), built with MDUI & Vite.

## Setup
First add the snippet to your rustypaste's config.toml.
```toml
[landing_page]
file = "landing.html"
content_type = "text/html; charset=utf-8"
```
Then get build artifact named `landing.html` in Releases and put it in the same directory of the config.toml.

If you want to put it at somewhere under a subdirectory, you can configure your webserver like:
```Caddyfile
	handle /upload {
		root * /var/www/rustypaste
		uri strip_prefix /upload
		try_files {path} /index.html
		file_server
	}
```
## Building
```bash
git clone https://github.com/GrassBlock1/mercury
pnpm install
pnpm build
```
If you want to build for putting it at somewhere under a subdirectory, you should change the `vite.config.ts` before building:
```ts
export default defineConfig(({ mode }) => ({
    base: "/yourSubDirectory"
}))
```
To built into a single file:
```bash
pnpm build:singlefile
```
The artifact will be available at `./dist`.
## License
Mozilla Public License, Version 2.0