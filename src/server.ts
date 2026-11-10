
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';

import express from 'express';
import { join } from 'node:path';
import { registerMockAuth } from './mock-api/mock-auth';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// Register mock authentication and student/staff endpoints.
registerMockAuth(app);

/**
 * Example Express REST API endpoints can be defined here.
 *
 * Example:
 *
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 */

/**
 * Serve static files from /browser.
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response
        ? writeResponseToNodeResponse(response, res)
        : next()
    )
    .catch(next);
});

/**
 * Start the server if this is the main entry point.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;

  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(
      `Node Express server listening on http://localhost:${port}`
    );
  });
}

/**
 * Request handler used by Angular CLI and during builds.
 */
export const reqHandler = createNodeRequestHandler(app);
