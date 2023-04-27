import * as React from 'react';

export function Timeline() {
    const [currentDate, setCurrentDate] = React.useState(new Date());

    const createDateList = (date: Date) => {
        // Get today's date and also include the previous 2 days and the next two days
        const dates: Date[] = [];
        for (let i = -2; i < 3; i++) {
            const newDate = new Date(date);
            newDate.setDate(newDate.getDate() + i);
            dates.push(newDate);
        }
        return dates;
    };

    return (
        <div className="timeline">
        {/* The month and year */}
        <div className='date'>
            <h1>{currentDate.toLocaleDateString('en-US', { month: 'long' })}</h1>
            <h1>{currentDate.toLocaleDateString('en-US', { year: 'numeric' })}</h1>
        </div>
        {/* The days of the week */}
        <div className='days'>
            {createDateList(currentDate).map((date, index) => (
                <div key={index} className={`day${date.toLocaleDateString('en-US', { weekday: 'short' }) === currentDate.toLocaleDateString('en-US', { weekday: 'short' }) ? ' current' : ''}`}>
                    <h2>{date.toLocaleDateString('en-US', { weekday: 'short' })}</h2>
                    <h3>{date.toLocaleDateString('en-US', { day: 'numeric' })}</h3>
                </div>
            ))}
        </div>
    </div>
    )
}