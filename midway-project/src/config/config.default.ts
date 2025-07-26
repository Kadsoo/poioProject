import { MidwayConfig } from '@midwayjs/core';
import { User } from '../entity/user.entity';
import { BlindBox } from '../entity/blindbox.entity';
import { Order } from '../entity/order.entity';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1701234567890_1234',
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
        entities: [User, BlindBox, Order]
      }
    }
  }
} as MidwayConfig;
