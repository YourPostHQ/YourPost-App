# YourPost Infrastructure Deployment Plan

## Domain Structure

- **yourpost.io** - Open source code and documentation
  - GitHub Organization: https://github.com/YourPostHQ
  - Documentation: https://yourpost.io/docs
  
- **yourpost.app** - Production deployment instance
  - Mail server backend (Zig)
  - API services (port 9000)
  - Web app frontend (this repo)
  - Admin dashboard

## Deployment Order

### Phase 1: Backend Services (First)

1. **YourPost Mail Server** (`yourpost/`)
   - Deploy to VPS/cloud server
   - Configure environment variables:
     ```bash
     YP_API_PORT=9000
     YP_SERVICE_PORT=9001
     YP_JWT_SECRET=<secure-secret>
     YP_DATA_DIR=/var/lib/yourpost/data
     YP_SMTP_PORT=25
     YP_SUBMISSION_PORT=587
     YP_IMAP_PORT=143
     YP_POP3_PORT=110
     # SMTP Relay (optional)
     YP_SMTP_RELAY_HOST=smtp.sendgrid.net
     YP_SMTP_RELAY_PORT=587
     YP_SMTP_RELAY_USER=<api-key>
     YP_SMTP_RELAY_PASSWORD=<password>
     ```
   - Set up TLS certificates (Let's Encrypt)
   - Configure firewall (ports 25, 587, 143, 110, 9000, 9001)
   - Start service: `./zig-out/bin/yourpost`

2. **Verify Backend is Running**
   ```bash
   curl https://yourpost.app/api/health
   # Response: {"status":"ok","service":"yourpost"}
   ```

### Phase 2: Frontend Web App (Second)

1. **YourPost App** (`yourpost-app/`)
   - Deploy to Cloudflare Pages
   - Connect to GitHub repo: `YourPostHQ/YourPost-App`
   - **Critical Settings:**
     - Framework preset: **"None"** (NOT Next.js!)
     - Build command: `npm run build`
     - Output directory: `out`
   - Environment variables:
     ```
     NEXT_PUBLIC_API_URL=https://yourpost.app
     ```
   - Deploy!

2. **Verify Frontend is Connected**
   - Visit https://yourpost.app
   - Should load login page
   - API calls go to `https://yourpost.app/api/*`

### Phase 3: Cloudflare Email Worker (Optional)

- Forward emails from Cloudflare to YourPost backend
- Configure in Cloudflare Dashboard → Email Routing
- Worker sends emails to: `https://yourpost.app/api/service/incoming`

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    yourpost.app                          │
│                      │
│  ┌──────────────┐      ┌──────────────┐      │
│  │  YourPost    │      │  YourPost    │      │
│  │  Backend     │◄────►│  Web App    │      │
│  │  (Zig)      │      │  (Next.js)   │      │
│  │  Port 9000   │      │  Port 443    │      │
│  └──────┬───────┘      └──────────────┘      │
│         │                      ▲                  │
│         │                      │                  │
│         ▼                      │                  │
│  ┌──────────────┐           │                  │
│  │  SQLite DB   │           │                  │
│  │  /var/lib/  │           │                  │
│  └──────────────┘           │                  │
│                               │                  │
└───────────────────────────────┴──────────────────┘
```

## API Endpoints (yourpost.app)

- **Health Check**: `GET https://yourpost.app/health`
- **API Base**: `https://yourpost.app/api/v1/*`
- **Auth**: `POST /api/v1/auth/login`
- **Mailboxes**: `GET /api/v1/mailboxes/{email}/messages`
- **Send Email**: `POST /api/v1/mailboxes/{email}/send`
- **Service API**: `POST https://yourpost.app:9001/api/service/incoming`

## Frontend Configuration

Update `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // ... other config
}

module.exports = nextConfig
```

Environment variable for production:
```bash
NEXT_PUBLIC_API_URL=https://yourpost.app
```

## Testing the Full Stack

1. **Backend Health**: `curl https://yourpost.app/health`
2. **Create Admin User**:
   ```bash
   curl -X POST https://yourpost.app/api/v1/users \
     -H "Content-Type: application/json" \
     -d '{"email": "admin@yourpost.app", "password": "secure123", "role": "admin"}'
   ```
3. **Login via Web App**: Visit https://yourpost.app
4. **Send Test Email**: Use the web interface

## Next Steps After Deployment

1. Set up DNS records for `yourpost.app`
2. Configure MX record to point to mail server
3. Set up SPF/DKIM/DMARC for email authentication
4. Monitor logs: `journalctl -u yourpost -f`
5. Set up Tauri desktop app build pipeline

## Security Checklist

- ✅ Change `YP_JWT_SECRET` from default
- ✅ Set up firewall rules
- ✅ Enable TLS/SSL certificates
- ✅ Configure rate limiting
- ✅ Set up fail2ban for brute-force protection
- ✅ Regular security updates

---

**Deployment Priority**: Backend first → Frontend second → Test full stack
