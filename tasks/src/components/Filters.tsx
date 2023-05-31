import React from 'react';

enum Filter {
    All = "all",
    Today = 'today',
    Tomorrow = 'tomorrow',
    Upcoming = 'upcoming',
    Completed = 'completed',
    Canceled = 'canceled',
}

export function Filters() {
    // const [filter, setFilter] = React.useState(Filter.All);
    return (
        <div className='filters'>
            <h2>Filters</h2>
            <div className='filter'>
                <label htmlFor="filter">Filter</label>
                <select name="filter" id="filter">
                    <option value={Filter.All}>All</option>
                    <option value={Filter.Today}>Today</option>
                    <option value={Filter.Tomorrow}>Tomorrow</option>
                    <option value={Filter.Upcoming}>Upcoming</option>
                    <option value={Filter.Completed}>Completed</option>
                    <option value={Filter.Canceled}>Canceled</option>
                </select>
            </div>
        </div>
    );
}