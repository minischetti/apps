// import JSONWorker from 'url:monaco-editor/esm/vs/language/json/json.worker.js';
// import CSSWorker from 'url:monaco-editor/esm/vs/language/css/css.worker.js';
// import HTMLWorker from 'url:monaco-editor/esm/vs/language/html/html.worker.js';
// import TSWorker from 'url:monaco-editor/esm/vs/language/typescript/ts.worker.js';
// import MarkdownWorker from 'monaco-editor/esm/vs/basic-languages/markdown/markdown.js';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker.js';
import * as monaco from 'monaco-editor';

export default class Editor {
    editor
    constructor() {
        this.init();
    }
    init() {
        self.MonacoEnvironment = {
            getWorkerUrl: function (moduleId, label) {
                // if (label === 'markdown') {
                //     return MarkdownWorker;
                // }
                return EditorWorker;
            }
        }
    }
    create(fileContent, container) {
        if (!self.MonacoEnvironment) {
            this.init();
        }

        if (this.editor) {
            this.update(fileContent);
        } else {
            this.editor = monaco.editor.create(container, {
                value: fileContent,
                language: "markdown",
                automaticLayout: true,
            });
        }

        return this.editor;
    }
    update(fileContent) {
        if (this.editor) {
            this.editor.setValue(fileContent);
        } else {
            throw new Error("Editor not initialized");
        }
    }
}