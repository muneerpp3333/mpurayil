interface Env {
  DB: D1Database;
  TURNSTILE_SECRET: string;
}

interface IntakeBody {
  name: string;
  email: string;
  company?: string;
  scope?: string;
  budget?: string;
  details?: string;
  turnstileToken: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  // Origin check
  const origin = request.headers.get('Origin') || '';
  if (!origin.includes('mpurayil.com') && !origin.includes('localhost')) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const corsHeaders = {
    'Access-Control-Allow-Origin': origin,
    'Content-Type': 'application/json',
  };

  try {
    const body: IntakeBody = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.turnstileToken) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Validate Turnstile token
    const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET,
        response: body.turnstileToken,
        remoteip: request.headers.get('CF-Connecting-IP') || '',
      }),
    });

    const turnstileData = await turnstileRes.json() as { success: boolean };
    if (!turnstileData.success) {
      return new Response(JSON.stringify({ error: 'Bot verification failed' }), {
        status: 403,
        headers: corsHeaders,
      });
    }

    // Insert into D1
    const result = await env.DB.prepare(
      'INSERT INTO submissions (name, email, company, scope, budget, details) VALUES (?, ?, ?, ?, ?, ?)'
    )
      .bind(
        body.name,
        body.email,
        body.company || null,
        body.scope || null,
        body.budget || null,
        body.details || null,
      )
      .run();

    return new Response(JSON.stringify({ success: true, id: result.meta.last_row_id }), {
      status: 201,
      headers: corsHeaders,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
};

// Handle CORS preflight
export const onRequestOptions: PagesFunction<Env> = async (context) => {
  const origin = context.request.headers.get('Origin') || '';
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': origin.includes('mpurayil.com') || origin.includes('localhost') ? origin : '',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
};
