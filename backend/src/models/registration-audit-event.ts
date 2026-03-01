export type RegistrationAuditEvent = {
  id: string;
  eventType:
    | 'REGISTRATION_SUBMITTED'
    | 'VERIFICATION_SUCCEEDED'
    | 'VERIFICATION_FAILED'
    | 'VERIFICATION_RESENT';
  userId: string | null;
  emailMasked: string;
  result: 'SUCCESS' | 'FAILURE';
  reasonCode: string | null;
  occurredAt: Date;
  metadata?: Record<string, unknown>;
};

