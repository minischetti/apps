import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { add, remove, update } from './store/itemsSlice';
import { Item } from './components/Item';
import { NewItemForm } from './components/NewItemForm';
import { NewTagsForm } from './components/NewTagsForm';

export function App() {
    const items = useSelector((state: any) => state.items);
    const tags = useSelector((state: any) => state.tags);
    const dispatch = useDispatch();


    const addItem = (item) => {
        dispatch(add(item));
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
                        <NewTagsForm />
                    </div>
                </div>
            </div>
            <NewItemForm addItem={addItem} tags={tags} />
            <ul>
                {items.map((item, index) => (
                    <Item item={item} key={index} />
                ))}
            </ul>
        </div>
    );
}