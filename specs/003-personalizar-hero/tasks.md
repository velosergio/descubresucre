# Tasks: Personalizar banner del hero

**Input**: `specs/003-personalizar-hero/`  
**Prerequisites**: plan.md, spec.md, data-model.md

## Phase 1: Foundational

- [x] T001 Add Prisma enums + `HeroAppearanceSettings` model and migration (`prisma/schema.prisma`)
- [x] T002 Implement `src/lib/hero-appearance.ts` (types, `getResolvedHeroConfig`, validation helpers)
- [x] T003 Implement `src/lib/actions/hero-appearance.ts` (`uploadHeroAssetAction`, `saveHeroAppearanceAction`) with `assertAdminAction`

## Phase 2: User Story 1 – Visitante ve el banner (P1)

- [x] T004 [US1] Update `src/app/page.tsx` to load hero settings and pass props to `HomePage`
- [x] T005 [US1] Update `src/components/HomePage.tsx` and `src/components/HeroSection.tsx` for all modes + fallback
- [x] T006 [US1] Add unit tests `src/lib/hero-appearance.test.ts`

## Phase 3: User Story 2 – Administrador configura (P2)

- [x] T007 [US2] Add `src/app/admin/personalizar/layout.tsx` with `requireAdminSession`
- [x] T008 [US2] Add hub `src/app/admin/personalizar/page.tsx` and `src/app/admin/personalizar/banner/page.tsx`
- [x] T009 [US2] Add `src/components/admin/hero-banner-settings-form.tsx`
- [x] T010 [US2] Extend `src/components/admin/admin-shell.tsx` nav (Personalizar group)

## Phase 4: User Story 3 – Subidas seguras (P3)

- [x] T011 [US3] Enforce MIME/size in upload action; HTTPS validation for external video URL
- [x] T012 [US3] Add `public/uploads/` to `.gitignore` with `.gitkeep` placeholders

## Dependencies

- T001 → T002 → T003 → T004–T005 → T007–T010 (admin can follow parallel after T003)
