# MindSync7

MindSync7 is a comprehensive productivity and study management app designed for students and professionals. It combines task management, note-taking, study tracking, and daily journaling into a single, modern web application.

---

## 🚀 Features

### 1. Task Manager
- Create, edit, and delete tasks with priorities, due dates, categories, tags, and estimated time.
- Subtasks support with progress tracking and completion percentage.
- Recurring tasks (daily, weekly, monthly) with custom intervals.
- Built-in Pomodoro timer for focused work sessions.
- Per-task timer to track time spent.
- Task analytics: total tasks, completed, in-progress, and completion rate.

### 2. Notes
- Add, edit, and delete notes.
- Pin notes to prioritize important information.
- Organize notes for quick access.

### 3. Study Tracker
- Add subjects, chapters within subjects, and topics within chapters.
- Mark topics and chapters as studied or not studied.
- "Revised" button to mark topics as revised.
- Track syllabus completion percentage for each subject and overall.
- Visual dashboard for study progress.

### 4. Daily Journal
- Write daily journal entries to reflect on your day.
- Streak feature: track how many consecutive days you’ve maintained your journaling habit.
- Dashboard shows streak info and journal stats.

### 5. Dashboard
- Overview of all productivity stats:
  - Number of notes.
  - Pending and completed tasks.
  - Daily journal streak and entry info.
  - Percentage of syllabus completed in the study tracker.

---

## 🛠 Tech Stack

- **Frontend:** React (Next.js), TypeScript
- **UI:** Tailwind CSS, Lucide Icons, Custom Components
- **Backend:** Next.js API routes or Express (RESTful API)
- **Database:** MongoDB (suggested by usage patterns)
- **State Management:** React Hooks
- **Other:** Modern ES6+, CSS Modules or Tailwind

---

## 💡 Impact

MindSync7 helps users:
- Stay organized with tasks and notes.
- Track and complete their study syllabus efficiently.
- Build a journaling habit and maintain streaks.
- Visualize productivity and study progress in a single dashboard.

---

## ⚙️ Implementation Overview

- Modular UI with reusable components for cards, dialogs, badges, progress bars, etc.
- All data (tasks, notes, study tracker, journal) is fetched and updated via API endpoints.
- Timers and streaks are managed with React state and intervals.
- Study tracker uses nested data structures for subjects, chapters, and topics.
- Dashboard aggregates and displays all key stats.

---

## 📦 Getting Started

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/mindsync7.git
   cd mindsync7
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**
   - Configure your MongoDB URI and any other required variables in `.env.local`.

4. **Run the development server:**
   ```sh
   npm run dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).

---

## 📄 License

MIT License

---

## 🙏 Credits

Developed by [Your Name].  
UI icons by [Lucide Icons](https://lucide.dev/).

---
