import React, { useState } from 'react';
import { CaretDown, CaretRight, FolderNotch, File, FilePlus, FolderNotchOpen, FolderNotchPlus } from "phosphor-react";
import Tabs from './Tabs';

const NewDirectoryForm = ({ parent_path, handleCreateNewDirectory, setShouldShowNewDirectoryForm }) => {
    const handleClick = (event) => {
        event.stopPropagation();
    };

    const handleCloseButtonClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setShouldShowNewDirectoryForm(false);
        setOpen(false);
    };

    const handleKeyEvents = (event) => {
        // if key is escape, close the form
        if (event.keyCode === 27) {
            setOpen(false);
            setShouldShowNewDirectoryForm(false);
        }
        // if key is enter, submit the form
        if (event.keyCode === 13) {
            const new_path = parent_path + "/" + event.target.value;
            handleCreateNewDirectory(new_path);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const new_path = parent_path + "/" + event.target[0].value;
        handleCreateNewDirectory(new_path);
        setShouldShowNewDirectoryForm(false);
    };

    return (
        <div>
            <form className='input-container' onSubmit={handleSubmit}>
                <input type="text" placeholder='Folder name' onClick={handleClick} onKeyUp={handleKeyEvents} />
                <button type="button" className='btn btn--negative' onClick={handleCloseButtonClick}>
                    <div className='btn-stack'>
                        <span className='btn-shortcut'>Esc</span>
                        <span className='btn-action'>Cancel</span>
                    </div>
                    {/* <X /> */}
                </button>
                <button type="submit" className='btn btn--positive'>
                    <div className='btn-stack'>
                        <span className='btn-shortcut'>Enter</span>
                        <span className='btn-action'>Create</span>
                    </div>
                    {/* <Check /> */}
                </button>
            </form>
        </div>
    );
};

export const Tree = {
    Item: ({ children, file, content = [], handleCreateNewDirectory, handleOpenFileListener = () => {} }) => {
        const [open, setOpen] = useState(false);

        const onClick = (event) => {
            event.stopPropagation();
            if (content.length) {
                setOpen(!open);
            }
            if (handleOpenFileListener) {
                handleOpenFileListener();
            }
        };
        
        const isClickable = content.length || file.isFile;

        const tabs = [
            {
                label: "New Folder",
                icon: <FolderNotchPlus size={18} className='btn--icon-icon' />,
                content: (
                    <NewDirectoryForm parent_path={file.path} />
                )
            },
            {
                label: "New File",
                icon: <FilePlus size={18} className='btn--icon-icon' />,
                content: (
                    <div>Coming soon!</div>
                )
            }
        ];

        return (
            <div className={`tree-item-container${open ? ' tree-item-container--open' : ""}`}>
                <div tabIndex={0} className={`tree-item-header${isClickable ? ' has-children' : ''}`} onClick={onClick}>
                    {file.isDirectory ?
                        open ? <FolderNotchOpen size={20} /> : <FolderNotch size={20} />
                        : <File size={20} />}
                    <div className='tree-item-name'>{file.name}</div>
                    {/* <div className='toolbar toolbar--inline'>
                    <div className="btn--icon" onClick={(event) => showNewDirectoryForm(event)}>
                        <FolderNotchPlus />
                    </div>
                </div> */}
                    {file.isDirectory && content.length ?
                        <div className='number'>{content.length}</div>
                        : null}
                    {file.isDirectory && content.length ? (open ?
                        <CaretDown className='tree-item-header-icon' size={20} />
                        : <CaretRight className='tree-item-header-icon' size={20} />
                    ) : ""}
                </div>
                {file.isDirectory && open ?
                    <div>
                        <div className="toolbar toolbar--shelf">
                            <div>Stats</div>
                            <div className='counter--icon'>
                                <div>{file.stats?.files ?? "?"}</div>
                                <File size={18} />
                                <div>Files</div>
                            </div>
                            <div className='counter--icon'>
                                <div>{file.stats?.directories ?? "?"}</div>
                                <FolderNotch size={18} className='btn--icon-icon' />
                                <div>Folders</div>
                            </div>
                        </div>
                        <div className='toolbar toolbar--shelf'>
                            <div>Actions</div>
                            <Tabs.Manager tabs={tabs} />
                            {/* <div className="toolbar-overflow-shade">
                                <CaretRight/>
                            </div> */}
                        </div>
                        <div className={`tree-item-children${open ? " open" : ""}`}>
                            {/* <div>Items</div> */}
                            {content?.map((child, index) => {
                                return (
                                    <Tree.Item key={index} file={child} content={child.children} />
                                );
                            })}
                        </div>
                    </div> : null}
            </div>
        );
    }
};
