import React, { Fragment, useState } from 'react';

//CSS
import Typography from '@material-ui/core/Typography';

const TopDogs = (data) => {
  console.log(data);

  return (
    <Fragment>
        <Typography variant="h7" component="h7">
            Top Dogs
        </Typography>
        
    </Fragment>
  );
}
 
export default TopDogs;