export const getRelativeTime = (date: Date) => {
  const diffInMs = new Date().getTime() - date.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInDays > 0) return `há ${diffInDays} dias`
  if (diffInHours > 0) return `há ${diffInHours} horas`
  return `há ${diffInMinutes} minutos`
}
