const UPSTREAM = process.env.NODE_ENV === 'development'
  ? 'https://promo.beautykendari.id/api/tv/promos/discounts/today'
  : 'https://promo.beautykendari.id/api/tv/promos/discounts/today';

export default async function handler(req, res) {
  const token = process.env.PROMO_API_TOKEN || 'absgroup-kdi';

  try {
    const upstream = await fetch(UPSTREAM, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const body = await upstream.text();

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.status(upstream.status).send(body);
  } catch (err) {
    res.status(502).json({
      error: 'upstream_unreachable',
      message: 'Gagal menghubungi server promo.',
    });
  }
}
