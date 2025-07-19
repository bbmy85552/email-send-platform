# Simplified Authentication Demo

A streamlined Next.js application demonstrating Google Identity authentication with a simplified UI component structure.

## Project Structure

The project has been simplified to reduce dependencies and complexity:

- `/app` - Next.js App Router structure
  - `page.tsx` - Login page
  - `dashboard/page.tsx` - Dashboard page for authenticated users
  - `layout.tsx` - Root layout with theme provider
  - `globals.css` - Simplified global styles

- `/components` - React components
  - `login-page-new.tsx` - Login page component
  - `dashboard-new.tsx` - Dashboard component for authenticated users
  - `theme-provider.tsx` - Theme provider for dark/light mode
  - `/ui/simplified.tsx` - Consolidated UI components (Button, Card, Avatar, Badge, Alert)

- `/hooks` - React hooks
  - `use-google-auth.ts` - Hook for Google authentication

- `/lib` - Utility functions
  - `google-auth.ts` - Google authentication logic
  - `utils.ts` - General utilities including class merging

## Key Simplifications

1. **Consolidated UI Components**: All necessary UI components are now in a single file
2. **Reduced Dependencies**: Removed many unnecessary dependencies
3. **Simplified Styling**: Streamlined CSS variables and styling
4. **Focused Functionality**: Kept only essential authentication and dashboard features

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your Google Client ID as an environment variable:
   ```
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## Technologies Used

- Next.js 15.2.4
- React 19
- TailwindCSS for styling
- Google Identity Services for authentication 


## db utile
  1. 安装依赖：
  npm install
  2. 配置环境变量：
  创建.env文件，填写MySQL连接信息：
  DB_HOST=localhost
  DB_USER=root
  DB_PASSWORD=your_password
  DB_NAME=email_app
  DB_PORT=3306
  3. 初始化数据库：
  npm run init-db
  4. 启动应用：
  npm run dev
  5. 测试数据库连接：
  访问 http://localhost:3000/api/test-db