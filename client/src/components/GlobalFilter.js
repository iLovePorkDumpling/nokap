import React from 'react';
import SearchIcon from '@material-ui/icons/Search';
import Input from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'

const GlobalFilter = ({ filter, setFilter }) => {

    return (
        <span>
            <Input
                value={filter || ''}
                onChange={e => setFilter(e.target.value)}
                placeholder="Search player or ship"
                endAdornment={
                    <InputAdornment position="end">
                        <SearchIcon />
                    </InputAdornment>
                }
          />
        </span>
    )
}

export default GlobalFilter;