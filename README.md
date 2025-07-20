# NovaMail - 专业邮件发送平台

NovaMail 是一个基于 Next.js 的专业邮件发送平台，集成 Google OAuth 认证、MySQL 数据库和 Resend API，提供安全可靠的邮件发送服务。

## 🚀 主要功能

### 📧 智能邮件发送
- **自定义发件人信息**：支持自定义发件人姓名和邮箱前缀
- **HTML格式支持**：支持HTML格式的邮件内容
- **专业域名**：使用 novatime.top 域名发送邮件
- **即时状态反馈**：实时显示发送成功/失败状态

### 📊 发送统计追踪
- **实时统计**：实时显示今日已发送邮件数量
- **历史记录**：查看完整的邮件发送历史记录
- **状态追踪**：每封邮件的发送状态（成功/失败/待发送）
- **时间戳记录**：精确记录每封邮件的发送时间

### 🔐 安全认证
- **Google OAuth**：使用 Google 账户安全登录
- **无密码认证**：无需注册新账户，直接使用 Google 账户
- **会话管理**：安全的会话存储和管理
- **权限控制**：基于用户身份的邮件发送权限管理

### ⚙️ 管理功能
- **每日限额**：可配置的每日邮件发送限制（默认10封/天）
- **用户管理**：自动创建和管理用户记录
- **数据持久化**：所有邮件记录和用户数据持久化存储

## 🏗️ 技术架构

### 前端技术栈
- **Next.js 15**：现代 React 框架，支持服务端渲染
- **TypeScript**：类型安全的开发体验
- **Tailwind CSS**：现代化的 CSS 框架
- **Framer Motion**：流畅的动画效果
- **Shadcn/ui**：美观的组件库

### 后端技术栈
- **Next.js API Routes**：内置的 API 路由系统
- **MySQL 8.0**：关系型数据库
- **mysql2**：高性能 MySQL 客户端
- **Resend API**：专业的邮件发送服务
- **Google Identity Services**：Google OAuth 认证

### 开发工具
- **ESLint**：代码质量检查
- **Prettier**：代码格式化
- **TypeScript**：类型检查

## 📁 项目结构

```
email-send/
├── app/                          # Next.js 应用目录
│   ├── api/                     # API 路由
│   │   ├── send-email/         # 邮件发送API
│   │   │   └── route.ts        # 邮件发送处理逻辑
│   │   ├── test-db/            # 数据库测试API
│   │   │   └── route.ts        # 数据库连接测试
│   │   └── user-emails/        # 用户邮件历史API
│   │       └── route.ts        # 获取用户邮件记录
│   ├── dashboard/page.tsx      # 用户仪表板页面
│   ├── email-compose/page.tsx  # 邮件发送页面
│   ├── globals.css             # 全局样式
│   ├── layout.tsx              # 布局组件
│   └── page.tsx                # 首页
├── components/                 # React组件
│   ├── ui/                     # UI组件库
│   ├── enhanced-homepage.tsx   # 优化后的首页
│   └── theme-provider.tsx      # 主题提供者
├── hooks/                      # 自定义Hooks
│   └── use-google-auth.ts     # Google认证Hook
├── lib/                        # 工具库
│   ├── db.ts                  # 数据库连接和操作
│   ├── google-auth.ts         # Google认证配置
│   └── utils.ts               # 工具函数
├── public/                     # 静态资源
├── .env.example               # 环境变量示例
├── package.json               # 项目依赖
├── tsconfig.json              # TypeScript配置
├── tailwind.config.js         # Tailwind配置
└── README.md                  # 项目文档
```


## 🔧 核心功能实现

### 1. 用户认证系统

#### Google OAuth 集成
- 使用 Google Identity Services 实现无密码登录
- 自动创建用户记录（首次登录时）
- 安全的会话管理

#### 相关文件：
- `hooks/use-google-auth.ts` - 认证Hook
- `lib/google-auth.ts` - Google认证配置
- `app/page.tsx` - 首页登录入口

### 2. 邮件发送系统

