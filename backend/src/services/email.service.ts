export type EmailMessage = { to: string; subject: string; html: string };

const outbox: EmailMessage[] = [];

export const emailService = {
  async sendVerificationEmail(email: string, link: string): Promise<void> {
    outbox.push({
      to: email,
      subject: 'Verify your email',
      html: `<a href="${link}">Verify</a>`,
    });
  },
  getOutbox(): EmailMessage[] {
    return outbox;
  },
  resetOutbox(): void {
    outbox.length = 0;
  },
};

