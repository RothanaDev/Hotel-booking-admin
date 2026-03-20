# Hotel Booking Admin Dashboard

A modern, responsive, and feature-rich administration panel for hotel management. Built with **Next.js 15 (App Router)**, **React**, **TypeScript**, and **Tailwind CSS**.

## ✨ Features

- **Dashboard Overview**: Get a bird's-eye view of your hotel's performance, revenue, and bookings.
- **Booking Management**: Seamlessly manage reservations, track statuses, and handle guest requests.
- **Room Management**: Add, update, and categorize rooms. Set pricing and manage room availability.
- **Inventory Control**: Track and manage hotel inventory, supplies, and stock levels.
- **Service Management**: Define and manage extra services (Dining, Wellness, Excursions, Transportation, etc.).
- **Payment Processing**: View all payment transactions, filter by method (PayPal, Cash), and track total revenues seamlessly.
- **Maintenance Tracking**: Manage maintenance tickets, assign tasks, and track their resolutions.
- **Authentication**: Secure login system with role-based routing.

## 🛠 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Fetching**: [TanStack React Query](https://tanstack.com/query/latest)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Alerts/Modals**: [SweetAlert2](https://sweetalert2.github.io/)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.x or later)
- npm or yarn or pnpm

### Installation

1. **Clone the repository** (if applicable) or download the source code.
2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory and add any necessary backend API URLs or keys (e.g., `NEXT_PUBLIC_API_URL`).

4. **Run the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

- `/app`: Contains all Next.js routes, layouts, and page components.
  - `(auth)`: Login and authentication pages.
  - `(dashboard)`: All protected admin pages (Rooms, Bookings, Payments, etc.).
- `/components`: Reusable UI components (buttons, inputs, cards, etc.).
- `/hooks`: Custom React hooks, including React Query mutations and queries (`use-queries.ts`).
- `/lib`: Utility functions and Zod validation schemas.
- `/types`: TypeScript type definitions and interfaces.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
