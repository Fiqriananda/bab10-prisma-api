import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const students = [
  { nim: '2301001', name: 'Budi Santoso', major: 'Teknik Informatika', semester: 4, gpa: 3.72 },
  { nim: '2301002', name: 'Siti Rahmawati', major: 'Sistem Informasi', semester: 4, gpa: 3.85 },
  { nim: '2301003', name: 'Andi Pratama', major: 'Teknik Informatika', semester: 6, gpa: 3.60 },
  { nim: '2301004', name: 'Dewi Lestari', major: 'Ilmu Komputer', semester: 2, gpa: 3.91 },
];

for (const s of students) {
  await prisma.student.upsert({
    where: { nim: s.nim },
    update: {},
    create: s,
  });
}

await prisma.$disconnect();
console.log('Seeded 4 students');
