import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { InversifyExpressServer } from 'inversify-express-utils';
import { container } from '../ioc';

import '../../../modules/users/infra/http/controllers';
import '../../../modules/recruitment/candidate/infra/http/controllers';

import '../database/sequelize/hooks';

class Server {
  server;
  constructor() {
    this.server = new InversifyExpressServer(container);
  }
  start(): void {
    this.server.setConfig((app) => {
      app.use(cors());
      app.use(helmet());
      app.use(express.json());
    });

    const application = this.server.build();

    const port = parseInt(process.env.PORT, 10) || 4000;

    application.listen(port, () => {
      console.log(`🚀 Server started on port ${port}`);
    });
  }
}

export default Server;
