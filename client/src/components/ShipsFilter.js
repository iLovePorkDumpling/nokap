import React, { Fragment } from 'react';

//CSS
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const ShipsFilter = ({ parentCallback }) => {

    const [shipType, setShipType] = React.useState('Recommended');

    const handleChange = (event) => {
        setShipType(event.target.value);
        if (parentCallback) {
            parentCallback(event.target.value);
        }
    };

    return (
        <Fragment>
            <FormControl variant="outlined" >
                <InputLabel>Filter</InputLabel>
                <Select
                    value={shipType}
                    onChange={handleChange}
                    label="Recommended"
                >
                    <MenuItem value="Recommended">Recommended</MenuItem>
                    <MenuItem value="AirCarrier">CV</MenuItem>
                    <MenuItem value="Cruiser">Cruiser</MenuItem>
                    <MenuItem value="Destroyer">Destroyer</MenuItem>
                    <MenuItem value="Battleship">Battleship</MenuItem>
                    <MenuItem value="All">All Ships</MenuItem>
                </Select>
            </FormControl>
        </Fragment>
    );
}
 
export default ShipsFilter;