import React, {useState} from "react";
import styled from "styled-components";
import {getDaysInMonth, startOfMonth} from "date-fns";

export const getDaysOfMonth = (daysInMonth) => {
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }
    return days;
}

export const getStartOfMonth = (year, month) => {
    return startOfMonth(new Date(year, month)).getDay() + 1;
}


export const daysOfWeek = Array.from({length: 7}, (item, i) => {
    return new Date(0, 0, i).toLocaleString('en-US', {weekday: "short"})
});

export const months = Array.from({length: 12}, (item, i) => {
    return new Date(0, i).toLocaleString('en-US', {month: 'long'})
});

export const getNextMonth = (selectedMonthIndex) => {
    if (selectedMonthIndex === 11) {
        return 0;
    } else {
        return selectedMonthIndex + 1;
    }
}

export const getPreviousMonth = (selectedMonthIndex) => {
    if (selectedMonthIndex === 0) {
        return 11;
    } else {
        return selectedMonthIndex - 1;
    }
}

const StyledCalendar = styled.div`
    padding: 1em;
    user-select: none;
    font-size: 1em;
`

const Grid = styled.div`
    display: grid;
    grid-auto-flow: ${props => props.gridAutoFlow};
    grid-gap: ${props => props.gridGap}em;
    grid-template-columns: ${props => props.gridTemplateColumns};
    grid-template-rows: ${props => props.gridTemplateRows};
    justify-content: ${props => props.justifyContent};
    justify-items: ${props => props.justifyItems};
    align-items: ${props => props.alignItems};
`

const SevenGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: center;
    gap: 2px;
`

const CalendarItem = styled.div`
    display: flex;
    aspect-ratio: 1 / 1;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    font-size: .5em;
    overflow: hidden;
`

const Icon = styled.div`
    // font-size: ${props => props.fontSize}em;
    ${props => props.onClick ? `
        cursor: pointer;
    ` : ""}
`

export const H1 = styled.h1`
    font-size: 1em;
    color: black;
    margin: .5em 0;
    padding: 0;
`

export const H2 = styled.h2`
    // font-size: 1.5em;
    color: black;
    margin: .25em 0;
`

export const H3 = styled.h3`
    font-size: .75em;
    color: black;
    margin: .1em 0;
`

const CalendarDayContainer = styled(SevenGrid)`
    background-color: #ddd;
    border: 2px solid #ddd;
`

const HeaderCalendarItem = styled(CalendarItem)`
    font-weight: bold;
`
const DateCalendarItem = styled(CalendarItem)`
    // If the given calendar item is the first day of the month, set its column appropriately
    ${props => props.isFirstDayOfMonth ? `
        grid-column: ${props.firstDayOfMonth};
    ` : ""}
    ${props => props.selected ? `
        background-color: blue;
        color: white;
        cursor: not-allowed;
        font-weight: bold;
        & div {
            transform: scale(1.25);
        }
    ` : `
        &:hover {
            cursor: pointer;
            color: blue;
            & div {
                transform: scale(1.25);
        }
    `}
`

export const CalendarFeature = ({onClick}) => {
    const currentMonthIndex = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedMonthIndex, setSelectedMonthIndex] = useState(currentMonthIndex);
    const [selectedDate, setSelectedDate] = useState(startOfMonth(currentMonthIndex));

    const actions = {
        MONTH_DECREMENT: "MONTH_DECREMENT",
        MONTH_INCREMENT: "MONTH_INCREMENT",
        SET_SELECTED_DATE: "SET_SELECTED_DATE",
        YEAR_DECREMENT: "YEAR_DECREMENT",
        YEAR_INCREMENT: "YEAR_INCREMENT",
    }

    const handler = {
        MONTH_DECREMENT: () => {
            if (selectedMonthIndex === 0) {
                setSelectedMonthIndex(11);
                handler[actions.YEAR_DECREMENT]()
            } else {
                return setSelectedMonthIndex(selectedMonthIndex - 1);
            }
        },
        MONTH_INCREMENT: () => {
            if (selectedMonthIndex === 11) {
                setSelectedMonthIndex(0);
                handler[actions.YEAR_INCREMENT]()
            } else {
                return setSelectedMonthIndex(selectedMonthIndex + 1);
            }
        },
        YEAR_DECREMENT: () => {
            setSelectedYear(selectedYear - 1)
        },
        YEAR_INCREMENT: () => {
            setSelectedYear(selectedYear + 1)
        },
        SET_SELECTED_DATE: (date) => {
            setSelectedDate(date)
            onClick(date.getTime())
        }
    }
    const dayIndices = getDaysOfMonth(getDaysInMonth(new Date(currentYear, selectedMonthIndex)));


    return (
        <StyledCalendar>
            <Grid alignItems={"center"} gridTemplateColumns={"auto 1fr auto"}>
                <Icon onClick={handler[actions.MONTH_DECREMENT]}>
                    <ion-icon name="chevron-back-outline"></ion-icon>
                </Icon>
                <Grid justifyItems={"center"}>
                    <H3>{selectedYear}</H3>
                    <H1>{months[selectedMonthIndex]}</H1>
                </Grid>
                <Icon fontSize={2} onClick={handler[actions.MONTH_INCREMENT]}>
                    <ion-icon name="chevron-forward-outline"></ion-icon>
                </Icon>
            </Grid>
            <SevenGrid>
                {daysOfWeek.map((dayOfWeek, index) => (
                    <HeaderCalendarItem key={index}>{dayOfWeek}</HeaderCalendarItem>
                ))}
            </SevenGrid>
            <CalendarDayContainer>
                {dayIndices.map((dayIndex, index) => {
                    const date = new Date(selectedYear, selectedMonthIndex, dayIndex);
                    return (
                        <DateCalendarItem key={index}
                                          onClick={() => handler[actions.SET_SELECTED_DATE](date)}
                                          isFirstDayOfMonth={dayIndex === 1}
                                          selected={date.getTime() === selectedDate.getTime()}
                                          firstDayOfMonth={getStartOfMonth(selectedYear, selectedMonthIndex)}>
                            <div>{dayIndex}</div>
                        </DateCalendarItem>
                    )
                })}
            </CalendarDayContainer>
        </StyledCalendar>
    )
}