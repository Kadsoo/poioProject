import { MidwayConfig } from '@midwayjs/core';
import { User } from '../entity/user.entity';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1751442019100_3929',
  koa: {
    port: 7001,
  },
  typeorm: {
    dataSource: {
      default: {
        type: 'sqlite',
        database: 'webapp.sqlite',
        synchronize: true,
        logging: true,
        entities: [__dirname + '/../entity/*.ts', User]
      }
    }
  },
} as MidwayConfig;
