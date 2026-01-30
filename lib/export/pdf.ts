import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export interface ProjectReport {
  name: string
  status: string
  progress: number
  tasksCompleted: number
  tasksTotal: number
  lastActivity: string
}

export interface WeeklyReport {
  projects: ProjectReport[]
  totalProjects: number
  activeProjects: number
  completedTasks: number
  totalTasks: number
  dateRange: string
}

export function generateWeeklyReport(data: WeeklyReport): void {
  const doc = new jsPDF()
  
  // Title
  doc.setFontSize(20)
  doc.text('Mission Control - Weekly Report', 14, 22)
  
  // Date range
  doc.setFontSize(12)
  doc.setTextColor(100)
  doc.text(data.dateRange, 14, 30)
  
  // Summary stats
  doc.setFontSize(10)
  doc.setTextColor(0)
  doc.text(`Total Projects: ${data.totalProjects}`, 14, 40)
  doc.text(`Active Projects: ${data.activeProjects}`, 14, 46)
  doc.text(`Tasks Completed: ${data.completedTasks}/${data.totalTasks}`, 14, 52)
  
  // Projects table
  const tableData = data.projects.map(p => [
    p.name,
    p.status,
    `${p.progress}%`,
    `${p.tasksCompleted}/${p.tasksTotal}`,
    p.lastActivity
  ])
  
  autoTable(doc, {
    startY: 60,
    head: [['Project', 'Status', 'Progress', 'Tasks', 'Last Activity']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [71, 85, 105] },
    styles: { fontSize: 9 },
  })
  
  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150)
    doc.text(
      `Page ${i} of ${pageCount} | Generated ${new Date().toLocaleDateString()}`,
      14,
      doc.internal.pageSize.height - 10
    )
  }
  
  // Save
  doc.save(`mission-control-report-${new Date().toISOString().split('T')[0]}.pdf`)
}

export function generateProjectReport(project: any, tasks: any[]): void {
  const doc = new jsPDF()
  
  // Title
  doc.setFontSize(20)
  doc.text(project.name, 14, 22)
  
  // Description
  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text(project.description, 14, 30, { maxWidth: 180 })
  
  // Stats
  doc.setFontSize(10)
  doc.setTextColor(0)
  let y = 45
  doc.text(`Status: ${project.status}`, 14, y)
  y += 6
  doc.text(`Progress: ${project.progress}%`, 14, y)
  y += 6
  doc.text(`Tasks: ${project.tasksCompleted}/${project.tasksTotal}`, 14, y)
  y += 6
  doc.text(`Documents: ${project.documentsCount}`, 14, y)
  y += 6
  doc.text(`Last Activity: ${project.lastActivity}`, 14, y)
  y += 10
  
  // Tasks breakdown
  doc.setFontSize(12)
  doc.text('Tasks', 14, y)
  y += 8
  
  const todoTasks = tasks.filter(t => t.status === 'todo')
  const inprogressTasks = tasks.filter(t => t.status === 'inprogress')
  const doneTasks = tasks.filter(t => t.status === 'done')
  
  const tableData = [
    ...todoTasks.map(t => [t.title, 'To Do', t.priority || '-', t.dueDate || '-']),
    ...inprogressTasks.map(t => [t.title, 'In Progress', t.priority || '-', t.dueDate || '-']),
    ...doneTasks.map(t => [t.title, 'Done', t.priority || '-', t.dueDate || '-']),
  ]
  
  autoTable(doc, {
    startY: y,
    head: [['Task', 'Status', 'Priority', 'Due Date']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [71, 85, 105] },
    styles: { fontSize: 9 },
  })
  
  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150)
    doc.text(
      `Page ${i} of ${pageCount} | Generated ${new Date().toLocaleDateString()}`,
      14,
      doc.internal.pageSize.height - 10
    )
  }
  
  // Save
  doc.save(`${project.name.toLowerCase().replace(/\s+/g, '-')}-report-${new Date().toISOString().split('T')[0]}.pdf`)
}
