import { ArrowDown, ArrowUp } from 'phosphor-react';
import * as React from 'react';
import { useSelector } from 'react-redux';

export function Timeline() {
    const [currentDate, setCurrentDate] = React.useState(new Date());
    const [hours, setHours] = React.useState<{ hour: Date, medications: any[] }[]>([]);
    const medications = useSelector((state) => state.medications);

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

    React.useEffect(() => {
        // Making the timeline
        // Get the hours of the day
        // Get the medication times
        // Combine the two arrays
        const hours = Array.from(Array(24).keys())
        // For each hour, check if there is a medication time
        // If there is, add the medication to the hour
        const hoursWithMedications = hours.map((hour) => {
            const medicationsForHour = medications.filter((medication) => {
                // const medicationTime = new Date();
                // console.log(medicationTime);
                // medicationTime.setHours(parseInt(medication.time.split(':')[0]));
                return parseInt(medication.time.split(':')[0]) === hour;
                // return medicationTime.getHours() === hour.getHours();
            });
            return {
                hour,
                medicationIds: medicationsForHour.map((medication) => medication.id),
            };
        });

        console.log(hoursWithMedications);

        setHours(hoursWithMedications);

        return () => {
        }
    }, [currentDate, medications]);

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
            <div className="toolbar">
                {/* Button to scroll up */}
                <button onClick={() => {
                    const hours = document.querySelector('.hours');
                    if (hours) {
                        hours.scrollBy({
                            behavior: 'smooth',
                            top: -hours.clientHeight / 6,
                        });
                    }
                }}><ArrowUp /></button>
                <button onClick={() => setCurrentDate(new Date())}>Scroll to the current hour</button>
                {/* Button to scroll bottom */}
                <button className="" onClick={() => {
                    const hours = document.querySelector('.hours');
                    if (hours) {
                        hours.scrollBy({
                            behavior: 'smooth',
                            top: hours.clientHeight / 6,
                        });
                    }
                }}><ArrowDown /></button>
            </div>
            <div className='hours'>
                {hours.map(({hour, medicationIds}, index) => {
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
                            <div className="medications">
                                {medicationIds.map((medicationId, index) => {
                                    const medication = medications.find((medication) => medication.id === medicationId);
                                    if (medication) {
                                        return (
                                            <div key={index} className={`medication${isPastHour(hour) ? ' past' : ''}${isFutureHour(hour) ? ' future' : ''}`}>
                                                <h3>{medication.name}</h3>
                                            </div>
                                        )
                                    }
                                })}
                            </div>
                            
                            {/* Display the medication for the hour */}
                            {/* {medications.map((medication, index) => {
                                const medicationHour = new Date(medication.time).getHours();
                                if (medicationHour === hour) {
                                    return (
                                        <div key={index} className={`medication${isPastHour(hour) ? ' past' : ''}${isFutureHour(hour) ? ' future' : ''}`}>
                                            <h3>{medication.name}</h3>
                                        </div>
                                    )
                                }
                            })} */}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}