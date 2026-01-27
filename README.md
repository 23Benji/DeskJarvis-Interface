# 🤖 DeskJarvis (Angular Edition)

**DeskJarvis** is a futuristic, web-based personal dashboard and desktop simulator. Built with the cutting-edge **Angular 20**, it combines productivity tools with retro gaming entertainment in a fully customizable, draggable interface.

> *Your personal AI-assisted workspace, reimagined for the web.*

---

## ✨ Key Features

### 🖥️ Interactive Dashboard

A fully modular workspace where you control the layout.

* **Draggable Widgets:** Powered by `@angular/cdk`, organize your screen exactly how you want it.
* **Widget Toolbox:** Hide widgets to clear clutter and restore them via a sleek toolbox menu.
* **Persistent State:** Smart routing logic remembers if you have seen the Intro or Tutorial.

### 🧩 Smart Widgets

* **🧠 AI Center:** An integrated AI interaction point.
* **🎵 Music Player:** Built-in audio controls for your workflow vibes.
* **☁️ Weather & 🕒 Clock:** Real-time updates.
* **📝 Notes & 📅 Calendar:** Keep track of your tasks and schedule.
* **🖼️ Resizable Images:** Pin your favorite visuals to the dashboard.

### 🕹️ Arcade Hub (Powered by Kaplay)

Need a break? Switch to the Games tab for integrated browser games:

* **🦆 Duck Hunt:** A retro classic reimagined.
* **🧱 Tetris:** The timeless puzzle game.

### 🎨 Visual & UX

* **Matrix Effect:** a Cyberpunk-inspired visual mode.
* **Immersive Intro:** Cinematic introduction sequence.
* **Interactive Tutorial:** Guided onboarding for new users.

---

## 🛠️ Tech Stack

* **Framework:** [Angular 20.3](https://angular.dev/) (Standalone Components)
* **Build Tool:** Vite & Angular CLI
* **Styling:** SCSS (Sass)
* **Icons:** [Lucide Angular](https://lucide.dev/)
* **Game Engine:** [Kaplay.js](https://kaplayjs.com/) (formerly Kaboom.js)
* **Interactivity:** Angular CDK (Drag & Drop)
* **State Management:** RxJS

---

## 🚀 Getting Started

### Prerequisites

* Node.js (v18 or higher recommended)
* npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/desk-jarvis-ang.git
cd desk-jarvis-ang

```


2. **Install dependencies**
```bash
npm install

```


3. **Run the development server**
```bash
npm start
# OR
ng serve

```


4. **Open the app**
Navigate to `http://localhost:4200/`.

---

## 📂 Project Structure

```text
src/
├── app/
│   ├── dashboard/       # Main desktop interface & widgets
│   ├── games/           # Game Hub (Duck Hunt, Tetris)
│   ├── homescreen/      # Landing page after intro
│   ├── intro/           # Cinematic intro sequence
│   ├── matrix-effect/   # Visual screensaver effect
│   ├── settings/        # Application configuration
│   ├── tutorial/        # User onboarding flow
│   ├── app.routes.ts    # Routing logic (Guards & Paths)
│   └── app.config.ts    # Application configuration
└── assets/              # Graphics, Sounds, and Data models

```

---

## 🧭 Application Flow

The application features an intelligent routing flow defined in `app.routes.ts`:

1. **Root (`/`)**: Checks `sessionStorage`.
* *First time?* → Plays **Intro**.
* *Intro done?* → Plays **Tutorial**.
* *All done?* → Goes to **Home**.


2. **Home (`/home`)**: The central landing pad.
3. **Dashboard (`/dashboard`)**: The main draggable workspace.

---

## 👾 Scripts

| Command | Description |
| --- | --- |
| `npm start` | Runs the app in development mode (ng serve). |
| `npm run build` | Builds the app for production. |
| `npm test` | Runs unit tests via Karma/Jasmine. |
| `npm run dev` | Runs via Vite directly. |

---

## 🤝 Contributing

Contributions are welcome! If you want to add a new widget or game:

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingWidget`).
3. Commit your changes (`git commit -m 'Add some AmazingWidget'`).
4. Push to the branch (`git push origin feature/AmazingWidget`).
5. Open a Pull Request.

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](https://www.google.com/search?q=LICENSE) file for details.
