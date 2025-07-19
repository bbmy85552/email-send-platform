import { Resend } from 'resend';

const resend = new Resend('[读取env]');

resend.emails.send({
  from: '[可自定义邮件名] <[可自定义发送名]@novatime.top>',
  to: '[可自定义收件人]',
  subject: '[可自定义标题]',
  html: ‘[可自定义内容]
});

