import React from 'react'
import { useState } from 'react'
import dayjs from 'dayjs'

export default function Calendar({ events }) {
    const [calendar, setCalendar] = useState(dayjs())
    const [daysOfWeek, setDaysOfWeek] = useState([0, 1, 2, 3, 4, 5, 6].map((day) => calendar.day(day).format('ddd')))
    const [daysOfMonth, setDaysOfMonth] = useState([...Array(calendar.daysInMonth()).keys()].map((day) => day + 1))

    return (
        <div className="h-screen w-screen">
            <h1>Calendar</h1>
            {/* Days of week */}
            <div className="flex justify-between">
                {daysOfWeek.map((day) => {
                    return (
                        <div key={day} className="flex flex-1 justify-center">{day}</div>
                    )
                })}
            </div>
            {/* Days of month */}
            <div className="grid justify-between grid-cols-7 gap-1 h-screen">
                {daysOfMonth.map((day) => {
                    // TODO: Add events to calendar
                    // For every day, create an element
                    // If the day is a multiple of 7, create a new row
                    // If the day is the current day, highlight it
                    // If the day has an event, add a dot to the day
                    return (
                        <div key={day} className="flex flex-1">{day}</div>
                    )
                })}
            </div>
        </div>
    )
}
