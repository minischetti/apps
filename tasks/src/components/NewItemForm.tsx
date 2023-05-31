import React from 'react';
import { useDispatch } from 'react-redux';
import { add } from '../store/itemsSlice';

enum Status {
    Pending = 'pending',
    Completed = 'completed',
    Canceled = 'canceled',
}

type Item = {
    name: string,
    tags: string,
    date: string,
    time: string,
    status: Status,
}

export function NewItemForm({ addItem, tags }) {
    const dispatch = useDispatch();
    const [date, setDate] = React.useState(new Date());
    const [showReminder, setShowReminder] = React.useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const form = e.target;
        const name = form.name.value;
        const tags = form.tags.value;
        const date = form.date.value;
        const time = form.time.value;
        
        const item = {
            name,
            tags,
            date,
            time,
            status: Status.Pending,
        };

        dispatch(add(item));
    }



    return (
        <form onSubmit={handleSubmit}>
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Tags</th>
                        <th>Reminder</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <input
                                name='name'
                                id='name'
                                title='name'
                                type='text'
                                required
                            />
                        </td>
                        <td>
                            <select name="tags" id="tags" title="tags">
                                {tags.map((tag, index) => (
                                    <option value={tag} key={index}>{tag}</option>
                                ))}
                            </select>
                        </td>
                        <td>
                            <input
                                name='date'
                                id='date'
                                title='date'
                                type='date'
                            />
                        </td>
                        <td>
                            <input

                                name='time'
                                id='time'
                                title='time'
                                type='time'
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
            <button type='submit'>Add Item</button>
        </form>
    )
}