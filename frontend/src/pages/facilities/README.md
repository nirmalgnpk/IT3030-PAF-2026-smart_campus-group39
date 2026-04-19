# Smart Campus Resources & Facilities Components

Complete documentation for the Campus Facilities Management system. This module handles browsing, filtering, creating, updating, and deleting campus resources with a modern, responsive UI.

## 📋 Table of Contents

- [Overview](#overview)
- [Component Architecture](#component-architecture)
- [Components](#components)
- [Service Layer](#service-layer)
- [Features](#features)
- [Resource Types & Status](#resource-types--status)
- [Filter System](#filter-system)
- [Usage Examples](#usage-examples)
- [API Integration](#api-integration)
- [Styling & Theme](#styling--theme)
- [Error Handling](#error-handling)
- [File Structure](#file-structure)

---

## Overview

The Facilities module provides a comprehensive system for managing campus resources. It includes:

- **Resource Browsing**: View all campus facilities with detailed information
- **Advanced Filtering**: Filter by type, status, location, and capacity
- **CRUD Operations**: Create, read, update, and delete resources (admin only)
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Real-time Updates**: Immediate UI updates after operations
- **Admin Controls**: Specialized interface for administrators

### Key Features

✅ Modern card-based UI with rich information display
✅ Weekly availability scheduling system
✅ Real-time search and filtering
✅ Batch operations support
✅ Color-coded resource types
✅ Loading and error states
✅ Modal-based forms
✅ Responsive grid layout

---

## Component Architecture

```
FacilitiesPage (Page Wrapper)
├── ResourceList (Main Container)
│   ├── Toolbar (Search & Actions)
│   ├── ResourceFilter (Sidebar)
│   └── ResourceCard[] (Grid Items)
│       └── ResourceForm (Modal on Edit)
├── ResourceDetail (Detail View)
│   └── ResourceForm (Edit Modal)
└── Services (API Layer)
    └── resourceService.js
```

---

## Components

### 1. **FacilitiesPage**

Main page component that displays the campus facilities interface.

**File**: `FacilitiesPage.jsx`

**Props**:
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isAdmin` | `boolean` | `false` | Show admin features (edit, delete) |

**Features**:
- Hero header with statistics
- Dynamic stats display (Total Rooms, Available)
- Admin mode indicator
- Background image with overlay
- Responsive layout

**Usage**:
```jsx
import FacilitiesPage from './pages/facilities/FacilitiesPage';

// Regular user
<FacilitiesPage isAdmin={false} />

// Admin user
<FacilitiesPage isAdmin={true} />
```

**Component Structure**:
```
┌─ Hero Section
│  ├─ Background image with overlay
│  ├─ Title & subtitle
│  ├─ Statistics cards
│  └─ Admin mode badge
└─ Content Section
   └─ ResourceList component
```

---

### 2. **ResourceList**

Main container component that manages resources, filtering, and CRUD operations.

**File**: `ResourceList.jsx`

**Props**:
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isAdmin` | `boolean` | `true` | Enable admin features |

**State Management**:
```javascript
{
  resources: [],              // All resources
  loading: boolean,           // Loading state
  error: string | null,       // Error message
  showForm: boolean,          // Show create/edit modal
  selectedResource: object | null,  // Resource being edited
  filters: {                  // Applied filters
    type: '',
    status: '',
    location: '',
    capacityMin: ''
  },
  deleteLoading: boolean      // Delete operation state
}
```

**Key Methods**:
- `fetchResources()` - Fetch all resources from API
- `filteredResources` - Computed filtered list
- `handleDelete(resourceId)` - Delete a resource
- `handleFilterChange(newFilters)` - Update filters
- `handleEdit(resource)` - Open edit modal

**Features**:
- Toolbar with breadcrumb and "Add Resource" button
- Advanced filter panel
- Resource grid with responsive columns
- Loading spinner animation
- Empty state message
- Error alerts
- Delete confirmation modal
- Create/Edit form modal

**Usage**:
```jsx
import ResourceList from './ResourceList';

<ResourceList isAdmin={true} />
```

---

### 3. **ResourceCard**

Card component displaying individual resource information.

**File**: `ResourceCard.jsx`

**Props**:
| Prop | Type | Description |
|------|------|-------------|
| `resource` | `object` | Resource data object |
| `onViewDetails` | `function` | Callback for view details |
| `onEdit` | `function` | Callback for edit action |
| `onDelete` | `function` | Callback for delete action |
| `isAdmin` | `boolean` | Show admin controls |

**Resource Object Structure**:
```javascript
{
  id: string,
  name: string,
  type: 'LECTURE_HALL' | 'LAB' | 'MEETING_ROOM' | 'EQUIPMENT',
  location: string,
  capacity: number,
  status: 'ACTIVE' | 'OUT_OF_SERVICE',
  description: string,
  availabilityWindows: string // "Monday 09:00-17:00, Tuesday 09:00-17:00, ..."
}
```

**Card Layout**:
```
┌───────────────────────────────────┐
│ ▁▁▁ Type Badge  Status Badge ▁▁▁  │ (Accent bar at top)
├───────────────────────────────────┤
│ Room Name                         │
├───────────────────────────────────┤
│ 📍 Location | 👥 Capacity        │
│ 🕐 Time | Status                 │
├───────────────────────────────────┤
│ Description preview...            │
├───────────────────────────────────┤
│ [View Details] [Edit] [Delete]   │ (Admin only for edit/delete)
└───────────────────────────────────┘
```

**Features**:
- Color-coded type badges
- Status indicators (Active/Out of Service)
- Capacity and location information
- Availability time display
- Hover effects
- Admin action buttons
- Animated delete button

**Type Color Scheme**:
| Type | Gradient | Badge Color |
|------|----------|-------------|
| LECTURE_HALL | Blue (#1A3F8F → #5882E0) | #E8F0FD |
| LAB | Green (#0F6E56 → #1D9E75) | #E6F7F0 |
| MEETING_ROOM | Gold (#854F0B → #C8963E) | #FDF5E6 |
| EQUIPMENT | Purple (#534AB7 → #8F7FE8) | #F0EBF8 |

---

### 4. **ResourceForm**

Modal form for creating and editing resources.

**File**: `ResourceForm.jsx`

**Props**:
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialData` | `object | null` | `null` | Pre-filled data for edit mode |
| `onSubmit` | `function` | - | Callback after successful submit |
| `onCancel` | `function` | - | Callback when cancel is clicked |

**Features**:
- **Two Modes**: Create new or edit existing resource
- **Form Sections**:
  - Basic Information (name, type, status, location)
  - Capacity & Availability (capacity, weekly schedule picker)
  - Details (description)
- **Real-time Validation**: Instant field feedback
- **Field Validation**:
  - Name: 2-100 characters
  - Location: 3-100 characters
  - Capacity: 1-10,000 people
  - Description: 0-1000 characters
- **Weekly Availability Picker**:
  - Select days/times per day
  - Toggle days on/off
  - Validate start < end time
  - Reset to defaults
- **Success/Error Messages**: Clear user feedback
- **Loading State**: Disabled inputs during submission
- **Backdrop Click**: Close on outside click

**Form Fields**:
```
┌─ BASIC INFORMATION
│  ├─ Resource Name (text, required, 2-100 chars)
│  ├─ Type (select: LECTURE_HALL, LAB, MEETING_ROOM, EQUIPMENT)
│  ├─ Status (select: ACTIVE, OUT_OF_SERVICE)
│  └─ Location (text, required, 3-100 chars)
├─ CAPACITY & AVAILABILITY
│  ├─ Capacity (number, required, 1-10,000)
│  └─ Weekly Availability (modal picker, optional)
├─ DETAILS
│  └─ Description (textarea, optional, 0-1000 chars)
└─ ACTIONS
   ├─ [Create/Update Resource] (primary)
   └─ [Cancel] (secondary)
```

**Weekly Availability Picker Features**:
- 7 days of the week
- Time range selection per day
- Toggle enabled/disabled per day
- Apply and Reset buttons
- Dropdown interface

**Usage**:
```jsx
import ResourceForm from './ResourceForm';

// Create new resource
<ResourceForm 
  onSubmit={(data) => console.log('Created:', data)}
  onCancel={() => setShowForm(false)}
/>

// Edit existing resource
<ResourceForm 
  initialData={selectedResource}
  onSubmit={(data) => console.log('Updated:', data)}
  onCancel={() => setShowForm(false)}
/>
```

**Validation Rules**:
```javascript
{
  name: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  location: {
    required: true,
    minLength: 3,
    maxLength: 100
  },
  capacity: {
    required: true,
    type: 'number',
    min: 1,
    max: 10000
  },
  availabilityWindows: {
    atLeastOneDay: true,
    startTime < endTime: true
  },
  description: {
    maxLength: 1000
  }
}
```

---

### 5. **ResourceFilter**

Sidebar filter panel for advanced resource filtering.

**File**: `ResourceFilter.jsx`

**Props**:
| Prop | Type | Description |
|------|------|-------------|
| `filters` | `object` | Current filter values |
| `onFiltersChange` | `function` | Callback when filters change |

**Filter Fields**:
- **Type**: ALL_TYPES, LECTURE_HALL, LAB, MEETING_ROOM, EQUIPMENT
- **Status**: ALL_STATUS, ACTIVE, OUT_OF_SERVICE
- **Location**: Text search (partial match)
- **Capacity Min**: Numeric minimum capacity

**Usage**:
```jsx
import ResourceFilter from './ResourceFilter';

<ResourceFilter 
  filters={filters}
  onFiltersChange={(newFilters) => setFilters(newFilters)}
/>
```

**Filter Logic**:
```javascript
const filteredResources = resources.filter(resource => {
  if (filters.type && resource.type !== filters.type) return false;
  if (filters.status && resource.status !== filters.status) return false;
  if (filters.location && !resource.location.toLowerCase()
    .includes(filters.location.toLowerCase())) return false;
  if (filters.capacityMin && resource.capacity < filters.capacityMin) 
    return false;
  return true;
});
```

---

### 6. **ResourceDetail**

Detailed view component for a single resource with edit capability.

**File**: `ResourceDetail.jsx`

**Features**:
- Full resource information display
- Formatted availability table
- Edit button (admin only)
- Loading state
- Error handling
- Navigation back to list

**Component Sections**:
- Header with resource name and type badge
- Quick info (location, capacity, status)
- Description
- Availability table with day/time information
- Related resources (optional)
- Admin action buttons

---

## Service Layer

### resourceService.js

API service for all resource operations.

**File**: `../../services/resourceService.js`

**Base URL**: `http://localhost:8081/api/resources`

#### **Functions**

##### `getAllResources(filters = {})`
Fetch all resources with optional filtering.

```javascript
const resources = await getAllResources({
  type: 'LAB',
  location: 'Building A',
  minCapacity: 20
});
```

**Parameters**:
| Param | Type | Description |
|-------|------|-------------|
| `filters.type` | `string` | Resource type |
| `filters.location` | `string` | Location search |
| `filters.minCapacity` | `number` | Minimum capacity |

**Returns**: `Promise<Array>` - Array of resource objects

**Error**: Throws error with message from API

---

##### `getResourceById(id)`
Fetch a single resource by ID.

```javascript
const resource = await getResourceById('resource-123');
```

**Returns**: `Promise<Object>` - Resource object

---

##### `createResource(resourceData)`
Create a new resource.

```javascript
const newResource = await createResource({
  name: 'Room 101',
  type: 'LECTURE_HALL',
  location: 'Building A, 2nd Floor',
  capacity: 50,
  status: 'ACTIVE',
  availabilityWindows: 'Monday 09:00-17:00, Tuesday 09:00-17:00'
});
```

**Returns**: `Promise<Object>` - Created resource object

---

##### `updateResource(id, resourceData)`
Update an existing resource.

```javascript
const updated = await updateResource('resource-123', {
  name: 'Room 101 Updated',
  capacity: 60
});
```

**Returns**: `Promise<Object>` - Updated resource object

---

##### `deleteResource(id)`
Delete a resource.

```javascript
await deleteResource('resource-123');
```

**Returns**: `Promise<void>`

---

##### `buildQueryString(filters)`
Helper function to build query parameters.

```javascript
const query = buildQueryString({ type: 'LAB', location: 'Block A' });
// Returns: "?type=LAB&location=Block+A"
```

---

## Features

### 1. **Resource Management**
- ✅ Create new resources
- ✅ View resource details
- ✅ Update existing resources
- ✅ Delete resources (admin only)
- ✅ Bulk operations ready

### 2. **Filtering System**
- ✅ Filter by resource type
- ✅ Filter by status
- ✅ Search by location
- ✅ Filter by minimum capacity
- ✅ Apply and clear filters
- ✅ Real-time filter updates

### 3. **Availability Management**
- ✅ Weekly availability schedule
- ✅ Custom time ranges per day
- ✅ Toggle days on/off
- ✅ Pre-defined default times
- ✅ Reset to defaults
- ✅ Validation (start < end time)

### 4. **Form Validation**
- ✅ Real-time field validation
- ✅ Character count indicators
- ✅ Error messages
- ✅ Success notifications
- ✅ Touch state tracking
- ✅ Field status indicators (valid/error)

### 5. **User Experience**
- ✅ Loading spinners
- ✅ Error alerts
- ✅ Empty states
- ✅ Modal dialogs
- ✅ Hover effects
- ✅ Responsive grid
- ✅ Smooth animations

### 6. **Admin Features**
- ✅ Edit button on cards
- ✅ Delete button with confirmation
- ✅ Create new resources
- ✅ Bulk delete (ready)
- ✅ Export resources (ready)

---

## Resource Types & Status

### Resource Types

```javascript
{
  LECTURE_HALL: {
    label: 'Lecture Hall',
    color: '#1A3F8F',
    gradient: 'linear-gradient(to right, #1A3F8F, #5882E0)',
    badgeColor: '#E8F0FD'
  },
  LAB: {
    label: 'Laboratory',
    color: '#0F6E56',
    gradient: 'linear-gradient(to right, #0F6E56, #1D9E75)',
    badgeColor: '#E6F7F0'
  },
  MEETING_ROOM: {
    label: 'Meeting Room',
    color: '#854F0B',
    gradient: 'linear-gradient(to right, #854F0B, #C8963E)',
    badgeColor: '#FDF5E6'
  },
  EQUIPMENT: {
    label: 'Equipment',
    color: '#534AB7',
    gradient: 'linear-gradient(to right, #534AB7, #8F7FE8)',
    badgeColor: '#F0EBF8'
  }
}
```

### Status Values

```javascript
{
  ACTIVE: {
    label: 'Active',
    badgeColor: '#E6F7F0',
    textColor: '#0F6E56',
    dot: '#1D9E75'
  },
  OUT_OF_SERVICE: {
    label: 'Out of Service',
    badgeColor: '#FCEBEB',
    textColor: '#A32D2D',
    dot: '#E24B4A'
  }
}
```

---

## Filter System

### Filter Object Structure

```javascript
{
  type: 'LECTURE_HALL' | 'LAB' | 'MEETING_ROOM' | 'EQUIPMENT' | '',
  status: 'ACTIVE' | 'OUT_OF_SERVICE' | '',
  location: string, // Text search (partial match)
  capacityMin: number | '' // Minimum capacity
}
```

### Applying Filters

```javascript
// In ResourceList
const handleFilterChange = (newFilters) => {
  setFilters(newFilters);
  // Automatically re-filtered via: filteredResources
};

// Filter logic
const filteredResources = resources.filter(resource => {
  if (filters.type && resource.type !== filters.type) return false;
  if (filters.status && resource.status !== filters.status) return false;
  if (filters.location && 
      !resource.location.toLowerCase()
        .includes(filters.location.toLowerCase())) 
    return false;
  if (filters.capacityMin && resource.capacity < filters.capacityMin) 
    return false;
  return true;
});
```

### Clearing Filters

```javascript
const handleClearFilters = () => {
  setFilters({
    type: '',
    status: '',
    location: '',
    capacityMin: ''
  });
};
```

---

## Usage Examples

### Example 1: Display Facilities Page for Regular User

```jsx
import FacilitiesPage from './pages/facilities/FacilitiesPage';

export default function App() {
  return <FacilitiesPage isAdmin={false} />;
}
```

### Example 2: Admin Resource Management

```jsx
import FacilitiesPage from './pages/facilities/FacilitiesPage';

export default function AdminDashboard() {
  return <FacilitiesPage isAdmin={true} />;
}
```

### Example 3: Custom Resource List with Filters

```jsx
import { useState } from 'react';
import ResourceList from './pages/facilities/ResourceList';

export default function CustomResourceViewer() {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div>
      <button onClick={() => setIsAdmin(!isAdmin)}>
        Toggle Admin Mode
      </button>
      <ResourceList isAdmin={isAdmin} />
    </div>
  );
}
```

### Example 4: Programmatic Resource Creation

```jsx
import { createResource } from './services/resourceService';

async function addNewLab() {
  try {
    const newResource = await createResource({
      name: 'Computer Lab A',
      type: 'LAB',
      location: 'Building B, 3rd Floor',
      capacity: 30,
      status: 'ACTIVE',
      availabilityWindows: 'Monday 08:00-17:00, Tuesday 08:00-17:00, Wednesday 08:00-17:00, Thursday 08:00-17:00, Friday 08:00-17:00',
      description: 'Main computer lab with 30 workstations'
    });
    console.log('Created:', newResource);
  } catch (error) {
    console.error('Failed to create resource:', error.message);
  }
}
```

### Example 5: Filtered Resource Fetching

```jsx
import { getAllResources } from './services/resourceService';

async function fetchLabsInBuilding() {
  try {
    const labs = await getAllResources({
      type: 'LAB',
      location: 'Building A',
      minCapacity: 20
    });
    console.log('Found labs:', labs);
  } catch (error) {
    console.error('Error fetching resources:', error.message);
  }
}
```

---

## API Integration

### Backend API Contract

**Base URL**: `http://localhost:8081/api/resources`

#### GET /api/resources
Fetch all resources with optional filters.

**Query Parameters**:
```
?type=LAB&location=Block+A&minCapacity=20
```

**Response**:
```json
[
  {
    "id": "res-001",
    "name": "Room 101",
    "type": "LECTURE_HALL",
    "location": "Building A, 2nd Floor",
    "capacity": 50,
    "status": "ACTIVE",
    "availabilityWindows": "Monday 09:00-17:00, Tuesday 09:00-17:00",
    "description": "Main lecture hall"
  }
]
```

#### GET /api/resources/{id}
Fetch a single resource.

**Response**:
```json
{
  "id": "res-001",
  "name": "Room 101",
  "type": "LECTURE_HALL",
  "location": "Building A, 2nd Floor",
  "capacity": 50,
  "status": "ACTIVE",
  "availabilityWindows": "Monday 09:00-17:00, Tuesday 09:00-17:00",
  "description": "Main lecture hall"
}
```

#### POST /api/resources
Create a new resource.

**Request Body**:
```json
{
  "name": "Room 101",
  "type": "LECTURE_HALL",
  "location": "Building A, 2nd Floor",
  "capacity": 50,
  "status": "ACTIVE",
  "availabilityWindows": "Monday 09:00-17:00, Tuesday 09:00-17:00",
  "description": "Main lecture hall"
}
```

#### PUT /api/resources/{id}
Update a resource.

**Request Body**: Same as POST

#### DELETE /api/resources/{id}
Delete a resource.

**Response**: 204 No Content

---

## Styling & Theme

### Color Palette

**Primary Colors**:
- Dark Navy: `#0B1F3A`
- Text Gray: `#5A6A82`
- Light Gray: `#F7F8FC`
- Border: `rgba(11,31,58,0.12)`

**Resource Type Colors**:
- Lecture Hall: `#1A3F8F` (Blue)
- Lab: `#0F6E56` (Green)
- Meeting Room: `#854F0B` (Gold)
- Equipment: `#534AB7` (Purple)

**Status Colors**:
- Active: `#1D9E75` (Green)
- Out of Service: `#E24B4A` (Red)

**Accent Colors**:
- Success: `#10B981` (Green)
- Error: `#DC2626` (Red)
- Warning: `#F59E0B` (Orange)

### Typography

```javascript
{
  headings: 'font-family: Syne, sans-serif; font-weight: bold',
  body: 'font-family: inherit; font-weight: 400',
  labels: 'font-size: 11-12px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase',
  descriptions: 'font-size: 13px; color: #5A6A82'
}
```

### Spacing

- Extra small: `0.375rem` (6px)
- Small: `0.75rem` (12px)
- Medium: `1rem` (16px)
- Large: `1.5rem` (24px)
- Extra large: `2rem` - `2.75rem` (32-44px)

### Border Radius

- Small: `8px`
- Medium: `10-12px`
- Large: `14-18px`

### Shadows

```javascript
{
  small: '0 4px 12px rgba(0, 0, 0, 0.05)',
  medium: '0 10px 25px rgba(11, 31, 58, 0.15)',
  large: '0 25px 50px rgba(11, 31, 58, 0.15)'
}
```

### Animations

- **Dashboard Cards**: Hover scale effect (2px translateY)
- **Buttons**: Smooth color transitions (300ms)
- **Form Validation**: Instant field feedback
- **Delete Button**: Animated trash icon on hover
- **Spinner**: Continuous rotation (1s)

---

## Error Handling

### Error Types & Messages

```javascript
// Network errors
"Error fetching resources"
"Error creating resource"
"Error updating resource"
"Error deleting resource"

// Validation errors
"Resource name is required"
"Minimum 2 characters needed"
"Location is required"
"Capacity must be at least 1 person"
"At least one day must be available"

// API errors
"Failed to fetch resources: [statusText]"
"Failed to create resource: [message]"
"Resource not found"
```

### Error Display

**In Forms**:
```jsx
{error && (
  <div style={{
    backgroundColor: '#FEF2F2',
    color: '#DC2626',
    borderRadius: '12px',
    padding: '1rem',
    border: '1px solid rgba(220, 38, 38, 0.2)',
    marginBottom: '1.5rem'
  }}>
    ⚠ {error}
  </div>
)}
```

**In Lists**:
```jsx
{error && (
  <div style={{
    backgroundColor: '#FEF2F2',
    color: '#DC2626',
    padding: '1.5rem',
    borderRadius: '12px',
    textAlign: 'center'
  }}>
    {error}
  </div>
)}
```

### Error Recovery

```javascript
// Automatic retry on fetch
const fetchResources = async () => {
  try {
    const data = await getAllResources();
    setResources(data);
  } catch (err) {
    setError(err.message);
    // User can retry by clicking "Try Again" or reloading
  }
};

// Field validation errors are instant and clear
// Users receive immediate feedback to fix issues
```

---

## File Structure

```
src/pages/facilities/
├── README.md                    ← You are here
├── FacilitiesPage.jsx          (Main page component)
├── ResourceList.jsx            (Resource list container)
├── ResourceCard.jsx            (Resource card item)
├── ResourceForm.jsx            (Create/edit form modal)
├── ResourceFilter.jsx          (Filter sidebar)
└── ResourceDetail.jsx          (Single resource view)

src/services/
└── resourceService.js          (API service layer)

src/pages/book/                 (Related components)
```

---

## Component Data Flow

```
FacilitiesPage (isAdmin prop)
    ↓
ResourceList (Pass isAdmin)
    ├─→ resourceService.getAllResources()
    ├─→ ResourceFilter (Update filters)
    ├─→ Filtered resources list
    └─→ ResourceCard[] (Display resources)
        ├─→ ResourceForm (on edit)
        │   └─→ resourceService.createResource()
        │   └─→ resourceService.updateResource()
        └─→ resourceService.deleteResource()
```

---

## Quick Reference

### Import List

```javascript
// Pages
import FacilitiesPage from './pages/facilities/FacilitiesPage';
import ResourceList from './pages/facilities/ResourceList';

// Components
import ResourceCard from './pages/facilities/ResourceCard';
import ResourceForm from './pages/facilities/ResourceForm';
import ResourceFilter from './pages/facilities/ResourceFilter';
import ResourceDetail from './pages/facilities/ResourceDetail';

// Services
import {
  getAllResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  buildQueryString
} from './services/resourceService';
```

### Common Props Pattern

```javascript
// Always destructure and provide defaults
const MyComponent = ({ 
  isAdmin = false, 
  resource = null,
  onSubmit = () => {},
  onCancel = () => {}
}) => {
  // Component logic
};
```

### State Management Pattern

```javascript
// ResourceList uses local state with useEffect for async
const [resources, setResources] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await getAllResources();
      setResources(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, []);
```

---

## Advanced Features (Ready for Implementation)

- 🔄 **Drag & Drop**: Reorder resources
- 📊 **Bulk Operations**: Select multiple and perform actions
- 📥 **Export**: Download resources as CSV/PDF
- 🔔 **Notifications**: Toast/alert system
- 🌙 **Dark Mode**: Theme toggle
- 🔐 **Permissions**: Fine-grained access control
- 📱 **Mobile Optimization**: Touch gestures
- ♿ **Accessibility**: ARIA labels, keyboard navigation

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Components not loading | Check `resourceService.js` API URL matches backend |
| Filters not working | Ensure backend supports query parameters |
| Form validation not showing | Check `fieldErrors` state and `touchedFields` |
| Delete button not working | Confirm admin mode is enabled (`isAdmin={true}`) |
| Missing availability display | Check availability string format in backend response |
| Styling looks off | Ensure CSS cascade isn't conflicting with parent classes |

---

## Performance Tips

1. **Memoization**: Wrap heavy components with `React.memo()`
2. **Pagination**: Implement for large resource lists
3. **Lazy Loading**: Load images only when visible
4. **Debouncing**: Debounce filter changes for search
5. **Caching**: Cache `getAllResources()` responses
6. **Virtual Scrolling**: For lists with 100+ items

---

## Contributing Guidelines

When adding new features:

1. Follow existing component structure
2. Add PropTypes or JSDoc comments
3. Test with both admin and regular user modes
4. Ensure responsive design (mobile, tablet, desktop)
5. Add error handling for all API calls
6. Include loading and empty states
7. Document new props and functions

---

## License

Part of Smart Campus Project - IT3030 PAF 2026

---

**Last Updated**: April 2026  
**Version**: 1.0.0  
**Status**: Production Ready
