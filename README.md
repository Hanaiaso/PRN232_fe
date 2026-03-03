Nếu bị lỗi 'yarn' is not recognized khi chạy yarn -v thì:
🔹 Bước 1: Kiểm tra nơi Yarn được cài
npm config get prefix
👉 99% sẽ ra:
C:\Users\Admin\AppData\Roaming\npm
🔹 Bước 2: Thêm npm global vào PATH
1️⃣ Mở:
Control Panel
→ System
→ Advanced system settings
→ Environment Variables

2️⃣ Ở phần User variables for Admin

Chọn Path
Click Edit
Click New
Dán dòng này:
C:\Users\Admin\AppData\Roaming\npm
👉 OK → OK → OK

## Run Locally
### 0. Configure environment
Create `.env` with backend URL and social IDs:
```env
VITE_API_URL=https://localhost:49547
VITE_GOOGLE_CLIENT_ID=...
VITE_FACEBOOK_APP_ID=...
```

### 0.5. Enable HTTPS for local development
Facebook SDK refuses to work on plain HTTP, so you need to serve the site over HTTPS (or use an ngrok tunnel).

#### option A: self‑signed certificate (mkcert)
1. Install `mkcert` (https://github.com/FiloSottile/mkcert).
2. Run the following from the project root:
   ```bash
   mkcert -install
   mkcert localhost 127.0.0.1 ::1
   mkdir certs
   mv localhost.pem certs/localhost-crt.pem
   mv localhost-key.pem certs/localhost-key.pem
   ```
3. Restart the dev server. Vite config automatically picks up `certs/localhost-*.pem` and serves over HTTPS.
4. Open `https://localhost:3000` (accept browser warning once).

#### option B: HTTPS tunnel
Use a tunnel service such as ngrok:
```bash
npx ngrok http 3000
``` 
and visit the provided `https://...` URL. Add that URL to your Facebook app's "Valid OAuth redirect URIs".

### 1. Install Dependencies
```sh
$ yarn install
```
### 2. Run development server
```sh 
$ yarn dev || npm run dev
```
## Build the project
```sh
$ yarn build
```
