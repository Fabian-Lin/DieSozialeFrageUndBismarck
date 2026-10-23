import { onRequest } from './functions/api/chat.js';

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);

    if (pathname.startsWith('/api/')) {
      if (pathname === '/api/chat') {
        return onRequest({ request, env });
      }
      return Response.json(
        { error: 'Seite nicht gefunden.' },
        {
          status: 404,
          headers: {
            'Cache-Control': 'no-store',
            'X-Content-Type-Options': 'nosniff'
          }
        }
      );
    }

    return env.ASSETS.fetch(request);
  }
};
