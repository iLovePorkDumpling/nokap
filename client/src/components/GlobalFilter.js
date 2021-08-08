import React from 'react';
import SearchIcon from '@material-ui/icons/Search';
import OutlinedInput from '@material-ui/core/OutlinedInput'
import Box from '@material-ui/core/Box'
import InputAdornment from '@material-ui/core/InputAdornment'

const GlobalFilter = ({ filter, setFilter }) => {

    return (
        <span>
            <Box>
                <OutlinedInput
                    fullWidth="true"
                    value={filter || ''}
                    onChange={e => setFilter(e.target.value)}
                    placeholder="Search player"
                    startAdornment={
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    }
                />
          </Box>
        </span>
    )
}

export default GlobalFilter;