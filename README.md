# Student Manager - NestJS REST API + PostgreSQL + Prisma ORM

Aplikasi web sederhana manajemen data mahasiswa yang menghubungkan REST API NestJS ke basis data PostgreSQL menggunakan Prisma ORM sehingga seluruh data tersimpan permanen.

## Fitur Utama

- Operasi CRUD lengkap (Create, Read, Update, Delete) untuk entitas `Student` melalui Prisma Client.
- Query lanjutan berupa filter berdasarkan jurusan (`where`) dan pencarian NIM/nama pada `GET /api/students`.
- Endpoint statistik (`GET /api/students/stats`) menggunakan `count`, `aggregate`, dan `groupBy` untuk menampilkan total mahasiswa, rata-rata IPK, serta jumlah mahasiswa per jurusan.
- Antarmuka web responsif untuk tampilan desktop dan mobile yang terhubung langsung ke REST API.

## Teknologi

- NestJS (TypeScript, Express)
- Prisma ORM v6 (`prisma`, `@prisma/client`)
- PostgreSQL 16 (Docker Compose)
- HTML, CSS, dan JavaScript native untuk antarmuka web

## Struktur Proyek

```text
bab10-prisma-api/
├── docs/
│   └── screenshots/
│       ├── 01-desktop-dashboard.png
│       ├── 02-mobile-dashboard.png
│       ├── 03-crud-create-desktop.png
│       ├── 04-filter-and-stats.png
│       └── 05-api-stats-json.png
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.mjs
├── public/
│   └── index.html
├── src/
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   ├── students/
│   │   ├── students.controller.ts
│   │   ├── students.module.ts
│   │   └── students.service.ts
│   ├── app.module.ts
│   └── main.ts
├── test/
│   └── crud.test.mjs
├── docker-compose.yml
├── .env.example
├── package.json
└── tsconfig.json
```

## Cara Menjalankan

1. Salin file konfigurasi environment:

```bash
cp .env.example .env
```

2. Jalankan server PostgreSQL menggunakan Docker Compose:

```bash
docker compose up -d
```

3. Pasang dependensi proyek:

```bash
npm install
```

4. Jalankan migrasi awal Prisma dan isi data awal (seed):

```bash
npx prisma migrate dev --name init
node prisma/seed.mjs
```

5. Build dan jalankan server NestJS:

```bash
npm run build
npm start
```

6. Buka aplikasi di browser pada `http://localhost:3001`.

7. Jalankan pengujian CRUD, filter, dan statistik:

```bash
npm test
```

## Daftar Endpoint API

| Method | Endpoint | Deskripsi |
| --- | --- | --- |
| GET | `/api/students` | Menampilkan seluruh data mahasiswa. Mendukung query `?major=...` dan `?search=...` |
| GET | `/api/students/stats` | Menampilkan total mahasiswa, rata-rata IPK, dan jumlah per jurusan |
| GET | `/api/students/:id` | Menampilkan detail 1 mahasiswa berdasarkan ID |
| POST | `/api/students` | Menambahkan data mahasiswa baru |
| PATCH | `/api/students/:id` | Memperbarui data mahasiswa berdasarkan ID |
| DELETE | `/api/students/:id` | Menghapus data mahasiswa berdasarkan ID |

## Dokumentasi Screenshot

### 1. Tampilan Desktop (1440x900)

![Tampilan Desktop](docs/screenshots/01-desktop-dashboard.png)

### 2. Tampilan Mobile (390x844)

![Tampilan Mobile](docs/screenshots/02-mobile-dashboard.png)

### 3. Pengujian Create Data via UI

![Pengujian Create](docs/screenshots/03-crud-create-desktop.png)

### 4. Filter Jurusan (Query where) dan Statistik

![Filter dan Statistik](docs/screenshots/04-filter-and-stats.png)

### 5. Response JSON Endpoint Statistik (`GET /api/students/stats`)

![Response JSON Statistik](docs/screenshots/05-api-stats-json.png)
