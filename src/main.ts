import 'reflect-metadata';
import path from 'node:path';
import express from 'express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

try {
  process.loadEnvFile();
} catch {
  // .env is optional when env vars are supplied by the host
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(express.static(path.join(__dirname, '..', 'public')));

  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
}

bootstrap();
