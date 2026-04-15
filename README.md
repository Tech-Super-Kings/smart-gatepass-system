# Smart Digital GatePass System

Smart Digital GatePass is a modern visitor management system designed to replace manual gate registers with a fast, secure, and contactless digital workflow.

It is built for apartments, offices, campuses, and gated communities to improve security, reduce waiting time, and maintain real-time visitor records.

## Live Links

- Production Website: https://www.smartgatepass.me/
- Deployment (Vercel): https://smart-gatepass-system-two.vercel.app/
- Video Presentation: https://drive.google.com/drive/folders/1f0OpC8jHS0avGB1jTpAaMz5XAB4J4_gG?usp=sharing

## Problem

Most existing visitor management systems are still manual or inefficient. Common issues include:

- Delays due to manual entry  
- Lack of real-time tracking  
- Poor verification methods  
- No proper record management  

## Solution

This project introduces a digital gate pass system with:

- Pre-registration by host  
- QR / OTP-based verification  
- Fast, contactless entry  
- Real-time visitor tracking  
- Centralized admin monitoring  

It ensures better security and a smoother entry experience without replacing essential verification steps.

## Features

### Host Panel
- Register visitors in advance  
- Generate digital passes  
- Approve or reject walk-in requests  

### Visitor Pass
- QR-based entry system  
- Pass status tracking  
- Digital pass interface  

### Security Panel
- Verify visitors using QR or pass code  
- Mark entry and exit  
- View visitor details instantly  

### Admin Dashboard
- View all visitor logs  
- Filter by status  
- Monitor system activity  

### Walk-in Flow
- Visitors can submit details themselves  
- Host can approve or reject requests  
- Supports unplanned visits securely  

## Tech Stack

**Frontend**
- Next.js (App Router)  
- React  
- Tailwind CSS  

**Backend**
- Next.js API Routes  
- Node.js  

**Database**
- MongoDB Atlas  

**Deployment**
- Vercel  

## Project Structure

```
app/         Application routes and pages  
components/  Reusable UI and feature components  
lib/         Utility functions and services  
models/      Database models  
public/      Static assets  
```

## Setup Instructions

Install dependencies:

```bash
npm install
```

Create a `.env.local` file:

```env
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Run the development server:

```bash
npm run dev
```

## Current Status

- MVP completed and deployed  
- Core workflows implemented (Host, Visitor, Security, Admin)  
- MongoDB integration completed  
- Walk-in visitor approval flow implemented  

## Future Improvements

- Mobile application support  
- SMS / WhatsApp notifications  
- Face recognition integration  
- Advanced analytics dashboard  
- IoT-based gate integration  


## Team

Tech Super Kings  

- Ashwin Kumar A - FRONTEND DEVELOPER
- Gokul S - BACKEND DEVELOPER
- Vigneshwaran Vinayagamoorthy - SECURITY & SYSTEM DESIGNER
- PIYUSH KUMAR - DATABASE & INTEGRATION ENGINEER


## License

MIT License
