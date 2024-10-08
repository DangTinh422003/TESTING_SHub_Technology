export const formatTime = (date: Date): string => {
  let hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'

  hours = hours % 12
  hours = hours || 12
  const formattedHours = hours.toString().padStart(2, '0')

  return `${formattedHours}:${minutes}:${seconds} ${ampm}`
}
