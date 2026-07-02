# ADR-002: Introduce Role-Based Access Control (RBAC)

## Status
Accepted

## Context
The system currently relies solely on authentication (isLoggedIn) to protect administrative routes. As the system grows, we need scalable authorization to differentiate between different types of users (e.g., Superuser vs. Admin) to restrict access to sensitive routes like User Management and System Settings.

## Decision
1. **Role Propagation:** The user's role will be propagated from the database (or environment variables for master admin) into the JWT token and subsequently into the NextAuth Session object via callbacks.
2. **Permission Matrix:** Instead of hardcoding route paths with roles, we introduce a Permission Matrix (`src/lib/rbac.ts`) that maps roles to specific permissions, and routes to required permissions. This decouples routing logic from role definitions.
3. **Defense in Depth (Multi-Layer Authorization):** Authorization will be enforced across multiple layers:
   - **UI Layer:** Menu items will be conditionally hidden (Note: This is UX Enhancement only, not a security boundary).
   - **Middleware:** Broad route protection based on the Permission Matrix.
   - **Server Components & Server Actions:** Explicit checks of `session.user.role` before rendering sensitive data or performing mutations.
   - **API Routes:** Explicit checks of `session.user.role` before processing direct HTTP requests.

## Consequences
- Future roles (e.g., Editor, Marketing, Viewer) can be added easily by updating the Permission Matrix without modifying the core logic.
- Adds slight overhead to API routes and Server Components as explicit session checks are now mandated.
- Types (`next-auth.d.ts`) must be strictly maintained to ensure TypeScript correctly infers the `role` property across the application.
