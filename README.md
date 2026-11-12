# SeekResearch

**A research discovery and academic outreach platform for students.**

SeekResearch helps students explore research opportunities, discover faculty profiles at leading global universities, and prepare thoughtful academic outreach.

## Project Overview

Finding research opportunities can be difficult for high-school and undergraduate students. Information is scattered across university websites, and approaching professors without guidance can be intimidating.

SeekResearch aims to make this process more accessible through:

- Faculty discovery across global universities.
- Research guidance across Science, Commerce, Design and Humanities.
- Guidance for writing academic cold emails.
- Student accounts and private draft storage.
- Practical outreach guidance and resources.

## Main Features

- Faculty discovery and research exploration.
- Four academic subject pillars.
- Research guidance cards and outreach strategies.
- Student authentication with email verification.
- Private student profiles and saved submissions.
- Daily submission limits.
- Guest preview experience.
- Admin moderation controls.

## Technology Stack

- HTML5
- CSS3
- JavaScript (ES modules)
- Firebase Authentication
- Cloud Firestore
- Firebase Emulator Suite
- Node.js
- Mocha and Playwright for testing

## Project Structure

```text
app/
├── index.html
├── public/
│   ├── index.html
│   ├── css/
│   └── js/
├── css/
│   └── seekresearch.css
├── js/
│   ├── seekresearch-app.js
│   ├── firebase-config.js
│   ├── firebase-auth.js
│   ├── firebase-db.js
│   ├── firebase-portal.js
│   └── firebase-portal-view.js
├── assets/
├── scripts/
├── tests/
├── firestore.rules
├── firestore.indexes.json
├── firebase.json
├── HACKATHON_DEMO.md
├── HACKATHON_PRESENTATION.md
└── README.md
```

## Running the Local Demo

This project is currently prepared for a local Firebase Emulator demonstration.

### Requirements

- Node.js
- npm
- Firebase Emulator Suite (installed through the project dependencies)

### Install dependencies

```bash
npm install
```

### Verify hosting files

```bash
npm run prepare:hosting:verify
```

### Run automated tests

```bash
npm test
```

### Start the local emulators

```bash
npm run emulators
```

Open the local demo:

```text
http://127.0.0.1:5000/?emulator=1
```

Firebase Emulator UI:

```text
http://127.0.0.1:4000
```

For the complete walkthrough, see [HACKATHON_DEMO.md](HACKATHON_DEMO.md).

## Security and Privacy

Security is an important part of this project.

Implemented protections include:

- Firestore security rules.
- Authentication and verified-email requirements.
- Student-specific data access restrictions.
- Role-based administrator permissions.
- Daily usage limits.
- Input validation and XSS regression tests.
- Restrictive Content Security Policy and security headers.

**Important:** This is a hackathon prototype demonstrated using local Firebase emulators. It is not a production service, ands