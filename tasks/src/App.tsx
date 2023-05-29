import React, { useEffect } from 'react';
import data from './data/cards';
import { Item } from './components/Item';
import { NewItemForm } from './components/NewItemForm';

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