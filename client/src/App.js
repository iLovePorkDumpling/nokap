import React, { Fragment } from "react";

//CSS
import CssBaseline from '@material-ui/core/CssBaseline'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import DirectionsBoatIcon from '@material-ui/icons/DirectionsBoat';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabPanel from './components/TabPanel';

//Components
import MissionStatement from "./components/MissionStatement";
import Rules from "./components/Rules";
import Roster from "./components/Roster";
import T6Ships from "./components/T6Ships";

export default function App() {
  const [value, setValue] = React.useState(2);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Fragment>
      <CssBaseline />
      <AppBar position="static" width="100%">
        <Toolbar>
          <DirectionsBoatIcon style={{ fontSize: 40 }} />
          <Typography variant="h3">
            &nbsp;&nbsp;NOKAP 
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper square>
        <Tabs
          value={value}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
        >
          <Tab label="Mission Statement" />
          <Tab label="Rules" />
          <Tab label="Roster" />
          <Tab label="T6 Ships" />
        </Tabs>
        <TabPanel value={value} index={0}>
          <MissionStatement />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Rules />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Roster />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <T6Ships />
        </TabPanel>
      </Paper>
    </Fragment>
  );
}