# Admin Dashboard

This is the admin dashboard implementation converted from HTML/CSS to React with shadcn/ui components.

## Structure

### Pages (app/admin/)
- `/admin` - Main doctors list page
- `/admin/pending-verification` - Pending verification requests (placeholder)
- `/admin/configuration` - Configuration settings (placeholder)

### Components (components/admin/)
- **AdminHeader** - Header with back button, title, and theme switcher
- **AdminSidebar** - Navigation sidebar with active state highlighting
- **DoctorsList** - Main content area with search and doctor listings
- **EmptyState** - Reusable empty state component

## Features Implemented

✅ Responsive layout (mobile to desktop)
✅ Dark mode support via next-themes
✅ Active navigation highlighting
✅ Search functionality (UI only)
✅ Empty state for no doctors
✅ Pagination controls (disabled when no data)
✅ Badge notification on "Vérification en attente"

## Components Used

- shadcn/ui: Button, Input, Badge, Card
- lucide-react: Icons (ArrowLeft, Search)
- Custom SVG icons: For admin panel icon and navigation items
- Existing ThemeSwitcher component

## Next Steps

The following features need to be implemented:

1. **Pending Verification Page**
   - List doctors awaiting verification
   - Approve/reject actions
   - Document upload viewing

2. **Doctors List Functionality**
   - Fetch doctors from database
   - Search implementation
   - Pagination logic
   - Doctor details/actions

3. **Configuration Page**
   - System settings
   - Admin user management
   - Other configuration options

4. **Authentication & Authorization**
   - Admin role verification
   - Protected routes
   - Session management

## Development

To view the admin dashboard:
```bash
npm run dev
```

Navigate to: `http://localhost:3000/admin`
