# Admin Dashboard Upgrade — Implementation Plan

## Phase 1: Foundation (Layout + Theme)
- [ ] Create `AdminTopbar` component with notifications bell, global search, theme toggle
- [ ] Update `AdminLayout` with modern sidebar + topbar architecture
- [ ] Create `ThemeProvider` for system-wide dark/light mode toggle
- [ ] Add Framer Motion animations to sidebar (collapse/expand, hover)
- [ ] Enhance sidebar active route highlighting with glow effect

## Phase 2: Dashboard Home
- [ ] Upgrade `KpiCard` with glassmorphism + soft shadows + hover animations
- [ ] Add `DashboardCharts` section with Recharts (line, bar, pie)
- [ ] Enhance `LiveActivity` widget with auto-refresh, better icons/colors
- [ ] Add `QuickActions` floating button bar
- [ ] Create `GlobalSearch` component

## Phase 3: Tables Upgrade
- [ ] Create reusable `DataTable` component with search, filters, pagination, sorting
- [ ] Upgrade `UserManagement` table
- [ ] Upgrade `PgManagement` table
- [ ] Upgrade `BookingManagement` table

## Phase 4: Modals & Drawers
- [ ] Upgrade `UserDetailDrawer` with modern slide animation
- [ ] Create `PGDetailDrawer`
- [ ] Add smooth Framer Motion transitions to all modals

## Phase 5: Polish
- [ ] Skeleton loaders for all loading states
- [ ] Toast notifications integration
- [ ] Empty states with illustrations
- [ ] Mobile responsive fixes
- [ ] Debounced search inputs

