import mysql from 'mysql2/promise';
import crypto from 'crypto';

// 数据库接口定义
export interface EmailUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  created_at: string;
  updated_at: string;
}

export interface EmailRecord {
  id: string;
  user_id: string;
  from_name: string;
  sender_email: string;
  recipient: string;
  subject: string;
  content: string;
  email_id?: string;
  status: 'sent' | 'failed' | 'pending';
  sent_at: string;
  created_at: string;
}

// 数据库连接配置
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'email_app',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool: mysql.Pool | null = null;

// 获取数据库连接池
function getPool() {
  if (!pool) {
    console.log('创建数据库连接池:', {
      host: dbConfig.host,
      database: dbConfig.database,
      port: dbConfig.port,
      user: dbConfig.user
    });
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

// 初始化数据库表
export async function initDb() {
  try {
    const pool = getPool();
    
    // 创建用户表
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        picture VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    // 创建邮件记录表
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS email_records (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        from_name VARCHAR(255) NOT NULL,
        sender_email VARCHAR(255) NOT NULL,
        recipient VARCHAR(255) NOT NULL,
        subject VARCHAR(500) NOT NULL,
        content TEXT NOT NULL,
        email_id VARCHAR(255),
        status ENUM('sent', 'failed', 'pending') NOT NULL DEFAULT 'pending',
        sent_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    // 索引已在表定义中创建，这里无需重复创建
    
    console.log('MySQL数据库初始化完成');
  } catch (error) {
    console.error('数据库初始化失败:', error);
    throw error;
  }
}

// 用户相关操作
export async function createOrUpdateUser(userData: Omit<EmailUser, 'created_at' | 'updated_at'>): Promise<EmailUser> {
  const pool = getPool();
  
  // 检查用户是否存在
  const existingUser = await getUserByEmail(userData.email);
  
  if (existingUser) {
    // 更新用户信息
    await pool.execute(
      'UPDATE users SET name = ?, picture = ?, updated_at = CURRENT_TIMESTAMP WHERE email = ?',
      [userData.name, userData.picture || null, userData.email]
    );
    return { ...existingUser, ...userData };
  } else {
    // 创建新用户
    await pool.execute(
      'INSERT INTO users (id, email, name, picture) VALUES (?, ?, ?, ?)',
      [userData.id, userData.email, userData.name, userData.picture || null]
    );
    const newUser = await getUserByEmail(userData.email);
    return newUser!;
  }
}

export async function getUserByEmail(email: string): Promise<EmailUser | null> {
  const pool = getPool();
  const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
  const users = rows as any[];
  return users.length > 0 ? users[0] : null;
}

export async function getUserById(id: string): Promise<EmailUser | null> {
  const pool = getPool();
  const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
  const users = rows as any[];
  return users.length > 0 ? users[0] : null;
}

// 邮件记录相关操作
export async function createEmailRecord(recordData: Omit<EmailRecord, 'id' | 'created_at'>) {
  const pool = getPool();
  const id = crypto.randomUUID();
  
  // 使用MySQL兼容的日期时间格式
  const mysqlDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
  
  await pool.execute(
    'INSERT INTO email_records (id, user_id, from_name, sender_email, recipient, subject, content, email_id, status, sent_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      id,
      recordData.user_id,
      recordData.from_name,
      recordData.sender_email,
      recordData.recipient,
      recordData.subject,
      recordData.content,
      recordData.email_id || null,
      recordData.status,
      mysqlDateTime
    ]
  );
  
  const [rows] = await pool.execute('SELECT * FROM email_records WHERE id = ?', [id]);
  return (rows as any[])[0];
}

export async function getEmailRecordsByUser(userId: string): Promise<EmailRecord[]> {
  const pool = getPool();
  const [rows] = await pool.execute(
    'SELECT * FROM email_records WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  );
  return rows as EmailRecord[];
}

export async function updateEmailStatus(emailId: string, status: 'sent' | 'failed', emailServiceId?: string) {
  const pool = getPool();
  await pool.execute(
    'UPDATE email_records SET status = ?, email_id = ?, sent_at = CURRENT_TIMESTAMP WHERE id = ?',
    [status, emailServiceId || null, emailId]
  );
}

// 获取用户每日发邮件次数
export async function getDailyEmailCount(userId: string): Promise<number> {
  const pool = getPool();
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format
  
  const [rows] = await pool.execute(
    'SELECT COUNT(*) as count FROM email_records WHERE user_id = ? AND DATE(created_at) = ?',
    [userId, today]
  );
  
  const result = rows as any[];
  return result[0]?.count || 0;
}

// 获取用户每日发邮件详情
export async function getDailyEmailDetails(userId: string): Promise<EmailRecord[]> {
  const pool = getPool();
  const today = new Date().toISOString().slice(0, 10);
  
  const [rows] = await pool.execute(
    'SELECT * FROM email_records WHERE user_id = ? AND DATE(created_at) = ? ORDER BY created_at DESC',
    [userId, today]
  );
  
  return rows as EmailRecord[];
}