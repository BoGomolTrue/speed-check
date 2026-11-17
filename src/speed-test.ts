#!/usr/bin/env node

import {
  BITS_PER_BYTE,
  BITS_PER_MEGABIT,
  BYTES_PER_MB,
  DEFAULT_COUNT,
  MS_PER_SECOND,
} from './const';

function parseArgs(): IArgs {
  const url = process.argv[2];
  const parsed = Number.parseInt(process.argv[3] ?? '', 10);
  const count = Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_COUNT;

  if (!url) {
    console.error('Использование: node dist/speed-test.js [URL] [количество запросов]');
    process.exit(1);
  }

  return { url, count };
}

async function requestOnce(url: string): Promise<IRequestResponse> {
  const start = performance.now();

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Сервер вернул статус ${res.status}`);
  }

  const body = await res.arrayBuffer();
  const end = performance.now();

  return {
    bytes: body.byteLength,
    ms: end - start,
  };
}

async function main(): Promise<void> {
  const { url, count } = parseArgs();

  let totalBytes = 0;
  let totalMs = 0;

  for (let i = 1; i <= count; i++) {
    try {
      const result = await requestOnce(url);
      totalBytes += result.bytes;
      totalMs += result.ms;

      const mb = (result.bytes / BYTES_PER_MB).toFixed(2);
      const ms = result.ms.toFixed(0);
      const mbps = (
        (result.bytes * BITS_PER_BYTE) / (result.ms / MS_PER_SECOND) / BITS_PER_MEGABIT
      ).toFixed(2);

      console.log(`Запрос ${i}/${count}: ${mb} МБ за ${ms} мс (${mbps} Мбит/с)`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`Запрос ${i}/${count} завершился ошибкой: ${message}`);
      process.exit(1);
    }
  }

  const avgMs = totalMs / count;

  const totalMB = totalBytes / BYTES_PER_MB;
  const avgSpeedMbps =
    (totalBytes * BITS_PER_BYTE) / (totalMs / MS_PER_SECOND) / BITS_PER_MEGABIT;

  console.log(`Всего скачано: ${totalMB.toFixed(2)} МБ`);
  console.log(`Среднее время запроса: ${avgMs.toFixed(0)} мс`);
  console.log(`Средняя скорость: ${avgSpeedMbps.toFixed(2)} Мбит/с`);
}

main();
