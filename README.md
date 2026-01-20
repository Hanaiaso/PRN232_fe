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
