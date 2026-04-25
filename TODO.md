# User Login Activity Fix — TODO

## Backend
- [x] 1. Add `loginActivity` array field to User model (`pg-finder-backend/src/models/User.js`)
- [x] 2. Record login activity on successful login in `authController.js` (`verifyLoginOtp` + `googleTokenLogin`)
- [x] 3. Rewrite `getUserActivity` in `adminController.js` to return `user.loginActivity` safely
- [x] 4. Add `GET /api/admin/users/:id/activity` route in `adminRoutes.js`

## Frontend
- [x] 5. Update `fetchUserActivity` endpoint in `adminApi.ts` to `/api/admin/users/${userId}/activity`
- [x] 6. Add defensive checks in `UserDetailDrawer.tsx` to prevent undefined errors

