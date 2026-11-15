import * as nodemailer from 'nodemailer'
import { MailMessage } from '@carecircle/shared'

export interface MailTransport {
  send(message: MailMessage): Promise<{ accepted: boolean; messageId?: string }>
}

export class SMTPMailTransport implements MailTransport {
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'localhost',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USERNAME || '',
        pass: process.env.SMTP_PASSWORD || '',
      },
    })
  }

  async send(message: MailMessage): Promise<{ accepted: boolean; messageId?: string }> {
    const from = process.env.SMTP_FROM_ADDRESS || 'notifications@carecircle.health'
    const info = await this.transporter.sendMail({
      from,
      to: message.to,
      subject: message.subject,
      text: message.text,
      html: message.html,
    })

    return {
      accepted: info.accepted.length > 0,
      messageId: info.messageId,
    }
  }
}

/**
 * In-memory captured mail transport for local testing and Firebase emulator environments.
 */
export class CaptureMailTransport implements MailTransport {
  public static sentMessages: MailMessage[] = []

  async send(message: MailMessage): Promise<{ accepted: boolean; messageId?: string }> {
    CaptureMailTransport.sentMessages.push(message)
    return {
      accepted: true,
      messageId: `captured-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    }
  }

  static getLatestMessage(): MailMessage | undefined {
    return this.sentMessages[this.sentMessages.length - 1]
  }

  static clear(): void {
    this.sentMessages = []
  }
}

export function getMailTransport(): MailTransport {
  if (process.env.NODE_ENV === 'test' || !process.env.SMTP_HOST) {
    return new CaptureMailTransport()
  }
  return new SMTPMailTransport()
}
