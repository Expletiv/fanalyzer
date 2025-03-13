import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { match } from 'ts-pattern';
import { YahooFinanceMethod } from './app/types/yahoo-finance';
import { isDevMode } from '@angular/core';
import yahooFinance from 'yahoo-finance2';

export function app(): express.Express {
  const server = express();
  server.set('trust proxy', true);

  // Parse JSON request bodies
  server.use(express.json());

  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');

  // SSR in v19 via AngularNodeAppEngine -> https://github.com/JeanMeche/ssr-v19/tree/main
  const angularNodeAppEngine = new AngularNodeAppEngine();

  /**
   * API endpoint for Yahoo Finance data.
   */
  server.post('/api/yahoo-finance', async (req, res) => {
    const method: YahooFinanceMethod = req.body.method;
    const args = req.body.args;

    try {
      const result = await match(method)
        .with('search', () => yahooFinance.search(...(args as Parameters<typeof yahooFinance.search>)))
        .with('chart', () => yahooFinance.chart(...(args as Parameters<typeof yahooFinance.chart>)))
        .otherwise(() => Promise.reject(new Error(`Unknown method: ${method}`)));

      res.json(result);
    } catch (error) {
      console.error("Error caught:", error);
      res.status(500);

      if (!isDevMode()) {
        res.json({
          success: false,
          message: "An error occurred while processing your request",
        });

        return;
      }

      res.json({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
    }
  });

  /**
   * Serve static files from /browser
   */
  server.get(
    '**',
    express.static(browserDistFolder, {
      maxAge: '1y',
      index: 'index.html'
    }),
  );

  /**
   * Handle all other requests by rendering the Angular application.
   */
  server.get('**', (req, res, next) => {
    angularNodeAppEngine
      .handle(req)
      .then((response) => {
        if (response) {
          writeResponseToNodeResponse(response, res);
        } else {
          next();
        }
      })
      .catch(next)
  });

  return server;
}

const server = app();

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(server);
