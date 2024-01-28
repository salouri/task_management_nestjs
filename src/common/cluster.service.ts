import { Injectable, Logger } from '@nestjs/common';

import * as os from 'os';
const cluster = require('cluster');

const numCPUs = os.cpus().length;

@Injectable()
export class ClusterService {
  static clusterize = (callback: Function): void => {
    const logger = new Logger('AppClusterService');
    cluster.schedulingPolicy = cluster.SCHED_RR;
    if (cluster.isPrimary) {
      logger.verbose(`Primary server started on ${process.pid}`);

      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }
      cluster.on('exit', (worker, code, signal) => {
        logger.verbose(`Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork();
      });
    } else {
      logger.verbose(`Cluster server started on ${process.pid}`);
      callback();
    }
  };
}
