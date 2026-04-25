# Admin PG Management - Edit PG + Virtual Tour Implementation Plan

## Information Gathered
- Admin PG Management page exists at `PgManagement.tsx` with table listing, verify/feature/delete actions.
- `usePgManagement` hook already has `updatePG` mutation via `updatePG` in `adminApi.ts`.
- Backend `PUT /api/pg/:id` route is `protect + ownerOrAdmin` middleware — admin can update any PG.
- PG model already has `videoUrl` and `virtualTour` fields with basic URL validators.
- Frontend `PGListing` type already includes `videoUrl` and `virtualTour`.

## Plan

### Backend Changes
1. **Tighten `virtualTour` validator** in `PGListing.js` to accept only YouTube URLs.
2. **Add YouTube URL validation** in `pgController.js` `updatePGListing` for `videoUrl` / `virtualTour`.
3. **Allow `virtualTour` field** in `updatePGListing` controller alongside existing fields.

### Frontend Changes
4. **Create `EditPGModal.tsx`** (`easy-to-rent-startup-main/src/admin/components/modals/EditPGModal.tsx`)
   - Full form with: name, description, price, city, locality, address, type (select), amenities (multi-select chips), images (textarea URLs), videoUrl (YouTube), virtualTour (YouTube)
   - YouTube URL inline validation
   - Live iframe preview for virtualTour
   - Cancel/Save with loading state
   - Consistent with shadcn/tailwind dark mode

5. **Update `PgManagement.tsx`**
   - Import and integrate `EditPGModal`.
   - Add `Edit` button in table actions (between View and Verify).
   - Pre-fill modal with selected PG data.

6. **Update `PGCard.tsx`**
   - Add "Watch Virtual Tour" badge/button when `virtualTour` exists.
   - Click opens modal or new tab with embedded video.
   - Hide gracefully when no link.

7. **Update `adminApi.ts`** (if needed — already supports generic `updatePG`).

## Dependent Files to Edit
- `pg-finder-backend/src/models/PGListing.js`
- `pg-finder-backend/src/controllers/pgController.js`
- `easy-to-rent-startup-main/src/admin/components/modals/EditPGModal.tsx` (new)
- `easy-to-rent-startup-main/src/admin/pages/PgManagement.tsx`
- `easy-to-rent-startup-main/src/components/pg/PGCard.tsx`

## Follow-up Steps
- Restart backend to register model change.
- Test edit flow, verify YouTube validation, confirm badge shows/hides correctly.

