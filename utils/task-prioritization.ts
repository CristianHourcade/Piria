// Task prioritization utility
export interface PriorityScore {
  score: number
  label: string
  color: string
}

// Calculate priority score based on priority level and deadline
export function calculatePriorityScore(priority: string, dueDate: string): PriorityScore {
  const now = new Date()
  const deadline = new Date(dueDate)
  const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  // Base score from priority
  let baseScore = 0
  switch (priority) {
    case "Alta":
      baseScore = 100
      break
    case "Media":
      baseScore = 50
      break
    case "Baja":
      baseScore = 10
      break
    default:
      baseScore = 0
  }

  // Deadline factor - increases as deadline approaches
  let deadlineFactor = 0
  if (daysUntilDeadline < 0) {
    // Overdue tasks get highest priority
    deadlineFactor = 200
  } else if (daysUntilDeadline === 0) {
    // Due today
    deadlineFactor = 150
  } else if (daysUntilDeadline <= 1) {
    // Due tomorrow
    deadlineFactor = 100
  } else if (daysUntilDeadline <= 3) {
    // Due within 3 days
    deadlineFactor = 75
  } else if (daysUntilDeadline <= 7) {
    // Due within a week
    deadlineFactor = 50
  } else {
    // Due later
    deadlineFactor = 25
  }

  const totalScore = baseScore + deadlineFactor

  // Determine label and color based on score
  let label: string
  let color: string

  if (totalScore >= 200) {
    label = "Crítica"
    color = "bg-red-600 text-white"
  } else if (totalScore >= 150) {
    label = "Urgente"
    color = "bg-red-500 text-white"
  } else if (totalScore >= 100) {
    label = "Alta"
    color = "bg-orange-500 text-white"
  } else if (totalScore >= 75) {
    label = "Media-Alta"
    color = "bg-yellow-500 text-black"
  } else if (totalScore >= 50) {
    label = "Media"
    color = "bg-yellow-400 text-black"
  } else if (totalScore >= 25) {
    label = "Media-Baja"
    color = "bg-green-400 text-black"
  } else {
    label = "Baja"
    color = "bg-green-500 text-white"
  }

  return {
    score: totalScore,
    label,
    color,
  }
}

// Sort tasks by priority score
export function sortTasksByPriority(tasks: any[]): any[] {
  return [...tasks].sort((a, b) => {
    const scoreA = calculatePriorityScore(a.priority, a.dueDate).score
    const scoreB = calculatePriorityScore(b.priority, b.dueDate).score
    return scoreB - scoreA // Higher score first
  })
}
