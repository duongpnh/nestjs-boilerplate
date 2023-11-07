import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from './config.service';

const configService = new ConfigService();
const dataSource = new DataSource(configService.typeOrmConfig as DataSourceOptions);

export default dataSource;
