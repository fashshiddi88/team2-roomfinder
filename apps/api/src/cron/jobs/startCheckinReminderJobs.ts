import cron from 'node-cron';
import { sendCheckinReminders } from '../sendCheckinReminder';

export function startCheckinReminderJob() {
  cron.schedule('0 8 * * *', async () => {
    console.log('[CRON] Sending check-in reminder emails...');
    try {
      await sendCheckinReminders();
      console.log('[CRON] Check-in reminder emails sent successfully.');
    } catch (error) {
      console.error('[CRON] Failed to send check-in reminders:', error);
    }
  });
}
