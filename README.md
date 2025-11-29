# Agnos Patient Registration System

A real-time patient registration system with dual interfaces - a patient form for data entry and a staff dashboard for monitoring. Built with Next.js, ShadcnUI, Tailwind CSS, and Socket.io for real-time synchronization.

## 🚀 Live Demo

- **Frontend**: [https://agnos-assignment.vercel.app](https://agnos-assignment.vercel.app)
- **WebSocket Server**: [https://agnos-websocket-production.up.railway.app](https://agnos-websocket-production.up.railway.app)

## 📋 Project Overview

Real-time patient registration system with dual interfaces:

- **Patient Form**: Responsive form for patient data entry
- **Staff Dashboard**: Real-time monitoring of patient registrations

Uses WebSocket technology for instant synchronization between interfaces.

## 🛠️ Tech Stack

### Frontend

- **Next.js 16**: React framework for production
- **shadcn/ui**: Accessible component library (Radix UI + Tailwind)
- **Tailwind CSS**: Utility-first CSS framework
- **React Hook Form**: Performant form handling
- **Zod**: Schema validation
- **Socket.io Client**: Real-time communication
- **Framer Motion**: Animation library for smooth transitions

### WebSocket

- **Node.js**: Server runtime
- **Socket.io**: WebSocket server for real-time communication

### Deployment

- **Vercel**: Frontend deployment
- **Railway**: WebSocket server deployment

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

1. **Clone & install**

   ```bash
   git clone https://github.com/NayPaingSoe/agnos-assignment.git
   cd agnos-assignment
   ```

2. **Start WebSocket server**

   ```bash
   cd websocket-server
   npm install && npm start
   # Runs on http://localhost:8080
   ```

3. **Start frontend**

   ```bash
   cd ../agnos-frontend
   npm install && npm run dev
   # Runs on http://localhost:3000
   ```

4. **Access**
   - Patient: `http://localhost:3000/patient`
   - Staff: `http://localhost:3000/staff`

## ✨ Key Features

### Patient Form Features

- **Comprehensive Data Collection**: Personal details, emergency contacts, preferences
- **Real-time Validation**: Instant field feedback with proper rules
- **Responsive Design**: Mobile and desktop optimized
- **User-Friendly Interface**: Clean design with clear labeling

### Staff Dashboard Features

- **Real-time Monitoring**: See patient info as it's typed
- **Status Indicators**: Activity status (filling, inactive, submitted)
- **Patient Management**: View, manage, remove records
- **Multi-Patient Support**: Handle multiple patients simultaneously
- **Responsive Layout**: Works across all screen sizes

### Technical Features

- **WebSocket Integration**: Real-time bidirectional communication
- **Framer Motion**: Smooth animations and transitions
- **Modern UI Components**: shadcn/ui with Tailwind CSS
- **Form Validation**: Zod + React Hook Form validation
- **Error Handling**: Robust feedback system

## 🌟 Bonus Features

### Inactivity Detection

- Automatically marks patient as 'inactive' after 5-10 seconds of no activity (unless submitted)

### shadcn/ui Integration

- Accessible, customizable UI components
- Built on Radix UI primitives
- Medical-grade design aesthetics

### Framer Motion

- Smooth page transitions
- Animated components
- Performance optimized
- Reduced motion support

### Enhanced UX

- Toast notifications
