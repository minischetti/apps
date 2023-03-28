import React, { useEffect } from 'react';
import data from './data/cards';



function NewCardForm({addCard}) {
    const [term, setTerm] = React.useState('');
    const [definition, setDefinition] = React.useState('');
    const [clozes, setClozes] = React.useState('');
    const [showForm, setShowForm] = React.useState(false);
    function addCard(card) {
        data.push(card);
    }

    return (
        <div className='new-card-form'>
            <div onClick={() => setShowForm(!showForm)}>Add New Card</div>
            {showForm && (
                <div>
                    <div>
                        <label>Term</label>
                        <input
                            value={term}
                            onChange={(e) => setTerm(e.target.value)}
                        />
                    </div>
                <div>
                    <label>Definition</label>
                    <input
                        value={definition}
                        onChange={(e) => setDefinition(e.target.value)}
                    />
                </div>
                <div>
                    <label>Clozes</label>
                    <input

                        value={clozes}
                        onChange={(e) => setClozes(e.target.value)}
                    />
                </div>
                <div>
                    <button

                        onClick={() => {
                            addCard({term, definition, clozes});
                            setTerm('');
                            setDefinition('');
                            setClozes('');
                            setShowForm(false);
                        }}
                    >
                        Add Card
                    </button>
                </div>
            </div>
            )}
        </div>
    )
}

function Card({card}) {
    const [showDefinition, setShowDefinition] = React.useState(false);

    const toggleDefinition = () => {
        setShowDefinition(!showDefinition);
    }

    useEffect(() => {
        console.log('Card mounted');
        return () => {
            console.log('Card unmounted');
        }
    }, []);

    return (
        <div className='card'>
            <h1>{card.term}</h1>
            <div onClick={toggleDefinition}>Show/Hide Definition</div>
            <div className='definition'>
                {showDefinition && card.definition}
            </div>
        </div>
    )
}

export function App() {
    const [cards, setCards] = React.useState(data);

    return (
        <div className='app'>
            <h1>Flashcards</h1>
            <NewCardForm />
            <h2>Terms</h2>
            <ul>
                {cards.map((card, index) => (
                    <Card card={card} key={index} />
                ))}
            </ul>
        </div>
    );
}