import express, {
  json,
  urlencoded,
  Express,
  Request,
  Response,
  NextFunction,
  Router,
} from 'express';
import cors from 'cors';
import { PORT } from './config';
import { AuthRouter } from './routers/auth.router';
import { OauthRouter } from './routers/oauth.router';
import { ProfileRouter } from './routers/profile.router';
import { PropertyCategoryRouter } from './routers/propertyCategory.router';
import { PropertyRouter } from './routers/property.router';
import { RoomRouter } from './routers/room.router';
import { RoomAvailabilityRouter } from './routers/roomAvailability.router';
import { PeakSeasonRateRouter } from './routers/peakSeasonRate.router';

export default class App {
  private app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.handleError();
  }

  private configure(): void {
    this.app.use(cors());
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
  }

  private handleError(): void {
    // not found
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.path.includes('/api/')) {
        res.status(404).send('Not found !');
      } else {
        next();
      }
    });

    // error
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        if (req.path.includes('/api/')) {
          console.error('Error : ', err.stack);
          res.status(500).send('Error !');
        } else {
          next();
        }
      },
    );
  }

  private routes(): void {
    this.app.use('/api', new AuthRouter().router);
    this.app.use('/api', new OauthRouter().router);
    this.app.use('/api', new ProfileRouter().router);
    this.app.use('/api', new PropertyCategoryRouter().router);
    this.app.use('/api', new PropertyRouter().router);
    this.app.use('/api', new RoomRouter().router);
    this.app.use('/api', new RoomAvailabilityRouter().router);
    this.app.use('/api', new PeakSeasonRateRouter().router);
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`  ➜  [API] Local:   http://localhost:${PORT}/`);
    });
  }
}
