import React from 'react';
import { useDispatch } from 'react-redux';
import { add } from '../store/itemsSlice';

export function NewItemForm({ addItem, tags }) {
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const form = e.target;
        const name = form.name.value;
        const tags = form.tags.value;
        const date = form.date.value;
        const item = {
            name,
            tags,
            date,
        };

        dispatch(add(item));
    }



    return (
        <form onSubmit={handleSubmit}>
            <div>
                <div>
                    <label>Item</label>
                    <input
                        name='name'
                        id='name'
                        title='name'
                        type='text'
                    />
                </div>
                <div>
                    <label>Tags</label>
                    <select name="tags" id="tags" title="tags">
                        {tags.map((tag, index) => (
                            <option value={tag} key={index}>{tag}</option>
                        ))}
                    </select>
                </div>
                <label>Date</label>
                <select name="date" id="date" title="date">
                    <option value="unscheduled">Unscheduled</option>
                    <option value="today">Today</option>
                    <option value="tomorrow">Tomorrow</option>
                </select>
                <div>
                    <button
                        type='submit'
                        tabIndex={0}
                    >
                        Add Item
                    </button>
                </div>
            </div>
        </form>
    )
}