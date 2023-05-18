import React, { useEffect } from 'react';
import resume from './data/resume.json';
import resumeMarkdown from './data/resume.md';

export function App() {
    const [darkMode, setDarkMode] = React.useState(false);
    // Use ref or just the body element?
    const appRef = React.useRef(null);

    const toggleDarkMode = () => {
        if (darkMode) {
            appRef.current.classList.remove('color-scheme__dark');
            appRef.current.classList.add('color-scheme__light');
        } else {
            appRef.current.classList.add('color-scheme__dark');
            appRef.current.classList.remove('color-scheme__light');
        }
        setDarkMode(!darkMode);
    };

    return (
        {resumeMarkdown}
    );
}