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
        for (let i = -3; i < 4; i++) {
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
                if (!medication.time) {
                    return false;
                }
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
            <div className='date'>
                <h1>{currentDate.toLocaleDateString('en-US', { month: 'long' })}</h1>
                <h1>{currentDate.toLocaleDateString('en-US', { year: 'numeric' })}</h1>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th></th>
                        {createDateList(currentDate).map((date, index) => {
                            const isToday = (date: Date) => {
                                const today = new Date();
                                return date.getDate() === today.getDate();
                            };
                            return (
                                <th key={index} className={`day${isToday(date) ? ' current' : ''}`}>
                                    <div className="">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                                    <div className="">{date.getDate()}</div>
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    {hours.map(({ hour, medicationIds }, index) => {
                        const localizedHour = (hour: number) => {
                            const date = currentDate;
                            date.setHours(hour);
                            return date.toLocaleString('en-US', { hour: 'numeric', hour12: true });
                        };

                        const isCurrentHour = (hour: number) => {
                            const date = new Date();
                            return date.getHours() === hour;
                        };

                        const isPastHour = (hour: number) => {
                            const date = new Date();
                            return date.getHours() > hour;
                        };

                        const isFutureHour = (hour: number) => {
                            const date = new Date();
                            return date.getHours() < hour;
                        };

                        return (
                            // Get the day that corresponds to this column
                            <tr key={index} data-hour={hour} className={`hour${isCurrentHour(hour) ? ' current' : ''}${isPastHour(hour) ? ' past' : ''}${isFutureHour(hour) ? ' future' : ''}`}>
                                <td className="hour">{localizedHour(hour)}</td>
                                {createDateList(currentDate).map((date, index) => {
                                    const isToday = (date: Date) => {
                                        const today = new Date();
                                        return date.getDate() === today.getDate();
                                    };
                                    return (
                                        <td key={index} data-date={date.getDate()} className={`time-slot${isToday(date) ? ' current' : ''}`}>
                                            {medicationIds.map((medicationId) => {
                                                const medication = medications.find((medication) => medication.id === medicationId);
                                                if (!medication) {
                                                    return null;
                                                }
                                                return (
                                                    <div key={medicationId} className="medication">
                                                        <div className="name">{medication.name}</div>
                                                        <div className="dose">{medication.dosage}</div>
                                                        <div className="dose">{medication.time}</div>
                                                    </div>
                                                );
                                            })}
                                        </td>
                                    );
                                }
                                )}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
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
        </div >
    )
}