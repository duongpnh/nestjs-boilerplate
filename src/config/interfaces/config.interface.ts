import { IDBConfig } from './db.interface';
import { IJwt } from './jwt.interface';
import { ILog } from './log.interface';

export interface IConfig {
  nodeEnv: string;
  port: number;
  jwtConfig: IJwt;
  db: IDBConfig;
  log: ILog;
}
