import assert from 'node:assert/strict';

const base = process.env.API_URL ?? 'http://localhost:3001/api/students';
const uniqueNim = `2399${Date.now().toString().slice(-4)}`;

const createRes = await fetch(base, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nim: uniqueNim,
    name: 'Test Mahasiswa',
    major: 'Teknik Informatika',
    semester: 4,
    gpa: 3.75,
  }),
});
assert.equal(createRes.status, 201, `Create failed: ${createRes.status}`);
const created = (await createRes.json()).data;
assert.equal(created.nim, uniqueNim);

const readRes = await fetch(`${base}/${created.id}`);
assert.equal(readRes.status, 200);
assert.equal((await readRes.json()).data.name, 'Test Mahasiswa');

const updateRes = await fetch(`${base}/${created.id}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ semester: 5, gpa: 3.9 }),
});
assert.equal(updateRes.status, 200);
const updated = (await updateRes.json()).data;
assert.equal(updated.semester, 5);
assert.equal(updated.gpa, 3.9);

const filterRes = await fetch(`${base}?major=${encodeURIComponent('Teknik Informatika')}`);
assert.equal(filterRes.status, 200);
const filtered = (await filterRes.json()).data;
assert.ok(filtered.some((s) => s.id === created.id));

const statsRes = await fetch(`${base}/stats`);
assert.equal(statsRes.status, 200);
const stats = await statsRes.json();
assert.ok(stats.totalStudents >= 1);

const deleteRes = await fetch(`${base}/${created.id}`, { method: 'DELETE' });
assert.equal(deleteRes.status, 200);

const notFoundRes = await fetch(`${base}/${created.id}`);
assert.equal(notFoundRes.status, 404);

console.log('OK: CRUD + filter + stats passed');
