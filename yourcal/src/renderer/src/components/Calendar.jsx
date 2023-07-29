import React from 'react'
import { useState } from 'react'
import dayjs from 'dayjs'

export default function Calendar({ events }) {
    const [calendar, setCalendar] = useState(dayjs())
    const [daysOfWeek, setDaysOfWeek] = useState([...Array(7).keys()].map((day) => dayjs().day(day).format('ddd')))
    const [daysOfMonth, setDaysOfMonth] = useState([...Array(calendar.daysInMonth()).keys()].map((day) => day + 1))

    const isThisMonth = (date) => {
        return dayjs(date).month() === dayjs().month()
    }

    const isSameDay = (date, day) => {
        return dayjs(date).date() === day
    }

    const isToday = (date, day) => {
        return isThisMonth(date) && isSameDay(date, day)
    }

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
                    return (
                        <div key={day} className="flex flex-1">
                            {day}
                            {events.map((event) => {
                                if (isToday(event.date, day)) {
                                    return (
                                        <div key={event.name} className="flex flex-1">{event.name}</div>
                                    )
                                }
                            })}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
