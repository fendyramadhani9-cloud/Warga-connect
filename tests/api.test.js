const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../server/server');

describe('WargaKonek API Suite', () => {
  let server;
  let baseUrl;

  before(async () => {
    await new Promise((resolve) => {
      server = app.listen(0, () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  after(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  it('GET /api/health - should return status 200 and healthy response', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(data.message.includes('healthy'));
    assert.ok(data.timestamp);
  });

  it('GET /api/stats - should return village summary statistics', async () => {
    const res = await fetch(`${baseUrl}/api/stats`);
    assert.equal(res.status, 200);

    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(body.data);
    assert.ok(typeof body.data.reports === 'object');
  });

  it('GET /api/report-categories - should return list of categories', async () => {
    const res = await fetch(`${baseUrl}/api/report-categories`);
    assert.equal(res.status, 200);

    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(Array.isArray(body.data));
    assert.ok(body.data.length > 0);
  });

  it('GET /api/announcements - should return announcements and news', async () => {
    const res = await fetch(`${baseUrl}/api/announcements`);
    assert.equal(res.status, 200);

    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(Array.isArray(body.data));
  });

  it('GET /api/events - should return agenda events', async () => {
    const res = await fetch(`${baseUrl}/api/events`);
    assert.equal(res.status, 200);

    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(Array.isArray(body.data));
  });

  it('GET /api/services - should return administrative services list', async () => {
    const res = await fetch(`${baseUrl}/api/services`);
    assert.equal(res.status, 200);

    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(Array.isArray(body.data));
  });

  it('GET /api/public-info - should return public transparency documents', async () => {
    const res = await fetch(`${baseUrl}/api/public-info`);
    assert.equal(res.status, 200);

    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(Array.isArray(body.data));
  });

  it('GET /api/reports - should return citizen reports', async () => {
    const res = await fetch(`${baseUrl}/api/reports`);
    assert.equal(res.status, 200);

    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(Array.isArray(body.data));
  });

  it('GET / - should serve portal homepage HTML', async () => {
    const res = await fetch(`${baseUrl}/`);
    assert.equal(res.status, 200);
    const text = await res.text();
    assert.ok(text.includes('WargaKonek') || text.includes('Pajerukan'));
  });

  it('POST /api/contact - should validate required fields', async () => {
    const res = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.success, false);
  });

  it('GET /api/unknown-endpoint - should return 404 for invalid API route', async () => {
    const res = await fetch(`${baseUrl}/api/unknown-endpoint`);
    assert.equal(res.status, 404);
    const body = await res.json();
    assert.equal(body.success, false);
  });
});
