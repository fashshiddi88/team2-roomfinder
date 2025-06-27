import cron from 'node-cron';
import { markFinishedBookings } from '../markFinished';

export function startMarkBookingDoneJob() {
  cron.schedule('0 14 * * *', async () => {
    console.log('[CRON] Checking bookings to mark as DONE...');
    try {
      await markFinishedBookings();
      console.log('[CRON] Bookings updated to DONE.');
    } catch (err) {
      console.error('[CRON] Failed to update bookings to DONE:', err);
    }
  });
}
