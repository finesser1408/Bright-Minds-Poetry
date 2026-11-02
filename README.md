# Bright Minds Poetry

A community platform for poets to publish poems and publications, read work shared by other members, and connect through likes, comments, profiles, email, and WhatsApp.

## Product and architecture

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, React Router, Axios.
- **Backend:** Django REST Framework, dj-rest-auth, django-allauth, SimpleJWT.
- **Data:** SQLite for local development; PostgreSQL via `DATABASE_URL` for production.
- **Uploads:** Django media storage (`MEDIA_ROOT`). Production must use persistent/object storage or a persistent volume; local container filesystems are not durable.
- **Authentication:** JWTs in `HttpOnly` cookies, CSRF protection for unsafe requests, Django password validators, mandatory email verification, login throttling, and API-level ownership checks.

### Page inventory

| Path | Purpose |
| --- | --- |
| `/` | Home / landing page |
| `/about` | About the organization |
| `/services` | Community and services |
| `/gallery` | Public poetry/publication gallery |
| `/contact` | Contact form, email links, phone links, WhatsApp |
| `/community` | Sign-in/register and member studio/feed |
| `/login` | Standalone sign-in page |
| `/register` | Standalone registration page |
| `/forgot-password` | Request a password reset email |
| `/reset-password?uid=…&token=…` | Set a new password from the email link |
| `/verify-email?key=…` | Confirm an account email from the verification email |
| `*` | Not-found page |

The frontend's deep links must be served by the SPA fallback (serve `index.html` for unknown frontend paths). Backend API and media paths must be routed to Django, not the SPA.

## Local development

Requirements: Python 3.10+ (use the version supported by the deployment target), Node.js 20.19+ or 22.13+, and npm.

```bash
# Backend
cd backend
python -m venv .venv
# Windows: .venv\\Scripts\\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 127.0.0.1:8000

# In another terminal, frontend
cd frontend
npm ci
npm run dev -- --host 127.0.0.1
```

Vite serves on port 8080 and proxies same-origin `/api` and `/media` requests to the Django dev server on `http://127.0.0.1:8000` (see `frontend/vite.config.ts`; change that target if your API runs elsewhere). The frontend API base is same-origin `/api`; when the frontend and API are separate origins, set `VITE_API_URL` to the backend API root (for example `https://api.example.test/api`) and configure exact CORS/CSRF origins. Never place SMTP, database, Django, or signing secrets in a `VITE_*` variable; frontend variables are public in the built bundle.

### Local email

For development, Django uses `console.EmailBackend` by default. Registration, password reset, and the contact form require a configured email backend to deliver messages. To exercise real SMTP locally, put these values in an ignored environment file or export them in the backend process environment. Do not commit the file or put secret values in this README.

## Configuration reference

| Variable | Required in production | Purpose |
| --- | --- | --- |
| `DJANGO_SECRET_KEY` | Yes | High-entropy Django signing key; keep in a secrets manager |
| `DJANGO_DEBUG` | Yes (`false`) | Enables/disables debug behavior |
| `DJANGO_ALLOWED_HOSTS` | Yes | Comma-separated exact backend hostnames |
| `FRONTEND_URL` | Yes | Canonical HTTPS frontend base; email link origin |
| `CORS_ALLOWED_ORIGINS` | Yes | Comma-separated exact HTTPS frontend origins; also used as trusted CSRF origins |
| `DATABASE_URL` | Yes | PostgreSQL URL; TLS is required by default |
| `DB_SSLMODE` | Usually | PostgreSQL SSL mode, default `require` |
| `EMAIL_BACKEND` | Yes | Use Django's SMTP backend in production |
| `EMAIL_HOST` | Yes | SMTP server host |
| `EMAIL_PORT` | Yes | SMTP submission port, usually 587 with STARTTLS or 465 with SSL |
| `EMAIL_USE_TLS` | Yes | STARTTLS switch; do not combine with SSL |
| `EMAIL_USE_SSL` | Yes | Implicit TLS switch; do not combine with STARTTLS |
| `EMAIL_HOST_USER` | Yes | SMTP account username |
| `EMAIL_HOST_PASSWORD` | Yes | SMTP secret/app password; secrets manager only |
| `DEFAULT_FROM_EMAIL` | Yes | Verified sender address on the configured domain |
| `CONTACT_RECIPIENT_EMAIL` | Yes | Owner mailbox receiving contact messages |
| `SECURE_HSTS_SECONDS` | Optional | HSTS duration; default 31536000 seconds in production |
| `VITE_API_URL` | Only for split-origin hosting | Public API root; default same-origin `/api` |

