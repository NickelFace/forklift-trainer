# Handoff для Claude Code

Задача: создать GitHub-репозиторий из этой папки и задеплоить на **Cloudflare Pages**
с кастомным домeном **fork.maks.top**.

Проект — статика без сборки: `index.html` + `data.json`. Ни npm, ни зависимостей, ни бэкенда.

---

## 0. Что уже готово и чего не хватает

Готово:

- `index.html` — тренажёр, логика проверена (flow карточек и экзамена прогонялись через jsdom)
- `build/build.py` — собирает офлайн-версию одним файлом в `dist/`
- `build/extract_data.py` — достаёт `data.json` из готовой офлайн-версии
- `README.md`, `.gitignore` (исключает `sources/` и `dist/`)

Не хватает — **сделать первым делом**:

1. **`data.json`.** Банк вопросов вшит в файл `forklift-trainer.html`, который лежит **на уровень выше**
   этой папки. Всё вместе — данные, офлайн-сборка, zip-архив — делается одной командой:

   ```bash
   cd fork-trainer
   bash setup.sh
   # или по шагам:
   #   python3 build/extract_data.py ../forklift-trainer.html
   #   python3 build/build.py
   ```

   Скрипт проверяет, что вышло 68 открытых + 60 тестовых вопросов и что все варианты целы.
   После этого `build/extract_data.py` и `setup.sh` можно удалить — они одноразовые.

2. **`sources/`** — папка пустая. Исходные PDF (`Quiz — model answers` и `Forklift Theory Study Guide`)
   лежат в проекте Claude.ai «Forklift»; если нужны локально для сверки — положить их туда руками.
   В git они всё равно не попадут. Для деплоя не нужны вообще.

Больше ничего переписывать не нужно. Работа — данные, репозиторий, деплой, DNS.

## 1. Проверить локально

```bash
cd fork-trainer
python3 -m http.server 8000
# http://localhost:8000 — открыть все 5 разделов, пройти 10 вопросов экзамена,
# перезагрузить страницу и убедиться, что прогресс на главном экране сохранился
python3 build/build.py && open dist/forklift-trainer.html   # офлайн-версия
```

Критерии успеха: главный экран показывает «68», экзамен считает процент, после перезагрузки
статистика не обнулилась, консоль без ошибок.

## 2. Git + GitHub

```bash
git init -b main
git add .
git status            # ПРОВЕРИТЬ: sources/*.pdf и dist/ не должны попасть в индекс
git commit -m "Forklift TLILIC0003 trainer: 68 open questions + 60 MCQ"

gh repo create forklift-trainer --public --source=. --remote=origin --push
```

Если репозиторий приватный (`--private`) — Cloudflare Pages это поддерживает, GitHub Pages на
free-тарифе нет. Выбор за пользователем; по умолчанию делай **public**, но перед `gh repo create`
переспроси, если увидишь что-то личное в истории.

## 3. Cloudflare Pages

Вариант А — дашборд (быстрее всего):

1. Cloudflare → Workers & Pages → Create → Pages → Connect to Git → выбрать `forklift-trainer`
2. Build settings: **Framework preset: None**, build command — пустое, output directory — `/`
   (корень репозитория; всё уже статика)
3. Save and Deploy → получится `forklift-trainer.pages.dev`
4. Custom domains → Set up a custom domain → `fork.maks.top` → Activate.
   Если зона `maks.top` в этом же аккаунте Cloudflare, CNAME-запись создастся автоматически
   и сертификат выпустится сам (обычно 1–3 минуты).

Вариант Б — CLI, если пользователь предпочитает wrangler:

```bash
npm i -g wrangler
wrangler login
wrangler pages project create forklift-trainer --production-branch main
wrangler pages deploy . --project-name forklift-trainer
# домен всё равно привязывается в дашборде: Pages → project → Custom domains
```

Если зона `maks.top` **не** в Cloudflare — добавить у текущего DNS-провайдера:

```
CNAME   fork   forklift-trainer.pages.dev   (proxy/CDN по желанию, TTL авто)
```

## 4. Проверка после деплоя

- `curl -sI https://fork.maks.top | head -3` → `HTTP/2 200`
- `curl -s https://fork.maks.top/data.json | head -c 80` → начинается с `{"quiz":`
- открыть в браузере, пройти 10 вопросов экзамена, обновить страницу — прогресс на месте
- проверить с телефона: вёрстка адаптивная, кнопки в один тап

## 5. Мелочи, которые стоит добавить (не обязательно)

- `<meta name="theme-color" content="#11161c">` и favicon — сейчас их нет
- PWA-манифест + service worker, чтобы работало офлайн с телефона на площадке
- экспорт/импорт прогресса в JSON (сейчас привязан к одному браузеру)
- `_headers` для Cloudflare с `Cache-Control: no-cache` на `data.json`, чтобы правки вопросов
  подхватывались сразу

## Осторожно

- `sources/` — учебные материалы Licences4Work. В git не попадают, в публичный интернет тоже.
  Если `.gitignore` не сработал, файлы надо убрать из индекса до первого push.
- Правки банка вопросов делаются **только** в `data.json` — код на структуру данных не завязан.
  Схема полей описана в README.
- Два расхождения в источниках описаны в README (раздел «Источники и оговорки») — если пользователь
  уточнит у ассессора правильную версию, поправить нужные записи в `data.json`.
