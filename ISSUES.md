# YourPost Webmail Issues

This file tracks known issues and bugs in the YourPost Webmail frontend.

## Authentication & Authorization

### 1. Missing Registration Endpoint
- **Status**: Open
- **Location**: `src/lib/api.ts`
- **Description**: The webmail calls `POST /api/v1/register` but the YourPost API uses `POST /api/v1/users` for user creation.
- **Note**: Registration should be for domain owners (admin privilege) to create new email users, not public signup.
- **Fix Needed**: 
  - Option A: Update webmail to use `POST /api/v1/users` with admin token
  - Option B: Add `POST /api/v1/auth/register` endpoint to YourPost API

### 2. Token Validation Not Implemented
- **Status**: Open
- **Location**: `src/components/WebmailApp.tsx`
- **Description**: The webmail reads tokens from cookies but YourPost API doesn't validate tokens yet.
- **Impact**: Any valid token (even expired) is accepted.
- **Fix Needed**: Implement JWT or session-based authentication in YourPost API.

## UI/UX Issues

### 3. Theme Toggle Not Working in Header
- **Status**: Fixed
- **Description**: Header now uses SVG strings with theme-based switching (light=outlined, dark=filled).

### 4. Public Homepage Needs Branding
- **Status**: Completed
- **Location**: `src/app/(public)/page.tsx`
- **Description**: Added public branding page at `/` with:
  - YourPost hero SVG
  - "Open Source" and "SaaS Available" badges
  - Links to GitHub, Sign In, Sign Up
  - Theme toggle

### 5. Layout Separation Needed
- **Status**: Completed
- **Description**: Separated root layout (public) from app layout (authenticated):
  - `/` - Public branding page
  - `/login` - Login page
  - `/register` - Registration page
  - `/inbox` - Mailbox (after login, like Gmail)

## API Compatibility

### 6. API Endpoints Needed
- **Status**: In Progress
- **Description**: The webmail expects these endpoints:
  - `GET /api/v1/mailboxes/{user}/folders` ✅
  - `GET /api/v1/mailboxes/{user}/messages?folder_id={id}` ✅
  - `GET /api/v1/mailboxes/{user}/messages/{id}` ✅
  - `POST /api/v1/mailboxes/{user}/send` ✅
  - `DELETE /api/v1/mailboxes/{user}/messages/{id}` ✅
  - `POST /api/v1/auth` ✅ (login)
  - `POST /api/v1/users` ✅ (create user - admin only)
  - `POST /api/v1/auth/register` ❌ (missing - needed for public registration)

## RBAC (Role-Based Access Control)

### 7. Role Support Needed
- **Status**: In Progress
- **Location**: YourPost API (`src/db/global.zig`)
- **Description**: Added `role` field to users table but need to:
  - Validate roles in API endpoints
  - Show/hide admin features in webmail based on user role
  - Add admin panel for user management

## Admin UI/UX (Webmail)

### 8. Admin Panel Needed
- **Status**: Not Started
- **Location**: `yourpost-webmail/src/app/(app)/admin/`
- **Description**: Need admin interface for:
  - List all users (with roles, quota, status)
  - Create new users (with role assignment)
  - Edit user quota and status (active/inactive)
  - Delete/deactivate users
- **API Endpoints Needed**:
  - `GET /api/v1/users` - List all users (admin only)
  - `POST /api/v1/users` - Create user with role (admin only)
  - `PUT /api/v1/users/{email}` - Update user (admin only)
  - `DELETE /api/v1/users/{email}` - Deactivate user (admin only)

### 9. Role-Based UI Rendering
- **Status**: Not Started
- **Description**: Webmail should:
  - Hide admin features from regular users
  - Show "Admin" link in header for admin users
  - Redirect non-admin users from admin pages
- **Implementation**: Check user role from token claims

---

**Last Updated**: 2026-05-04