SMTP is intentionally configured through environment variables, and no SMTP credentials are included in the repository. This workspace contains no project-local `.env` file. Set production secrets via the selected host's secret-management facility. For Gmail, use an app password with 2-Step Verification; do not use an account's normal password. Confirm the sender domain's SPF, DKIM, and DMARC before enabling production mail. Set `EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend` in production.

## Authentication, email, and privacy behavior

- Registration is handled by `/api/auth/registration/` and the custom secure serializer; account email verification is mandatory. Login is `/api/auth/login/`; the `/api/auth/user/` endpoint supplies the identity used by the frontend.
- Reset requests use `/api/auth/forgot-password/` and give a generic response whether or not an account exists. Reset emails link to `/reset-password`; submitted tokens are checked by Django, new passwords pass configured Django validators, and outstanding refresh tokens are revoked.
- JWTs are returned only in `HttpOnly`, `SameSite=Lax` cookies (`Secure` under production HTTPS). CSRF tokens are fetched at `/api/csrf/` and sent in `X-CSRFToken` for unsafe requests. Do not switch to browser storage for JWTs.
- Public poem/gallery reads are allowed; poem create/update/delete and like/comment creation require authentication. The server sets poem authors/commenters/likers from the signed-in account. Authors can only edit/delete their own poems. A member's profile is scoped to the current authenticated user.
- Contact submissions are validated, saved, and sent to `CONTACT_RECIPIENT_EMAIL`; the visitor's email is a reply-to address. A mail transport failure returns an error rather than claiming delivery.
- WhatsApp links use `https://wa.me/263715503026`, the international form of `0715503026`.

## API overview

| Endpoint | Methods | Access/behavior |
| --- | --- | --- |
| `/api/auth/registration/` | POST | Public; creates an unverified account and sends verification email |
| `/api/auth/registration/verify-email/` | POST | Public; confirms Allauth verification key |
| `/api/auth/login/` | POST | Public; sets HttpOnly auth cookies |
| `/api/auth/user/` | GET | Authenticated account identity |
| `/api/auth/logout/` | POST | Revokes/clears auth cookies |
| `/api/auth/forgot-password/` | POST | Public; generic response, sends recovery email when eligible |
| `/api/auth/reset-password/` | POST | Public; validates uid/token and revokes outstanding refresh tokens |
| `/api/csrf/` | GET | Returns CSRF token and cookie |
| `/api/poems/` | GET/POST | Public read, authenticated create |
| `/api/poems/{id}/` | GET/PATCH/PUT/DELETE | Public read; authenticated author/staff writes |
| `/api/likes/` | GET/POST | Public read, authenticated create; duplicate likes rejected |
| `/api/comments/` | GET/POST | Public read, authenticated create |
| `/api/gallery/` | GET | Public gallery reads; write operations are admin-only |
| `/api/profiles/` | GET | Current user's profile only |
| `/api/profiles/{id}/` | GET/PATCH/PUT | Authenticated and queryset-scoped to current user |
| `/api/messages/` | POST | Public contact form; emails the configured recipient |
| `/api/messages/` | GET | Admin only |
| `/api/highlights/` | GET | Public community highlights |

## SDLC and DevOps workflow

### 1. Requirements and planning

- Capture expected routes, roles, email flows, upload types/limits, and data-retention needs in an issue or change request.
- Keep user stories and acceptance criteria explicit: public read vs authenticated write, account-owner-only edits, emailed recovery, confirmation-required signup, visible WhatsApp contact.
- Flag unresolved production inputs before implementation: production origin, database, persistent media store, SMTP relay, sender DNS, deployment host, backup and restore policy.

### 2. Design and implementation

- UI/page code belongs under `frontend/src`; API, serializers, models, auth, and deployment configuration live under `backend`.
- Keep API roots environment configurable; use same-origin `/api` where possible.
- Keep secrets server-side and out of git, logs, frontend bundles, screenshots, and issue attachments.
- Create and commit Django migrations for model changes. Review each migration before applying it to a production database.

