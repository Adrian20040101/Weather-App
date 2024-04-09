import React, { useState } from "react";
import { AsyncPaginate } from 'react-select-async-paginate';
import { url, geoApiOptions } from "../../api";
import './search.css';

const Search = ({onSearchChange}) => {

    const [search, setSearch] = useState(null);

    const loadOptions = async (input) => {
        return fetch (
            `${url}/cities?minPopulation=0&namePrefix=${input}`,
            geoApiOptions
        )
        .then((response) => response.json())
        .then((response) => {
            return {
                options: response.data.map((city) => {
                    return {
                        value: `${city.latitude} ${city.longitude}`,
                        label: `${city.name}, ${city.countryCode}`
                    }
                })
            }
        })
        .catch((err) => console.error(err));
      };

    const handleOnChange = (data) => {
        setSearch(data);
        onSearchChange(data);
    }

    return (
        <div>
            <AsyncPaginate
                placeholder="Search for a city..."
                debounceTimeout={600}
                value={search}
                onChange={handleOnChange}
                loadOptions={loadOptions}
            />

            {!search && (
                <>
                    <div className="favorite-locations">
                        Favorites
                    </div>
                    <div className="recent-searches">
                        Recent Searches
                    </div>
                </>
            )}
        </div>
    );
}

export default Search;