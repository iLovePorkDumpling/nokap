import React, { Fragment, useState, useEffect } from 'react';
import { useTable } from "react-table";
import PlayerSearchForm from "./PlayerSearchForm";
import ShipsData from "../configdata/shipsdata.json";
import NokapMembersData from "../configdata/nokapmembersdata.json";

//CSS
import MaUTable from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { Grid } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { green } from '@material-ui/core/colors';

const Roster = () => {

  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [searchablePlayers, setSearchablePlayers] = useState([]);
  const [addedPlayers, setAddedPlayers] = React.useState([]);

  useEffect(() => {
    prepareData();
  }, []);

  const prepareData = () => {
    setData (NokapMembersData);
    setAllData(NokapMembersData);
    const searchable = [];
    NokapMembersData.forEach((player) => {
      searchable.push(player.nickname);
    });
    setSearchablePlayers(searchable);
  }

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id', // accessor is the "key" in the data
        show: false,
      },
      {
        Header: 'Name',
        accessor: 'nickname',
      },
      {
        Header: 'Account Stats',
        accessor: 'statistics',
        show: false,
      },
      {
        Header: 'Ships Data',
        accessor: 'ships_data',
        show: false,
      },
      {
        Header: 'T6 Ships',
        accessor: 'ship_names',
      },
    ], []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setHiddenColumns,
  } = useTable({
    columns,
    data,
    initialState: {
      hiddenColumns: columns.map(column => {
          if (column.show === false) return column.accessor || column.id;
      }),
  },
  });

  const filterPlayers = () => {
    var filteredData = allData.filter(function(itm){
      return addedPlayers.indexOf(itm.nickname) > -1;
    });
    setData(filteredData);
  }

  const clearPlayerEventHandler= () => {
    setData(allData);
    setAddedPlayers([]);
  }

  const ListAddedPlayers = () => addedPlayers.map(player => (<Typography variant="body2" component="p">{player}<br/><br/></Typography>));
 
  // Render the UI for your table
  return (
    <Fragment>
      <Grid container spacing={3}>
        <Grid item xs={7}>
          <MaUTable {...getTableProps()}>
            <TableHead>
              {headerGroups.map(headerGroup => (
                <TableRow {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <TableCell {...column.getHeaderProps()}>
                      {column.render('Header')}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {rows.map((row, i) => {
                prepareRow(row)
                return (
                  <TableRow {...row.getRowProps()}>
                    {row.cells.map(cell => {
                      return (
                        <TableCell {...cell.getCellProps()}>
                          {cell.render('Cell')}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })}
            </TableBody>
          </MaUTable>
        </Grid>
        <Grid item xs={5}>
          <Box pl={5}>
            <Grid container direction="row" alignItems="left">
              <Grid item>
                <Autocomplete
                  value=""
                  onChange={(event, newValue) => {
                    if (newValue != null) {
                    addedPlayers.push(newValue);
                    filterPlayers();
                  }}}
                  options={searchablePlayers}
                  getOptionLabel={(option) => option}
                  style={{ width: 300 }}
                  renderInput={(params) => <TextField {...params} label="Players" variant="outlined" />}
                />
              </Grid>
              <Grid item> 
                <Box pl={2}>
                  <Button style={{ height: 54 }} variant="contained" color="primary" onClick={clearPlayerEventHandler}>Clear Players List</Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Box pt={3} pl={5}>
            <ListAddedPlayers />
          </Box>
        </Grid>
      </Grid>
    </Fragment>
  );
}
 
export default Roster;