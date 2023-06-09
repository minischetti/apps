import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { add, remove, update } from '../store/tagsSlice';

export function NewTagsForm() {
    const tags = useSelector((state: any) => state.tags);
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const form = e.target;
        const tag = form.tag.value;
        dispatch(add(tag));
        form.tag.value = '';
    }

    const handleRemove = (e, tag) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('tag', tag);
        dispatch(remove(tag));
    }

    return (
        <div className='tags column'>
            <form onSubmit={handleSubmit}>
                <input type="text" name="tag" id="tag" required />
                <button type="submit">Add Tag</button>
            </form>
            {tags.map((tag, index) => (
                <div className="tag"
                    key={index}>
                    <span>{tag}</span>
                    <button onClick={(e) => handleRemove(e, tag)}>X</button>
                </div>
            ))}
        </div>
    );
}