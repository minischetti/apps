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
                            setShowForm(false);
                        }}
                    >
                        Add Card
                    </button>
                </div>
            </div>
        </div>
    )
}

function Card({ card }) {
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
        <div className='card'>
            <h1>{card.name}</h1>
            <div onClick={toggleDescription}>Show/Hide Definition</div>
            <div className='definition'>
                {showDescription && card.definition}
            </div>
            <div className='tags'>
                {card.tags.map((tag, index) => (
                    <div className="tag" key={index}>#{tag}</div>
                ))}
            </div>
        </div>
    )
}

export function App() {
    const [cards, setCards] = React.useState(data);
    const [showForm, setShowForm] = React.useState(false);

    const addCard = (card) => {
        setCards([...cards, card]);
    }

    return (
        <div className='app'>
            <h1>Flashcards</h1>
            <div onClick={() => setShowForm(!showForm)}>Add New Item</div>
            {showForm ? <NewItemForm addCard={addCard} /> : null}
            <h2>Terms</h2>
            <ul>
                {cards.map((card, index) => (
                    <Card card={card} key={index} />
                ))}
            </ul>
        </div>
    );
}