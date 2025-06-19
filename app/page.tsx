"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Calendar, BookOpen, CheckSquare, PenTool, TrendingUp, Search } from "lucide-react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import Navigation from "@/components/navigation"
import NotesView from "@/components/notes-view"
import JournalView from "@/components/journal-view"
import TasksView from "@/components/tasks-view"
import StudyView from "@/components/study-view"
import SettingsView from "@/components/settings-view"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { ProtectedRoute } from "@/components/protected-route"

function MindSyncApp() {
  const { data: session } = useSession()
  const [activeView, setActiveView] = useState("dashboard")
  const [searchQuery, setSearchQuery] = useState("")
  const [dashboardData, setDashboardData] = useState({
    totalNotes: 0,
    journalStreak: 0,
    pendingTasks: 0,
    studyProgress: 0,
    recentNotes: [],
    upcomingTasks: [],
    studySubjects: [],
  })

  useEffect(() => {
    if (session) fetchDashboardData()
  }, [session])

  const fetchDashboardData = async () => {
    try {
      const [tasksRes, journalRes, subjectsRes, notesRes] = await Promise.all([
        fetch("/api/tasks"),
        fetch("/api/journal"),
        fetch("/api/subjects"),
        fetch("/api/notes"),
      ])
      const tasks = tasksRes.ok ? await tasksRes.json() : []
      const journal = journalRes.ok ? await journalRes.json() : []
      const subjects = subjectsRes.ok ? await subjectsRes.json() : []
      const notes = notesRes.ok ? await notesRes.json() : []

      const pendingTasks = tasks.filter((task: any) => task.status !== "Done").length
      const journalStreak = calculateJournalStreak(journal)
      const studyProgress = calculateOverallStudyProgress(subjects)

      setDashboardData({
        totalNotes: notes.length,
        journalStreak,
        pendingTasks,
        studyProgress,
        recentNotes: notes.slice(0, 3),
        upcomingTasks: tasks.slice(0, 3),
        studySubjects: subjects.slice(0, 3),
      })
    } catch (err) {
      console.error("Dashboard fetch error:", err)
    }
  }

  const calculateJournalStreak = (entries: any[]) => {
    if (entries.length === 0) return 0
    const today = new Date()
    let streak = 0
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(today.getDate() - i)
      const hasEntry = entries.some((entry) => new Date(entry.date).toDateString() === checkDate.toDateString())
      if (hasEntry) streak++
      else if (i === 0) continue
      else break
    }
    return streak
  }

  const calculateOverallStudyProgress = (subjects: any[]) => {
    if (!subjects.length) return 0
    const totalTopics = subjects.reduce(
      (acc, s) =>
        acc +
        (s.chapters?.reduce((cAcc: number, c: any) => cAcc + (c.topics?.length || 0), 0) || 0),
      0
    )
    const studiedTopics = subjects.reduce(
      (acc, s) =>
        acc +
        (s.chapters?.reduce(
          (cAcc: number, c: any) => cAcc + (c.topics?.filter((t: any) => t.status !== "Not Started").length || 0),
          0
        ) || 0),
      0
    )
    return totalTopics > 0 ? Math.round((studiedTopics / totalTopics) * 100) : 0
  }

  const renderContent = () => {
    switch (activeView) {
      case "notes":
        return <NotesView searchQuery={searchQuery} onDataChanged={fetchDashboardData} />
      case "journal":
        return <JournalView onDataChanged={fetchDashboardData} />
      case "tasks":
        return <TasksView onDataChanged={fetchDashboardData} />
      case "study":
        return <StudyView />
      case "settings":
        return <SettingsView />
      default:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Welcome back, {session?.user?.name}! 👋</h1>
                <p className="text-muted-foreground mt-1">Here's your productivity overview for today</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: "Total Notes",
                  value: dashboardData.totalNotes,
                  icon: <PenTool className="h-4 w-4 text-muted-foreground" />,
                  message: dashboardData.totalNotes === 0 ? "Create your first note" : "Keep writing!",
                },
                {
                  title: "Journal Streak",
                  value: `${dashboardData.journalStreak} days`,
                  icon: <Calendar className="h-4 w-4 text-muted-foreground" />,
                  message: dashboardData.journalStreak === 0 ? "Start journaling today!" : "Keep it up! 🔥",
                },
                {
                  title: "Pending Tasks",
                  value: dashboardData.pendingTasks,
                  icon: <CheckSquare className="h-4 w-4 text-muted-foreground" />,
                  message:
                    dashboardData.pendingTasks === 0
                      ? "No pending tasks"
                      : `${dashboardData.pendingTasks} tasks to complete`,
                },
                {
                  title: "Study Progress",
                  value: `${dashboardData.studyProgress}%`,
                  icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
                  message: dashboardData.studyProgress === 0 ? "Start studying today!" : "Overall completion",
                },
              ].map((card, i) => (
                <Card
                  key={i}
                  className="transition-colors duration-300 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 text-gray-900 dark:text-white shadow-md rounded-2xl"
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                    {card.icon}
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{card.value}</div>
                    <p className="text-xs text-muted-foreground">{card.message}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* THIS DIV STACKS THE CARDS VERTICALLY WITH FULL WIDTH */}
            <div className="flex flex-col gap-6 w-full">
              <Card className="w-full transition-colors duration-300 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 text-gray-900 dark:text-white shadow-md rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckSquare className="w-5 h-5" />
                    Upcoming Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {dashboardData.upcomingTasks.length > 0 ? (
                    dashboardData.upcomingTasks.map((task: any) => (
                      <div
                        key={task._id}
                        className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                      >
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <p className="text-sm text-muted-foreground">Due: {task.dueDate}</p>
                        </div>
                        <Badge variant={task.priority === "High" ? "destructive" : "default"}>
                          {task.priority}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No upcoming tasks</p>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    className="w-full border-slate-300 dark:border-slate-600"
                    onClick={() => setActiveView("tasks")}
                  >
                    View All Tasks
                  </Button>
                </CardContent>
              </Card>

              <Card className="w-full transition-colors duration-300 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 text-gray-900 dark:text-white shadow-md rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Study Progress
                  </CardTitle>
                  <CardDescription>Track your learning journey across subjects</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {dashboardData.studySubjects.length > 0 ? (
                    dashboardData.studySubjects.map((subject: any) => (
                      <div key={subject._id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{subject.name}</span>
                          <span className="text-sm text-muted-foreground">{subject.chapters?.length || 0} chapters</span>
                        </div>
                        <Progress value={calculateOverallStudyProgress([subject])} className="h-2" />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No study subjects yet</p>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    className="w-full border-slate-300 dark:border-slate-600"
                    onClick={() => setActiveView("study")}
                  >
                    View Study Tracker
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )
    }
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Navigation activeView={activeView} setActiveView={setActiveView} />
        <div className="flex-1 flex flex-col">
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center gap-4 px-6">
              <SidebarTrigger />
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search notes, tasks, journal..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">{renderContent()}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <ProtectedRoute>
          <MindSyncApp />
        </ProtectedRoute>
      </AuthProvider>
    </ThemeProvider>
  )
}
