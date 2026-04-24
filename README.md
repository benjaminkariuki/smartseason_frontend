# Smart Seasons - Frontend Portal

The frontend application for Smart Seasons, a modern, headless-first field management system. This repository serves as the presentation and user interaction layer, delivering role-based dashboards for Administrators and Field Agents to track agricultural assets and manage operational data.

Built with an "Integrity & Engineering" philosophy, this UI prioritizes high-trust, professional design and robust data handling over flashy visuals.

## 🛠 Tech Stack
* **Framework:** React 18 + Vite (for rapid compilation)
* **Styling:** Tailwind CSS (Modern SaaS aesthetic, strict design system)
* **Server State & Caching:** TanStack React Query
* **Icons:** Lucide React

---

## 🏗 Design Decisions

* **Role-Specific Dashboards:** The UI is structurally divided into distinct experiences. The Admin Dashboard focuses on macro-level metrics, risk assessment (e.g., fields untouched for 14+ days), and global user management. The Agent Dashboard is heavily optimized for fast data entry and task logging in the field.
* **Robust Server State Management:** Instead of relying on standard manual data arrays and complex local state setups, we utilize **React Query**. This handles caching, loading states (`isPending`), and background refetching. For example, creating a new user instantly triggers a silent invalidation of the `['admin_all_users']` query to seamlessly update the master table.
* **Strict Client-Side Data Parsing:** To prevent classic JavaScript truthiness bugs (where backend APIs pass `"0"` or `1` instead of native booleans), the frontend enforces strict boolean parsing logic on critical UI components (like the Red/Green account access toggles) ensuring mathematical accuracy in the UI state.
* **Performance via Observers:** Native browser APIs are favored over heavy libraries for UI interactions. We utilize the `IntersectionObserver` API for infinite scrolling on long field lists, fetching next pages smoothly without blocking the main browser thread.
* **Instant Visual Feedback (UX):** Destructive or database-altering actions (like toggling an agent's platform access) immediately lock the specific row's UI and display a localized spinner, preventing double-clicks and improving user confidence.

##  Assumptions Made

* **Decoupled Backend:** It is assumed this frontend operates entirely independently of the backend repository. All data operations communicate via RESTful API endpoints defined by the `VITE_API_BASE_URL` environment variable.
* **Authentication Handling:** It is assumed that API requests are protected. The HTTP client (e.g., Axios) is configured to intercept requests and append necessary authentication cookies (Sanctum) obtained during the login flow.
* **Modern Browser Environment:** The application assumes execution in modern browsers that support native APIs like `IntersectionObserver` and the `navigator.clipboard` API (used for the initial password copy feature).

---

##  Setup Instructions

Follow these steps to get the frontend development environment running locally.

### 1. Clone & Install
```bash
# Navigate to your preferred workspace
git clone https://github.com/benjaminkariuki/smartseason_frontend.git

# Install dependencies
npm install
npm run dev

DEPLOYMENT LINK:  https://smartseason-mauve.vercel.app/