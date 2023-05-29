import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { add, remove, update } from '../store/itemsSlice';

export function NewTagsForm() {
    const tags = useSelector((state: any) => state.tags);
    const dispatch = useDispatch();
    // const [tags, setTags] = React.useState([
    //     'music',
    //     'chores',
    //     'work',
    //     'learning',
    // ]);

    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const form = e.target;
        const tag = form.tag.value;
        // setTags([...tags, tag]);
        dispatch(add(tag));
        form.tag.value = '';
    }

    return (
        <div className='tags column'>
            <form onSubmit={handleSubmit}>
                <input type="text" name="tag" id="tag" required />
                <button type="submit">Add Tag</button>
            </form>
            {tags.map((tag, index) => (
                <div className="tag" key={index}>{tag}</div>
            ))}
        </div>
    );
}