### 3. Verification and quality gates

Run before merging/releasing:

```bash
# backend
cd backend
python manage.py check
python manage.py makemigrations --check --dry-run
python manage.py test
python manage.py check --deploy  # production environment/configuration only

# frontend
cd frontend
npm ci
npm run build
npm run lint
```

For auth-sensitive releases, explicitly verify email verification, login/session restore/logout, generic forgot-password response, a valid and invalid reset link, password validation, token invalidation, CSRF rejection, anonymous write rejection, owner-vs-foreign poem edits, gallery visibility, upload/media URLs, and contact SMTP success/failure. Run integration checks against a disposable test database and a test SMTP inbox; do not send test mail to real users.

### 4. Release/deploy

1. Build the frontend with `npm run build`; the static artifact is `frontend/dist/`.
2. Deploy the Django API as a supported Python web service (for example Gunicorn behind an HTTPS reverse proxy); serve `frontend/dist/` with SPA fallback. This project is a React/Vite + Django application, not a static-only backend deployment.
3. Configure production environment variables/secrets from the table above; set `DJANGO_DEBUG=false`, exact `DJANGO_ALLOWED_HOSTS`, HTTPS origins, production PostgreSQL, a persistent media store, and SMTP values.
4. Apply migrations as a controlled pre-release step: `python manage.py migrate`.
5. Use a staged/canary rollout where the chosen host supports it. Confirm health checks, static asset MIME types, API routing, uploaded media, auth cookies, CSRF, and email delivery before announcing release.
6. Record deployed commit, build identifier, migration version, approver, and verification results in the release record.

### 5. Operations, monitoring, and rollback

- Monitor 5xx rates, application worker health, email transport failures, database connectivity/space, upload storage, and abnormal auth traffic. Redact passwords, tokens, reset links, cookie headers, and SMTP secrets from all logs.
- Schedule encrypted PostgreSQL backups and media-object backups; test restores on a recurring schedule. Database backups alone do not include uploaded files.
- If a release fails, stop further rollout, restore the previous frontend artifact and application image, and assess whether the migration is backward compatible before rolling back code. Prefer forward migrations; never drop data as an automatic rollback.
- Rotate Django/SMTP/database secrets after exposure and invalidate affected sessions/tokens. Keep incident timeline and postmortem/action items.
- Keep security patches for Python, Django, frontend dependencies, and the host current; review dependency audit output and lockfile changes.

### 6. Definition of done

- Acceptance criteria pass; backend tests and system checks pass; frontend production build passes; migration review is complete.
- No secrets, source maps, local databases, virtualenvs, or development media are in the release artifact.
- Production host, storage, TLS, CORS/CSRF, backups, email, monitoring, and recovery owner are configured and exercised.
- Relevant docs and release notes are updated.

## Production readiness blockers / handoff

This code change cannot itself create production accounts or deploy. Before public launch, the owner/operator must provide/configure a real Django secret, PostgreSQL URL, production frontend/API domains and allowed origins, persistent media storage, SMTP credentials and a verified sender, DNS mail authentication, and the production hosting/monitoring/backup plan. None of these credentials were present in the project. Credentials from sibling projects or machine-wide files were not searched or copied.

The checked-in requirements list currently uses unpinned package names. For reproducible production builds, pin and review supported package versions in a separate dependency-management change. The current frontend build warns about CSS `@import` ordering, Vite plugin/esbuild deprecation, stale Browserslist data, and ineffective dynamic imports; these are warnings, not build failures. The existing codebase has no load/penetration test plan or production deployment manifest, so operational infrastructure must be selected and tested before the service can be called production-ready.

## Removing builder branding and building `dist`

Builder-generated scripts, tags, and asset paths were removed from the frontend, and the legacy generated-upload directory was deleted. Before every release, run a case-insensitive search of the source tree and the built `dist/` for the old builder name and inspect the bundle. The generated build output is ignored by git and is recreated only by `npm run build`; do not commit or deploy stale `dist/` contents. The original images were kept under `frontend/public/uploads/` so pages retain their visuals.
