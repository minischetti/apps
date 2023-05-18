import React, { useEffect } from 'react';
import data from './data/cards';

function NewItemForm({ addCard }) {
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
                            addCard({ name, definition, tags });
                            setName('');
                            setDescription('');
                            setTags('');
                        }}
                    >
                        Add Card
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
            <h1>{item.name}</h1>
            <div onClick={toggleDescription}>Show/Hide Definition</div>
            <div className='definition'>
                {showDescription && item.definition}
            </div>
            <div className='tags'>
                {item.tags.map((tag, index) => (
                    <div className="tag" key={index}>#{tag}</div>
                ))}
            </div>
        </div>
    )
}

export function App() {
    const [items, setItems] = React.useState(data);
    const [showForm, setShowForm] = React.useState(false);

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