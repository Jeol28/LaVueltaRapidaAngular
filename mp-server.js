const express = require('express');
const cors = require('cors');
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');

const PORT = process.env.MP_PORT || 3001;
const ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;
const PUBLIC_KEY   = process.env.MERCADOPAGO_PUBLIC_KEY;

if (!ACCESS_TOKEN) {
  console.error('[mp-server] FALTA MERCADOPAGO_ACCESS_TOKEN en variables de entorno.');
}

const client = new MercadoPagoConfig({ accessToken: ACCESS_TOKEN || 'TEST-missing' });
const preferenceClient = new Preference(client);
const paymentClient    = new Payment(client);

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/mp/health', (_req, res) => {
  res.json({
    ok: true,
    hasAccessToken: !!ACCESS_TOKEN,
    publicKey: PUBLIC_KEY ? PUBLIC_KEY.slice(0, 12) + '…' : null
  });
});

app.get('/api/mp/public-key', (_req, res) => {
  res.json({ publicKey: PUBLIC_KEY || null });
});

app.post('/api/mp/preference', async (req, res) => {
  try {
    const {
      pedidoId,
      total,
      items,
      payer,
      origin
    } = req.body || {};

    if (!pedidoId || !total || total <= 0) {
      return res.status(400).json({ error: 'pedidoId y total son obligatorios.' });
    }

    const baseUrl = (origin || '').replace(/\/+$/, '');
    if (!baseUrl) {
      return res.status(400).json({ error: 'Falta el origin para construir back_urls.' });
    }

    const itemsMP = (Array.isArray(items) && items.length > 0)
      ? items.map((it) => ({
          id: String(it.id ?? 'item'),
          title: String(it.title ?? 'Producto').slice(0, 250),
          quantity: Math.max(1, parseInt(it.quantity ?? 1, 10)),
          unit_price: Math.round(Number(it.unit_price ?? 0)),
          currency_id: 'COP'
        }))
      : [{
          id: `pedido-${pedidoId}`,
          title: `Pedido La Vuelta Rápida #${pedidoId}`,
          quantity: 1,
          unit_price: Math.round(Number(total)),
          currency_id: 'COP'
        }];

    const body = {
      items: itemsMP,
      external_reference: String(pedidoId),
      statement_descriptor: 'LA VUELTA RAPIDA',
      back_urls: {
        success: `${baseUrl}/pago/resultado/${pedidoId}`,
        failure: `${baseUrl}/pago/resultado/${pedidoId}`,
        pending: `${baseUrl}/pago/resultado/${pedidoId}`
      },
      auto_return: 'approved',
      binary_mode: false,
      payment_methods: {
        excluded_payment_types: [],
        installments: 12
      }
    };

    if (payer && (payer.email || payer.name)) {
      body.payer = {
        name:  payer.name  || undefined,
        email: payer.email || undefined
      };
    }

    const result = await preferenceClient.create({ body });

    res.json({
      id: result.id,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point
    });
  } catch (err) {
    console.error('[mp-server] error creando preferencia:', err?.message || err);
    res.status(500).json({
      error: 'No se pudo crear la preferencia de pago.',
      detail: err?.message || String(err)
    });
  }
});

app.get('/api/mp/payment/:paymentId', async (req, res) => {
  try {
    const paymentId = req.params.paymentId;
    if (!paymentId) return res.status(400).json({ error: 'paymentId requerido.' });
    const payment = await paymentClient.get({ id: paymentId });
    res.json({
      id: payment.id,
      status: payment.status,
      status_detail: payment.status_detail,
      payment_method_id: payment.payment_method_id,
      payment_type_id: payment.payment_type_id,
      transaction_amount: payment.transaction_amount,
      currency_id: payment.currency_id,
      external_reference: payment.external_reference,
      date_approved: payment.date_approved,
      payer: payment.payer ? { email: payment.payer.email } : null
    });
  } catch (err) {
    console.error('[mp-server] error consultando pago:', err?.message || err);
    res.status(500).json({ error: 'No se pudo consultar el pago.', detail: err?.message || String(err) });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[mp-server] escuchando en http://0.0.0.0:${PORT}`);
});
