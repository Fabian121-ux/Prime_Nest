# **App Name**: Prime Nest

## Core Features:

- User Authentication: Enable email/password signup and login with Firebase Authentication, allowing users to select one of these roles: Tenant, Artisan, Landlord. The roles will then be stored in Firestore.
- Role-Based Dashboard: The dashboard will display role-specific UI elements and content. The Tenant view should display listings, the Artisan view should be for service postings, and the Landlord view for property postings.
- Listing Creation: Allow Landlords to create simple listings with title, description, and price fields to store in Firestore.
- Public Explore Page: Create a public page displaying listings for Tenants.
- In-App Chat: Enable basic in-app chat between users, connected to listings and jobs, with messages stored in Firestore.
- Escrow Simulation: Implement a simulated escrow payment system with status states such as initiated, held, and released.
- Admin Panel: Set up an admin login to approve users and listings, and manually release escrow payments.

## Style Guidelines:

- Primary color: Soft Blue (#A2B3FF). A calm, trustworthy tone suggesting stability.
- Background color: Light Blue (#F0F4FF). Provides a clean and airy backdrop, maintaining focus on content.
- Accent color: Lavender (#D0BFFF). A delicate variation on blue, this is less visually distracting than most accent hues, which is important to make the interface easily scannable.
- Body and headline font: 'PT Sans' (sans-serif). Combines a modern look and a little warmth, conveying a trustworthy message to the user.
- Use clean and modern icons to represent various roles, listing types, and payment statuses.
- Maintain a simple, well-spaced layout focusing on role separation and clarity for investors.
- Use subtle transitions and animations for user interactions, like escrow status changes and message delivery.