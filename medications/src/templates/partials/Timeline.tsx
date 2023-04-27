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

    // Scroll to the current hour of the day
    React.useEffect(() => {
        const currentHour = document.querySelector('.hour.current');
        if (currentHour) {
            currentHour.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center'
            });
        }
    }, [currentDate]);

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
            <div className='hours'>
                {/* Button to scroll left by 3 hours */}
                <button className="float float--left" onClick={() => {
                    const hours = document.querySelector('.hours');
                    if (hours) {
                        hours.scrollBy({
                            behavior: 'smooth',
                            left: -hours.clientWidth / 3,
                            top: 0
                        });
                    }
                }}>&lt;</button>
                {Array.from(Array(24).keys()).map((hour, index) => {
                    const localizedHour = (hour: number) => {
                        const date = currentDate;
                        date.setHours(hour);
                        return date.toLocaleString('en-US', { hour: 'numeric', hour12: true });
                    }

                    const isCurrentHour = (hour: number) => {
                        const date = new Date();
                        return date.getHours() === hour;
                    }

                    const isPastHour = (hour: number) => {
                        const date = new Date();
                        return date.getHours() > hour;
                    }

                    const isFutureHour = (hour: number) => {
                        const date = new Date();
                        return date.getHours() < hour;
                    }

                    return (
                        <div key={index} className={`hour${isCurrentHour(hour) ? ' current' : ''}`}>
                            {/* Get the locale string for the hour in 12 hour format using today's date */}
                            <h2>{localizedHour(hour)}</h2>
                        </div>
                    )
                })}
                {/* Button to scroll right by 3 hours */}
                <button className="float float--right" onClick={() => {
                    const hours = document.querySelector('.hours');
                    if (hours) {
                        hours.scrollBy({
                            behavior: 'smooth',
                            left: hours.clientWidth / 3,
                            top: 0
                        });
                    }
                }}>&gt;</button>
            </div>
            <button onClick={() => setCurrentDate(new Date())}>Scroll to the current hour</button>
        </div>
    )
}