// types/express.d.ts

import * as express from 'express';

// Extend the Express Request interface to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; username: string; type: string };
    }
  }
}
