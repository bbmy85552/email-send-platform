# Next.js Google Identity Services 身份驗證

一個使用 Next.js 15 和 Google Identity Services 實現的現代 Google 身份驗證系統。

## 🚀 功能特點

- ✅ Google Identity Services 登入
- ✅ 客戶端會話管理
- ✅ 響應式設計
- ✅ TypeScript 支援
- ✅ 現代化認證體驗
- ✅ 中文本地化
- ✅ 無 hydration 問題

## 📋 技術棧

- **框架**: Next.js 15 (App Router)
- **認證**: Google Identity Services
- **UI**: Tailwind CSS + Radix UI
- **語言**: TypeScript
- **圖標**: Lucide React

## 🛠️ 安裝與設置

### 1. 克隆專案

```bash
git clone <repository-url>
cd nextjs-google-auth
```

### 2. 安裝依賴

```bash
npm install
# 或
pnpm install
```

### 3. 環境變數配置

創建 `.env` 文件並添加以下配置：

```env
# Google Identity Services 配置
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### 4. Google Cloud Console 設置

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 創建新專案或選擇現有專案
3. 啟用 Google Identity API
4. 創建 OAuth 2.0 客戶端 ID
5. 設置應用類型為 **Web application**
6. 添加授權的 JavaScript 來源：
   - 開發環境: `http://localhost:3000`
   - 生產環境: `https://yourdomain.com`

⚠️ **注意**: 不需要設置重定向 URI，Google Identity Services 自動處理

### 5. 啟動開發伺服器

```bash
npm run dev
# 或
pnpm dev
```

訪問 [http://localhost:3000](http://localhost:3000) 查看應用。

## 📁 專案結構

```
├── app/
│   ├── dashboard/
│   │   └── page.tsx            # 受保護的儀表板頁面
│   ├── layout.tsx              # 根布局（加載Google脚本）
│   └── page.tsx                # 首頁
├── components/
│   ├── ui/                     # UI 元件
│   ├── dashboard-new.tsx       # 儀表板元件
│   └── login-page-new.tsx      # 登入頁面元件
├── hooks/
│   └── use-google-auth.ts      # Google 認證 Hook
├── lib/
│   ├── google-auth.ts          # Google Identity Services 封裝
│   └── utils.ts                # 工具函數
└── middleware.ts               # 輕量級中間件
```

## 🔧 主要功能

### 用戶認證管理
```typescript
const { user, isLoading, isSignedIn, signOut, error } = useGoogleAuth()
```

### 用戶資訊
```typescript
interface GoogleUser {
  id: string
  email: string
  name: string
  picture: string
  given_name?: string
  family_name?: string
  locale?: string
  email_verified?: boolean
}
```

### 登入流程
```
首頁 → Google登入按鈕 → Google認證彈窗 → 自動解析用戶資訊 → 重定向到儀表板
```

## 🚀 部署

### Vercel 部署

1. 推送代碼到 GitHub
2. 在 Vercel 中導入專案
3. 設置環境變數：
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
4. 在 Google Console 中添加生產域名

### 其他平台

確保設置正確的環境變數和更新 Google Console 中的授權域名。

## 🔒 安全注意事項

1. **客戶端 ID 是公開的** - 這是 Google Identity Services 的正常設計
2. **域名限制** - 在 Google Console 中限制授權域名
3. **HTTPS** - 生產環境必須使用 HTTPS
4. **定期更新** - 保持依賴套件更新

## 🐛 常見問題

### 登入按鈕不顯示
- 檢查 `NEXT_PUBLIC_GOOGLE_CLIENT_ID` 環境變數
- 確認 Google 脚本已加載
- 查看瀏覽器控制台錯誤

### 登入失敗
- 確認域名已在 Google Console 中授權
- 檢查 Client ID 是否正確
- 確保使用 HTTPS (生產環境)

### 用戶狀態不持久
- 檢查 localStorage 是否正常工作
- 確認沒有清除瀏覽器數據

## ✨ 特色優勢

- **🚀 更快**: 無服務端依賴，純客戶端認證
- **🔧 簡單**: 只需 1 個環境變數
- **🛡️ 安全**: Google 官方認證技術
- **📱 現代**: 最新的 Google Identity Services
- **⚡ 穩定**: 無 hydration 問題

## 📄 許可證

MIT License

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！ 