
import React, { useState, useEffect, useRef } from 'react';
import { FolderNotch, Check, X, Hash, ArrowDown } from "phosphor-react";
import Panes, { Pane } from './src/templates/views/Panes';
import { Tree } from './src/templates/components/Tree';
import commonmark from 'commonmark';
import { Calendar } from './src/templates/components/Calendar';

export function Index() {
    const [filePath, setFilePath] = useState("");
    const [fileContent, setFileContent] = useState("");
    const [explorerTree, setExplorerTree] = useState([]);
    const [currentDirectory, setCurrentDirectory] = useState("");
    const [panes, setPanes] = useState([]);
    const [activePane, setActivePane] = useState(0);

    const addPane = (file) => {
        return window.api.explorer.item.open(file.path).then((result) => {
            const newPanes = [...panes];
            newPanes.push({
                name: file.name,
                path: file.path,
                content: <div>{result}</div>
            });
            console.log(newPanes);
            setPanes(newPanes);
            // setActivePane(newPanes.length - 1);
        });
    }

    closePane = (index) => {
        const newPanes = [...panes];
        newPanes.splice(index, 1);
        setPanes(newPanes);
        // setActivePane(newPanes.length - 1);
    }


    const getExplorerTree = () => {
        return window.api.explorer.tree.get().then((results) => {
            console.log(results);
            setExplorerTree(results)
        });
    }
    const getExplorerDirectory = () => {
        return window.api.explorer.directory.get().then((results) => {
            console.log(results);
            setCurrentDirectory(results)
        });
    }

    const handleCreateNewDirectory = (path) => {
        return window.api.explorer.directory.new(path).then((results) => {
            console.log(results);
        });
    }
    useEffect(() => {
        getExplorerTree();
        getExplorerDirectory();

        window.api.explorer.tree.onUpdateListener(getExplorerTree);
    }, []);
    return (
        <div id="app" className='container'>
            <div className='content'>
                <div className='sidebar section responsive--v responsive--h'>
                    {currentDirectory ? <div>{currentDirectory}</div> : null}
                    <div className='divider--h'></div>
                    <div className='tree'>
                        {explorerTree?.map((file, index) => {
                            if (file.isFile || (file.isDirectory && !file.children)) {
                                return (
                                    <Tree.Item key={index} file={file} index={index} handleOpenFileListener={() => addPane(file)} />
                                )
                            } else if (file.isDirectory) {
                                return (
                                    <div>
                                        <Tree.Item key={index} file={file} index={index} content={file.children} handleCreateNewDirectory={handleCreateNewDirectory} />
                                    </div>
                                )
                            }
                        })}
                    </div>
                </div>
                <Panes>
                    {panes.map((pane, index) => {
                        return (
                            <Pane key={index}>
                                <div className="pane-header">
                                    <div className="pane-name">{pane?.name}</div>
                                    <div className='pane-icon--minimize disabled'>
                                        <ArrowDown />
                                    </div>
                                    <div className='pane-icon--close' onClick={() => closePane(index)}>
                                        <X />
                                    </div>
                                </div>
                                <div className="divider--h"></div>
                                <div className="pane-content">
                                    <div>{pane?.content}</div>
                                </div>
                            </Pane>
                        )
                    })}
                </Panes>
                <Calendar files={explorerTree} />
            </div>
        </div>
    )
}