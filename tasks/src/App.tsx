import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { add, remove, update } from './store/itemsSlice';
import { Item } from './components/Item';
import { NewItemForm } from './components/NewItemForm';
import { NewTagsForm } from './components/NewTagsForm';
import { Items } from './components/Items';
import { Tags } from './components/Tags';
import { Filters } from './components/Filters';

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
            <div className='content'>
                <div className='sidebar'>
                    <Filters />
                    <Tags />
                </div>
                <div>
                    <NewItemForm addItem={addItem} tags={tags} />
                    <ul>
                        <Items>
                            {items.map((item, index) => (
                                <Item item={item} key={index} />
                            ))}
                        </Items>
                    </ul>
                </div>
            </div>
        </div>
    );
}