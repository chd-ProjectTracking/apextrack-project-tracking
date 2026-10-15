# ApexTrack Enterprise — Project Tracking & Executive Review Portal

An enterprise multi-tier project tracking and governance platform designed for luxury interior architecture, turnkey fit-out, and commercial construction projects. Built for **Classic Home Interior Decoration LLC** and **Rana Al Kassim Architecture** (Dubai, UAE).

---

## 🌟 Key Architecture & Workflows

### 1. Multi-Tier Role Governance & Personas
- **📦 Procurement & Sourcing Lead (Ayesha Khan)**: Manage Bill of Quantities (BoQ), vendor quotes, estimated vs. actual unit costs, net procurement variance, PO statuses (*Draft, RFQ Pending, PO Issued, In Transit, Delivered, Inspected*), and required-on-site delivery dates.
- **🏗️ Site Execution & Safety Supervisor (Tariq Mansoor)**: Submit daily site construction logs, labor headcount (*Skilled, General, Supervisors, Subcontractors*), active plant machinery, safety incidents, weather delays, and work planned tomorrow.
- **📋 Project Delivery Manager (David Chen, PMP)**: Track master schedule milestones, critical path dependencies, risk mitigation register, and package data for formal Operations review.
- **⚙️ Director of Operations & Quality Compliance (Elena Vance)**: Review operational feasibility checklists (*Supply chain lead times, site staffing readiness, cross-project resource conflicts, municipal compliance*), issue operational comments, and approve or request revisions.
- **👑 Founder & Chief Executive Officer (Rana Al Kassim)**: Review overall financial health (*Total Capex, committed contract ratio, net variance, projected ROI margin %*), grant binding executive directives, issue the official CEO Sign-Off Certificate, and authorize capital release.

---

### 2. High-Resolution Visual Inspection & 4K Video Walkthrough
- **Interactive 4K Video Walkthrough Player**: Features interactive timecode scrubbing (`01:25 / 04:18`), play/pause controls, 4K 60FPS HUD overlay, and quick-jump inspection checkpoints (*Grand Foyer, Living Salon & Acoustic Slats, Master Suite Millwork, Terrace & Pool*).
- **High-Resolution Photo Gallery & Lightbox**: High-res on-site imagery covering bookmatched marble dry-lays, custom fluted walnut millwork, and grand reception salons with inspection metadata and zoom view.
- **Timestamped Video Commentary**: Pin review remarks directly to specific timecodes in the video walkthrough.

---

### 3. Backend Control Panel & User Access Management
- **User Directory**: Search, filter, and inspect all team members across 5 organizational tiers.
- **Add Team Members**: Assign Name, Email, Department, Job Title, and Primary Role with 1-click role presets.
- **Delete Team Members**: Safe deletion with prompt confirmation.
- **10 Granular Permissions**:
  - `Can Add/Edit BoQ Items` (Procurement)
  - `Can Delete BoQ Items` (Procurement)
  - `Can Log Daily Site Progress` (Site Supervision)
  - `Can Upload Photos & 4K Video Walkthroughs` (Site Supervision)
  - `Can Manage Schedule Milestones` (Project Management)
  - `Can Log & Mitigate Risks` (Project Management)
  - `Can Submit for Operations Review` (Project Delivery)
  - `Can Grant Operations Sign-Off` (Operations Management)
  - `Can Grant CEO Sign-Off & Release Capital` (Executive Governance)
  - `Can Access Control Panel & Manage Users` (Administration)

---

### 4. User-Based Authentication Portal
- **1-Click Persona Sign-In**: Quick sign-in with any authorized team member.
- **Enterprise Email Sign-In**: Formal email login for corporate access simulation.
- **Persistent LocalStorage Sessions**: Encrypted browser state persistence.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun

### Installation
```bash
# Clone the repository
git clone https://github.com/chd-ProjectTracking/apextrack-project-tracking.git

# Navigate to project directory
cd apextrack-project-tracking

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

---

## 🏛️ Built For
- **Organization**: Classic Home Interior Decoration LLC
- **Architecture**: Rana Al Kassim (`ranaalkassim.com`)
- **Location**: Umm Suqeim Road, Al Barsha 2, Dubai, UAE
