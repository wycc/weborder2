import { randomUUID } from 'node:crypto';
import { db } from './db.js';
import type { RegistrationAuditEvent } from '../models/registration-audit-event.js';

export const maskEmail = (email: string): string => {
  const [local, domain] = email.split('@');
  const left = local.length > 2 ? `${local[0]}***${local[local.length - 1]}` : '***';
  return `${left}@${domain ?? '***'}`;
};

export const auditLog = (
  event: Omit<RegistrationAuditEvent, 'id' | 'occurredAt' | 'emailMasked'> & { email: string },
): void => {
  db.audits.push({
    id: randomUUID(),
    eventType: event.eventType,
    userId: event.userId,
    emailMasked: maskEmail(event.email),
    result: event.result,
    reasonCode: event.reasonCode,
    occurredAt: new Date(),
    metadata: event.metadata,
  });
};

