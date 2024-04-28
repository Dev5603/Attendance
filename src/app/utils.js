export const degreeToRadian = (degree) => {
    return degree * (Math.PI / 180)
}

export const calculateDistance = (lat1, lon1, lat2, lon2, radius) => {
    const dLat = degreeToRadian(lat2 - lat1)
    const dLon = degreeToRadian(lon2 - lon1)

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degreeToRadian(lat1)) * Math.cos(degreeToRadian(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = radius * c * 1000 // In meters(m)

    return Math.floor(distance)
}

export const parseTimeString = (timeString) => {
    const [time, period] = timeString.split(' ') // Split time and period (AM/PM)
    const [hour, minute] = time.split(':') // Split hour and minute

    let parsedHour = parseInt(hour)

    if (period === 'PM' && parsedHour !== 12) {
      parsedHour += 12 // Convert hour to 24-hour format if PM
    } else if (period === 'AM' && parsedHour === 12) {
      parsedHour = 0 // Convert 12 AM to 0 hour
    }

    const date = new Date();
    date.setHours(parsedHour, parseInt(minute), 0, 0) // Set hours, minutes, seconds, and milliseconds

    return date
}

export const getCurrentTime = () => {
    const currentTime = new Date()
    let hours = currentTime.getHours()
    const minutes = currentTime.getMinutes()
    const period = hours >= 12 ? 'PM' : 'AM'
  
    hours = hours % 12
    hours = hours ? hours : 12; // Handle midnight
  
    const formattedTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${period}`
    return formattedTime
}