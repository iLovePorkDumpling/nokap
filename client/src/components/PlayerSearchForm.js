import React, { Fragment } from 'react';

//CSS
import FormControl from '@material-ui/core/FormControl';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

const PlayerSearchForm = (searchablePlayers) => {

    return (
        <Fragment>
            <Autocomplete
                options={searchablePlayers}
                getOptionLabel={(option) => searchablePlayers.nickname}
                style={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Search Player" variant="outlined" />}
            />
        </Fragment>
    );
}
 
export default PlayerSearchForm;