interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);

  const status = url.searchParams.get('status') || null;
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 100);
  const offset = parseInt(url.searchParams.get('offset') || '0');

  let query = 'SELECT * FROM submissions';
  const params: (string | number)[] = [];

  if (status) {
    query += ' WHERE status = ?';
    params.push(status);
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const results = await env.DB.prepare(query).bind(...params).all();

  // Get total count
  let countQuery = 'SELECT COUNT(*) as total FROM submissions';
  const countParams: string[] = [];
  if (status) {
    countQuery += ' WHERE status = ?';
    countParams.push(status);
  }
  const countResult = await env.DB.prepare(countQuery).bind(...countParams).first<{ total: number }>();

  return new Response(
    JSON.stringify({
      submissions: results.results,
      total: countResult?.total || 0,
      limit,
      offset,
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    },
  );
};

// Update submission status
export const onRequestPatch: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const body = await request.json() as { id: number; status: string };

  if (!body.id || !body.status) {
    return new Response(JSON.stringify({ error: 'Missing id or status' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const validStatuses = ['new', 'contacted', 'qualified', 'closed'];
  if (!validStatuses.includes(body.status)) {
    return new Response(JSON.stringify({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  await env.DB.prepare("UPDATE submissions SET status = ?, updated_at = datetime('now') WHERE id = ?")
    .bind(body.status, body.id)
    .run();

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
