import dayjs from 'dayjs';
import { Plus, PlusMinus } from 'phosphor-react';
import React, { useState, useEffect } from 'react';

export const Calendar = ({ files }) => {
    const [date, setDate] = useState(dayjs());
    const [options, setOptions] = useState({
        dayNameStyle: [['short', 'dd'], ['medium', 'ddd'], ['long', 'dddd']],
    });
    const generateDays = (files) => {
        return Array.from({ length: date.daysInMonth() }, (_, i) => {
            const day = date.startOf('month').add(i, 'day');
            const filesWithSameBirthTime = files.filter(file => dayjs(file.stats.birthtime).isSame(day, 'day')).length;
            const filesWithSameModifiedTime = files.filter(file => {
                return dayjs(file.stats.mtime).isSame(day, 'day') && !dayjs(file.stats.birthtime).isSame(day, 'day');
            }).length;

            console.log(day);
            return (
                <div key={i} onClick={() => {
                    setDate(day);
                }}>
                    <div className={`calendar__day calendar__item${filesWithSameBirthTime ? " has-items--added" : ""}${filesWithSameModifiedTime ? " has-items--modified" : ""}`}>
                        <div className="calendar__day-number">{day.format('D')}</div>
                    </div>
                    {/* {filesWithSameModifiedTime ? <div className="calendar__day-items">
                        <div className="calendar__day-item">
                            <div>
                                    <div className="calendar__day-item-inline">
                                        <Plus />
                                        <div>{filesWithSameBirthTime}</div>
                                    </div>
                                    <div className="calendar__day-item-inline">
                                        <PlusMinus />
                                        <div>{filesWithSameModifiedTime}</div>
                                    </div>
                            </div>
                        </div>
                    </div> : null} */}
                </div>
            )
        });
    };
    const [days, setDays] = useState([]);


    const handlePrev = () => {
        setDate(date.subtract(1, 'month').startOf('month'));
    };

    const handleNext = () => {
        setDate(date.add(1, 'month').startOf('month'));
    };

    const handleToday = () => {
        setDate(dayjs());
    };

    const dateIsToday = () => {
        return date.isSame(dayjs(), 'day');
    };

    useEffect(() => {
        setDays(generateDays(files));
    }, [date, files]);

    const filesModifiedToday = files.filter(file => {
        return dayjs(file.stats.mtime).isSame(date, 'day') && !dayjs(file.stats.birthtime).isSame(date, 'day');
    }).length;
    const filesAddedToday = files.filter(file => dayjs(file.stats.birthtime).isSame(date, 'day')).length;

    return (
        <div className="calendar">
            <div className="calendar__main">
                <div className="calendar__header">
                    <button type="button" onClick={handlePrev}>Prev</button>
                    <button type="button" onClick={handleToday}>Today</button>
                    <button type="button" onClick={handleNext}>Next</button>
                </div>
                <div className="calendar__title">
                    <h3>{date.format('dddd')}</h3>
                    <h2>{date.format('MMMM D YYYY')}</h2>
                </div>
                <div className="calendar__body">
                    <div className="calendar__weekdays">
                        {/* {Array.from({ length: 7 }, (_, i) => (
                            <div key={i} className="calendar__weekday calendar__item">
                                {date.day(i).format('dd')}
                            </div>
                        ))} */}
                    </div>
                    <div className="calendar__days">
                        {days}
                    </div>
                </div>
            </div>
            <div className="calendar__side">
                <div className="calendar__side-items">
                    {/* Added section */}
                    {filesAddedToday ?
                        <div className="calendar__side-item">
                            <div>Added</div>
                            <div>{filesAddedToday}</div>
                        </div>
                    : null}
                    {filesModifiedToday ?
                        <div className="calendar__side-item">
                            <div>Modified</div>
                            <div>{filesModifiedToday}</div>
                        </div>
                    : null}
                </div>

            </div>
        </div>
    );
};