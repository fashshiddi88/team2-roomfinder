import App from './app';
import { startTransactionStatusJob } from './cron/jobs/transactionJobs';

const main = () => {
  // init db here

  const app = new App();
  app.start();
};

startTransactionStatusJob();
main();
