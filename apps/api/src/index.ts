import App from './app';
import { startTransactionStatusJob } from './cron/jobs/transactionJobs';
import { startCheckinReminderJob } from './cron/jobs/startCheckinReminderJobs';

const main = () => {
  // init db here

  const app = new App();
  app.start();
};

startTransactionStatusJob();
startCheckinReminderJob();
main();