#### 邮件发送流程
1. 用户填写邮件信息（发件人、收件人、主题、内容）
2. 系统验证用户身份和发送限额
3. 记录邮件到数据库
4. 调用 Resend API 发送邮件
5. 更新邮件发送状态

#### 相关文件：
- `app/api/send-email/route.ts` - 邮件发送API
- `lib/db.ts` - 数据库操作
- `lib/resend.ts` - Resend配置

### 3. 数据库设计

#### 数据表结构

**建表**
```sql
-- This script creates the necessary tables and indexes for the email application.
-- It is designed for a MySQL database and uses the InnoDB engine for transaction support and foreign keys.

-- ----------------------------
-- Table structure for users
-- ----------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(36) PRIMARY KEY,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `picture` VARCHAR(500),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for email_records
-- ----------------------------
CREATE TABLE IF NOT EXISTS `email_records` (
  `id` VARCHAR(36) PRIMARY KEY,
  `user_id` VARCHAR(36) NOT NULL,
  `from_name` VARCHAR(255) NOT NULL,
  `sender_email` VARCHAR(255) NOT NULL,
  `recipient` VARCHAR(255) NOT NULL,
  `subject` VARCHAR(500) NOT NULL,
  `content` TEXT NOT NULL,
  `email_id` VARCHAR(255),
  `status` ENUM('sent', 'failed', 'pending') NOT NULL DEFAULT 'pending',
  `sent_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Create Indexes
-- Note: The primary key and unique constraints automatically create indexes.
-- These statements create additional indexes for performance optimization on common query patterns.
-- The `IF NOT EXISTS` syntax for `CREATE INDEX` is supported in MySQL 8.0.29+ and MariaDB 10.1+.
-- For older versions, you might need to remove `IF NOT EXISTS` and check for existence manually.
-- ----------------------------

-- Index for quickly finding all email records for a specific user.
ALTER TABLE `email_records` ADD INDEX `idx_email_records_user_id` (`user_id`);

-- Index for sorting email records by their creation date.
ALTER TABLE `email_records` ADD INDEX `idx_email_records_created_at` (`created_at`);

-- Index for quickly looking up users by their email address (though the UNIQUE constraint already creates one).
ALTER TABLE `users` ADD INDEX `idx_users_email` (`email`);


```

### 4. 前端界面

#### 页面结构
- **首页**：展示功能介绍和登录入口
- **仪表板**：用户概览和快速导航
- **邮件发送页**：完整的邮件发送表单和历史记录

#### 动画效果
- 使用 Framer Motion 实现流畅的页面动画
- 响应式设计，适配各种屏幕尺寸
- 现代化的UI设计

## 📊 API 接口

### 邮件发送 API
- **POST** `/api/send-email`
- 请求体：
```json
{
  "fromName": "发件人姓名",
  "senderEmail": "发件邮箱前缀",
  "recipient": "收件人邮箱",
  "subject": "邮件主题",
  "content": "邮件内容",
  "userEmail": "用户邮箱"
}
```

### 获取邮件历史
- **GET** `/api/user-emails?email=user@example.com`
- 返回用户邮件发送历史记录

## 🎯 使用说明

### 用户注册/登录
1. 访问首页 http://localhost:3000
2. 点击"使用 Google 账户登录"
3. 选择您的 Google 账户并完成授权
4. 自动跳转到仪表板

### 发送邮件
1. 点击导航栏的"发送邮件"
2. 填写邮件信息：
   - 发件人姓名（显示给收件人）
   - 发件邮箱前缀（将显示为 xxx@novatime.top）
   - 收件人邮箱地址
   - 邮件主题
   - 邮件内容（支持HTML格式）
3. 点击"发送邮件"按钮
4. 查看发送结果和历史记录

### 查看历史记录
- 在邮件发送页面右侧查看已发送邮件
- 查看每封邮件的发送状态和时间
- 使用刷新按钮更新最新记录

## 🚀 部署指南

### 生产环境部署

1. **构建项目**
```bash
yarn install
yarn dev
```

2. **环境变量配置**
确保生产环境的环境变量已正确配置

