/*
FILE: src/app/app.routes.server.ts
WHAT: Configures how routes are rendered.
WHY: Renders student story pages in the browser without prerendering IDs.
*/

import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'students/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];