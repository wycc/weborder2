import { db } from '../lib/db.js';

export const auditEventService = {
  list() {
    return db.audits;
  },
};

