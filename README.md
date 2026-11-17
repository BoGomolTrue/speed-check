# speed-test

CLI для замера download-скорости по HTTP(S).

## Требования

- Node.js 18+
- npm

## Сборка и запуск

```bash
npm install
npm run build
node dist/speed-test.js [URL] [count]
```

| Аргумент | Обязательный | Описание |
|---|---|---|
| `URL` | да | Цель запросов |
| `count` | нет | Число запросов, default `10`. |

### Пример

```bash
node dist/speed-test.js https://proof.ovh.net/files/10Mb.dat
node dist/speed-test.js https://proof.ovh.net/files/100Mb.dat 5
```

Пример вывода:

```
Запрос 1/10: 10.00 МБ за 812 мс (101.23 Мбит/с)
Запрос 2/10: 10.00 МБ за 795 мс (103.38 Мбит/с)
...
Запрос 10/10: 10.00 МБ за 804 мс (102.22 Мбит/с)
Всего скачано: 100.00 МБ
Среднее время запроса: 806 мс
Средняя скорость: 102.47 Мбит/с
```

## Метрики

Константы единиц — `src/const.ts`.

| Что | Формула |
|---|---|
| Объём, МБ | `bytes / BYTES_PER_MB` (`1024 * 1024`) |
| Время, мс | `performance.now()` до `fetch` и после `arrayBuffer()` |
| Мбит/с | `(bytes * BITS_PER_BYTE) / (ms / MS_PER_SECOND) / BITS_PER_MEGABIT` |

Итоги: `totalBytes` / `totalMs` копятся в цикле. Среднее время — `totalMs / count`. Средняя скорость — по суммам байт и времени, не среднее от per-request Mbps. При ошибке — `exit(1)`, итогов нет.
