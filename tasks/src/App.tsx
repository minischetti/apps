import React, { useEffect } from 'react';
import data from './data/cards';

function NewItemForm({ addItem }) {
    const [name, setName] = React.useState('');
    const [definition, setDescription] = React.useState('');
    const [tags, setTags] = React.useState('');

    return (
        <div className='new-card-form'>
            <div>
                <div>
                    <label>Item</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label>Description</label>
                    <input
                        value={definition}
                        onChange={(e) => setDescription(e.target.value)}
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
                            addItem({ name, definition, tags });
                            setName('');
                            setDescription('');
                            setTags('');
                        }}
                    >
                        Add Item
                    </button>
                </div>
            </div>
        </div>
    )
}

function Item({ item }) {
    const [showDescription, setShowDescription] = React.useState(false);

    const toggleDescription = () => {
        setShowDescription(!showDescription);
    }

    useEffect(() => {
        console.log('Card mounted');
        return () => {
            console.log('Card unmounted');
        }
    }, []);

    return (
        <div className='item'>
            <div className='item-name'>{item.name}</div>
            <div className='tags'>
                {item.tags.map((tag, index) => (
                    <div className="tag" key={index}>#{tag}</div>
                ))}
            </div>
        </div>
    )
}

export function App() {
    const [items, setItems] = React.useState([]);
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

    const tags = items.reduce((acc, item) => {
        item.tags.forEach((tag) => {
            if (!acc.includes(tag)) {
                acc.push(tag);
            }
        });
        return acc;
    }, []);

    const tagsWithCount = tags.map((tag) => {
        const count = items.reduce((acc, item) => {
            if (item.tags.includes(tag)) {
                acc++;
            }
            return acc;
        }, 0);
        return { tag, count };
    });

    const addItem = (item) => {
        setItems([...items, item]);
    }

    return (
        <div className='app'>
            <div className='header'>
                <h1>Items</h1>
            </div>
            <div className='sidebar'>
                <h2>Presets</h2>
                <div className='presets'>
                    {presets.map((preset, index) => (
                        <div className="preset" key={index} onClick={() => addItem(preset)}>{preset.name}</div>
                    ))}
                </div>
                <div className='date'>
                    <h2>Date</h2>
                    <select name="date" id="date" title="date">
                        <option value="unscheduled">Unscheduled</option>
                        <option value="today">Today</option>
                        <option value="tomorrow">Tomorrow</option>
                    </select>
                </div>
                <h2>Tags</h2>
                <div className='tags'>
                    {tags.map((tag, index) => (
                        <div className="tag" key={index}>#{tag}</div>
                    ))}
                </div>
            </div>
            {/* <div className='tags'>
                {tagsWithCount.map((tag, index) => (
                    <div className="tag" key={index}>#{tag.tag} ({tag.count})</div>
                ))}
            </div> */}
            <button onClick={() => setShowForm(!showForm)}>Add New Item</button>
            {showForm ? <NewItemForm addItem={addItem} /> : null}
            <ul>
                {items.map((item, index) => (
                    <Item item={item} key={index} />
                ))}
            </ul>
        </div>
    );
}