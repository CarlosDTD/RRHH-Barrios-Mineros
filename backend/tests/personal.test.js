const request = require('supertest');
const app = require('../src/index');
const db = require('../src/config/db');

describe('Personal API CRUD Tests', () => {
  let testCi = '9999999-TEST';

  // Limpieza después de los tests
  afterAll(async () => {
    await db.query('DELETE FROM personal WHERE ci = $1', [testCi]);
  });

  test('GET /api/personal should return a list', async () => {
    const res = await request(app).get('/api/personal');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  test('POST /api/personal should create a new record', async () => {
    const newPersonal = {
      ci: testCi,
      primer_nombre: 'Test User',
      apellido_paterno: 'Automation',
      telefono: '12345678'
    };
    
    const res = await request(app)
      .post('/api/personal')
      .send(newPersonal);
    
    expect(res.statusCode).toEqual(201);
    expect(res.body.ci).toEqual(testCi);
  });

  test('GET /api/personal with filter should find the record', async () => {
    const res = await request(app)
      .get('/api/personal')
      .query({ ci: testCi });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].ci).toEqual(testCi);
  });

  test('GET /api/personal/export should return excel buffer', async () => {
    const res = await request(app).get('/api/personal/export');
    expect(res.statusCode).toEqual(200);
    expect(res.headers['content-type']).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  });
});
