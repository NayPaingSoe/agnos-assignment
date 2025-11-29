# Development Planning Documentation

## Project Structure

```
agnos-assignment/
├── agnos-frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/                   # Next.js app router
│   │   │   ├── patient/           # Patient form page
│   │   │   ├── staff/             # Staff dashboard page
│   │   │   └── layout.js          # Root layout
│   │   ├── components/            # Reusable UI components
│   │   │   └── ui/                # UI component library
│   │   │       ├── badge.jsx      # Status badge component
│   │   │       ├── button.jsx     # Button component
│   │   │       ├── card.jsx       # Card component
│   │   │       ├── date-picker.jsx # Date picker component
│   │   │       ├── input.jsx      # Input component
│   │   │       ├── label.jsx      # Label component
│   │   │       ├── motion-container.jsx # Framer Motion animation components
│   │   │       ├── select.jsx     # Select dropdown component
│   │   │       └── sonner.jsx     # Toast notification component
│   │   └── lib/
│   │       ├── config.js          # Application configuration
│   │       └── utils.js           # Utility functions
│   ├── public/                    # Static assets
│   └── package.json               # Frontend dependencies
├── websocket-server/              # Socket.io server
│   ├── index.js                   # WebSocket server implementation
│   └── package.json               # Server dependencies
└── README.md                      # Project documentation
```

## Real-Time Synchronization Flow

The system leverages WebSockets (Socket.io) for real-time bidirectional communication between the patient form and the staff dashboard.

**Key Event Flow:**

- **Patient Connection**: When a patient accesses the form, they connect to the WebSocket server, which registers their presence.
- **Real-time Updates**: As the patient fills out the form, their input is continuously sent to the server via `patient:update` events. The server then broadcasts these updates to the staff dashboard, allowing staff to monitor patient progress in real-time.
- **Form Submission**: Upon successful submission, a `patient:submit` event is triggered, updating the patient's status on the server and notifying the staff.
- **Patient Disconnection**: If a patient disconnects before submitting, the server detects this and updates their status to "inactive" on the staff dashboard.

### WebSocket Event Flow

1. **Patient Connection**

   ```
   Patient → Socket.io → "join" event → Server registers patient
   ```

2. **Real-time Updates**

   ```
   Patient types → Form validation → "patient:update" → Server → Staff dashboard update
   ```

3. **Form Submission**

   ```
   Patient submits → "patient:submit" → Server → Status change → Staff notification
   ```

4. **Patient Disconnection**
   ```
   Patient disconnects → Server detects → Status to "inactive" → Staff dashboard update
   ```

**Status Management:**

- **Actively Filling**: Indicates the patient is currently interacting with the form.
- **Inactive**: Signifies a patient who disconnected without completing the submission.
- **Submitted**: Denotes a patient who has successfully submitted their registration form.

## Design Decisions

The UI/UX design prioritizes a clean, intuitive, and responsive experience for both patients and staff, adapting seamlessly across various screen sizes.

### Responsive Design

- **Mobile-First Approach**: The layout and components are designed to be fully functional and aesthetically pleasing on smaller screens first, then progressively enhanced for larger viewports.
- **Flexible Grids and Stacks**: Utilizing Tailwind CSS, elements are arranged using flexible grid and flexbox utilities to ensure proper spacing and alignment on different devices.
- **Adaptive Forms**: Patient forms adjust their input field arrangements and sizing to prevent horizontal scrolling and maintain readability on mobile devices.

### Accessibility (A11y)

- **`shadcn/ui` Foundation**: The choice of `shadcn/ui` components, built on Radix UI primitives, inherently provides a strong foundation for accessibility. This includes proper ARIA attributes, keyboard navigation support, and focus management.
- **Semantic HTML**: Emphasis on using semantic HTML elements to improve screen reader compatibility and overall document structure.
- **Color Contrast**: Careful selection of color palettes to ensure sufficient contrast for readability.

### User Experience (UX)

- **Clear Labeling and Instructions**: All form fields and interactive elements have clear, concise labels and, where necessary, helpful instructions to guide the user.
- **Instant Feedback**:
  - **Form Validation**: Real-time form validation (using Zod and React Hook Form) provides immediate feedback to the patient, guiding them to correct errors before submission.
  - **Staff Dashboard**: Real-time updates via WebSockets ensure staff see patient activity and status changes instantly, reducing latency and improving operational efficiency.
- **Intuitive Navigation**: The dual interface (patient form, staff dashboard) is designed for straightforward navigation, minimizing cognitive load.
- **Visual Hierarchy**: Information is presented with a clear visual hierarchy, using typography, spacing, and component placement to draw attention to important elements.

### Visual Aesthetics

- **Modern and Minimalist**: A clean, modern aesthetic is achieved using Tailwind CSS, focusing on essential elements and ample whitespace to reduce clutter.
- **Consistent Styling**: A consistent design language is applied across all components and pages, ensuring a cohesive look and feel.
- **Smooth Transitions**: Framer Motion is integrated to provide subtle yet engaging animations and transitions, enhancing the perceived responsiveness and fluidity of the application without being distracting.
