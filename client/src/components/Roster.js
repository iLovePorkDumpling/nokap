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
import Paper from '@material-ui/core/Paper';
import Autocomplete from '@material-ui/lab/Autocomplete';

const Roster = () => {

  const [data, setData] = useState([]);
  const [searchablePlayers, setSearchablePlayers] = useState([]);
  const [addedPlayers, setAddedPlayer] = React.useState([]);
  const [seachedPlayer, setSeachedPlayer] = React.useState('');

  useEffect(() => {
    prepareData();
  }, []);

  const prepareData = () => {
    setData (NokapMembersData);
    const searchable = [];
    NokapMembersData.forEach((player) => {
      const newItem = {
        playerId: player.id,
        nickname: player.nickname
      }
      searchable.push(newItem);
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

  const addPlayer = (playerName) => {
    console.log(playerName);
  }
 
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
        {/* <Grid item xs={2}>
        <Autocomplete
          value={seachedPlayer}
          onChange={(event, newValue) => {
            setSeachedPlayer(newValue);
            addedPlayers.push(newValue);
            console.log(newValue);
          }}
          options={searchablePlayers}
          getOptionLabel={(option) => option.nickname}
          style={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Players" variant="outlined" />}
        />
        <Paper>
          {addedPlayers?.map((player) => (
            <li key={player?.id}>{player?.nickname}
            </li>
          ))}
        </Paper>
        </Grid> */}
      </Grid>
    </Fragment>
  );
}
 
export default Roster;