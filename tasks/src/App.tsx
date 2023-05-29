import React, { useEffect } from 'react';
import data from './data/cards';

function NewItemForm({ addItem, tags }) {

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

        addItem(item);
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

const NewPresetForm = ({ addPreset }) => {
    const [name, setName] = React.useState('');
    const [tags, setTags] = React.useState('');

    return (
        <div className='new-preset-form'>
            <div>
                <div>
                    <label>Name</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label>Tags</label>
                    <input

                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                    />
                </div>
                <div>
                    <button

                        onClick={() => {
                            addPreset({ name, tags });
                            setName('');
                            setTags('');
                        }}
                    >
                        Add Preset
                    </button>
                </div>
            </div>
        </div>
    )
}

function Item({ item }) {
    return (
        <div className='item'>
            <div className='item-name'>{item.name}</div>
            <div className='item-date'>{item.date}</div>
            <div className='item-tag'>
                {item.tag}
            </div>
        </div>
    )
}

export function App() {
    const [items, setItems] = React.useState([
    ]);
    const [tags, setTags] = React.useState([
        'music',
        'chores',
        'work',
        'learning',
    ]);
    // use nested array to allow for sub-tags
    const [presets, setPresets] = React.useState([
        { name: 'Guitar', tags: ['music'] },
        { name: 'Dishes', tags: ['chores'] },
        { name: 'Laundry', tags: ['chores'] },
    ])
    // const [search, setSearch] = React.useState('');
    const [showForm, setShowForm] = React.useState(false);

    // const filteredItems = items.filter((item) => {
    //     return item.name.toLowerCase().includes(search.toLowerCase());
    // });

    // const allTags = items.reduce((acc, item) => {
    //     item.tags.forEach((tag) => {
    //         if (!acc.includes(tag)) {
    //             acc.push(tag);
    //         }
    //     });
    //     return acc;
    // }, []);

    // const tagsWithCount = tags.map((tag) => {
    //     const count = items.reduce((acc, item) => {
    //         if (item.tags.includes(tag)) {
    //             acc++;
    //         }
    //         return acc;
    //     }, 0);
    //     return { tag, count };
    // });

    const addItem = (item) => {
        setItems([...items, item]);
    }

    return (
        <div className='app'>
            <div className='header'>
                <h1>Items</h1>
            </div>
            <div className='sidebar'>
                <div className='section section-tags'>
                        <h2>Tags</h2>

                    <div className='tags column'>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const form = e.target;
                            const tag = form.tag.value;
                            setTags([...tags, tag]);
                            form.tag.value = '';
                        }}>
                            <input type="text" name="tag" id="tag" required />
                            <button type="submit">Add Tag</button>
                        </form>
                        {tags.map((tag, index) => (
                            <div className="tag" key={index}>{tag}</div>
                        ))}
                    </div>
                </div>
            </div>
            <button onClick={() => setShowForm(!showForm)}>Add New Item</button>
            {showForm ? <NewItemForm addItem={addItem} tags={tags} /> : null}
            <ul>
                {items.map((item, index) => (
                    <Item item={item} key={index} />
                ))}
            </ul>
        </div>
    );
}