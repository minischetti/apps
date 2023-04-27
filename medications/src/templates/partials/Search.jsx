import React, { useEffect } from "react";

export function Search() {
    useEffect(() => {
        console.log('Search mounted');
        return () => {
            console.log('Search unmounted');
        };
    }
    , []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.target;
        const search = form.search.value;
        console.log(search);

        if (!search) {
            alert('Please enter a search term.');
            return;
        }

        // const response = await fetch(`https://api.fda.gov/drug/label.json?search=${search}`)
        const data = await response.json();
        console.log(data);
    };


    return (
        <form onSubmit={handleSubmit} className="search">
            <input type='text' name="search" placeholder='Search' />
            <button type='submit'>Search</button>
        </form>
    );
}