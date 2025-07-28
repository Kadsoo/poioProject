import { MidwayConfig } from '@midwayjs/core';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1703123456789_1234',
  koa: {
    port: 7001,
  },
  typeorm: {
    dataSource: {
      default: {
        type: 'sqlite',
        database: 'webapp.sqlite',
        synchronize: true,
        logging: false,
        entities: ['**/entity/*.entity{.ts,.js}'],
      },
    },
  },
} as MidwayConfig;
