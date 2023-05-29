import React from 'react';

export const NewPresetForm = ({ addPreset }) => {
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