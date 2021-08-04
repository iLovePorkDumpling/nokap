import React, { Fragment, useState, useEffect } from 'react';
import { useTable } from "react-table";

//Data
import NokapMembersData from "../configdata/nokapmembersdata.json";
import ShipsData from "../configdata/shipsdata.json";
import RecommendedT6Ships from '../configdata/recommendedt6ships.json';
import ExpectedShipData from '../configdata/shipsexpecteddata.json';

//CSS
import MaUTable from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { Divider, Grid } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';
import "./Roster.css";

const Roster = () => {

  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [searchablePlayers, setSearchablePlayers] = useState([]);
  const [addedPlayers, setAddedPlayers] = React.useState([]);
  const [shipsData, setShipsData] = useState([]);

  useEffect(() => {
    prepareData();
  }, []);

  const prepareData = async () => {
    await setShipsData(ShipsData);
    setAllData(NokapMembersData);
    setData(NokapMembersData);
    const searchable = [];
    NokapMembersData.forEach((player) => {
      searchable.push(player.nickname);
    });
    setSearchablePlayers(searchable);
    getAccountWrDmgFrag();
  }

  const roundToTwoDecimal = (num) => {
    return Math.round(num * 100) / 100;
  }

  const getAccountWrDmgFrag = () => {
    const newData = [];
    var battles = 0;
    var wr = 0;
    var avgDmg = 0;
    var avgFrags = 0;
    NokapMembersData.forEach((player) => {
      if (player.statistics != undefined) {
        const stats = JSON.parse(player.statistics);
        battles = stats.pvp.battles;
        if  (battles != 0) {
          wr = roundToTwoDecimal((stats.pvp.wins / battles) * 100);
          avgDmg = (stats.pvp.damage_dealt/battles).toFixed(0);
          avgFrags = roundToTwoDecimal(stats.pvp.frags/battles);
        } else {
          wr = 0;
          avgDmg = 0;
          avgFrags = 0;
        }
      }

      const newitem = {
        id: player.id,
        nickname: player.nickname,
        statistics: player.statistics,
        battles: battles,
        wr: wr,
        dmg: avgDmg,
        avgFrags: avgFrags,
        ships_data: player.ships_data,
        ship_names: player.ship_names
      };

      console.log(newitem);
      newData.push(newitem);

    });

    setData (newData);
    setAllData(newData);

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
        Header: 'Stats',
        accessor: 'statistics',
        show: false,
      },
      {
        Header: 'Battles',
        accessor: 'battles',
      },
      {
        Header: 'WR',
        accessor: 'wr',
      },
      {
        Header: 'Damage',
        accessor: 'dmg',
      },
      {
        Header: 'Avg. Frags',
        accessor: 'avgFrags',
      },
      {
        Header: 'Ships Data',
        accessor: 'ships_data',
        show: false,
      },
      {
        Header: 'T6 Ships (Color based on PR)',
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
 
  const renderCell = (cell) => {
    if (cell.column.id === "ship_names") {
      const shipsList = [];
      if (cell.row.values.ships_data != undefined && cell.row.values.ships_data != null) {
        const playerShipsData = JSON.parse(cell.row.values.ships_data);
        if (playerShipsData != undefined && playerShipsData != null) {
          for (let i = 0; i < playerShipsData.length; i++) {
            const shipData = playerShipsData[i];
            if (shipData != undefined && shipsData[shipData.ship_id] && shipsData[shipData.ship_id].tier === 6) {
              const shipName = shipsData[shipData.ship_id].name;
              const pr = getPR(shipData.ship_id, shipData.pvp.battles, shipData.pvp.wins, shipData.pvp.frags, shipData.pvp.damage_dealt);
              var colorGroup = getPrGroupColor(pr);
              var style = "";
              var topGroup = 0;

              if (RecommendedT6Ships.indexOf(shipName) > -1) {
                style = { fontWeight: 'bold', fontSize: 16 };
                topGroup = 1;
              } else {
                style = { fontWeight: 'lighter', fontSize: 14 };
                topGroup = 0;
              }

              if (shipData.pvp.battles < 5) {
                colorGroup = "greyPrColor";
                style = { fontWeight: 'lighter', fontSize: 14 };
                topGroup = 0;
              }

              const newItem = { 
                                shipName: shipName,
                                colorGroup: colorGroup,
                                pr: pr,
                                style: style,
                                topGroup: topGroup
                              };
              shipsList.push(newItem);
            }
          };
        }
      }

      //Recommended Ships with 5 or more battles
      const recommendedColoredShips =  shipsList.filter(function(ship) { return ship.topGroup == 1 && ship.colorGroup !== "greyPrColor";});  
      
      //Non-Recommended Ships wiht less than 5 Battles
      const nonRecommendedColoredShips =  shipsList.filter(function(ship) { return ship.topGroup == 0 && ship.colorGroup !== "greyPrColor"; });

      //Ships with less than 5 battles
      const greyShips =  shipsList.filter(function(ship) { return ship.colorGroup === "greyPrColor"; });
      
      recommendedColoredShips.sort(function(a, b) { return b.pr - a.pr; })
      nonRecommendedColoredShips.sort(function(a, b) { return b.pr - a.pr; })
      greyShips.sort(function(a, b) { return b.pr - a.pr; })

      const ShipsList = ({shipsList}) => (
        <>
          {shipsList.map(ship => (
            <span class={ship.colorGroup} key={ship.shipName} style={ship.style}>{ship.shipName}&ensp;&ensp;&ensp;</span>
          ))}
        </>
      ); 

      return (
        <div>
          <ShipsList shipsList={recommendedColoredShips} /><br/>
          <ShipsList shipsList={nonRecommendedColoredShips} /><br/>
          <ShipsList shipsList={greyShips} /><br/>
        </div>
      );
    } else if (cell.column.id === "wr") {
      const color = getWrGroupColor(cell.row.values.wr);
      const style = { fontWeight: 'bold'};
      return (<span class={color} style={style}>{cell.row.values.wr}</span>);
    } else if (cell.column.id === "battles") {
      const color = getBattlesGroupColor(cell.row.values.battles);
      const style = { fontWeight: 'bold'};
      return (<span class={color} style={style}>{cell.row.values.battles}</span>);
    } else if (cell.column.id === "dmg") {
      const color = getDmgGroupColor(cell.row.values.dmg);
      const style = { fontWeight: 'bold'};
      return (<span class={color} style={style}>{cell.row.values.dmg}</span>);
    } else if (cell.column.id === "avgFrags") {
      const color = getAvgFragsGroupColor(cell.row.values.avgFrags);
      const style = { fontWeight: 'bold'};
      return (<span class={color} style={style}>{cell.row.values.avgFrags}</span>);
    } else {
      return cell.render('Cell');
    }
  }

  const getAvgFragsGroupColor = (battles) => {
    var color = "";     
    if (battles < 0.55) { color = "badColor"; } else
    if (battles < 0.7) { color = "belowAverageColor"; } else
    if (battles < 0.9) { color = "averageColor"; } else
    if (battles < 1.2) { color = "goodColor"; } else
    if (battles < 1.5) { color = "greatColor"; } else {
      color = "superUnicumColor";
    }
    return color;
  }

  const getDmgGroupColor = (battles) => {
    var color = "";     
    if (battles < 15000) { color = "badColor"; } else
    if (battles < 25000) { color = "belowAverageColor"; } else
    if (battles < 35000) { color = "averageColor"; } else
    if (battles < 39000) { color = "goodColor"; } else
    if (battles < 48000) { color = "greatColor"; } else {
      color = "superUnicumColor";
    }
    return color;
  }

  const getBattlesGroupColor = (battles) => {
    //44k is purple
    var color = "";     
    if (battles < 3000) { color = "badColor"; } else
    if (battles < 5000) { color = "belowAverageColor"; } else
    if (battles < 9000) { color = "averageColor"; } else
    if (battles < 14000) { color = "goodColor"; } else
    if (battles < 20000) { color = "greatColor"; } else {
      color = "superUnicumColor";
    }
    return color;
  }

  const getWrGroupColor = (wr) => {
    var color = "";     
    if (wr < 47) { color = "badColor"; } else
    if (wr < 50) { color = "belowAverageColor"; } else
    if (wr < 52) { color = "averageColor"; } else
    if (wr < 54) { color = "goodColor"; } else
    if (wr < 56) { color = "veryGoodColor"; } else
    if (wr < 60) { color = "greatColor"; } else
    if (wr < 65) { color = "unicumColor"; } else {
      color = "superUnicumColor";
    }
    return color;
  }

  const getPrGroupColor = (pr) => {
    // Bad 	0 - 750
    // Below Average 	750 - 1100
    // Average 	1100 - 1350
    // Good 	1350 - 1550
    // Very Good 	1550 - 1750
    // Great 	1750 - 2100
    // Unicum 	2100 - 2450
    // Super Unicum 	2450 - 9999 
    var color = "";
    if (pr < 751) { color = "badColor"; } else
    if (pr < 1101) { color = "belowAverageColor"; } else
    if (pr < 1351) { color = "averageColor"; } else
    if (pr < 1551) { color = "goodColor"; } else
    if (pr < 1751) { color = "veryGoodColor"; } else
    if (pr < 2101) { color = "greatColor"; } else
    if (pr < 2451) { color = "unicumColor"; } else {
      color = "superUnicumColor";
    }

    return color;
  }

  const getPR = (shipId, battles, wins, frags, dmg) => {
    //Preparing data to calculate
    const actualDmg = dmg/battles;
    const actualWins = (wins/battles)*100;
    const actualFrags = frags/battles;

    const expectedDmg = ExpectedShipData.data[shipId].average_damage_dealt;
    const expectedWins = ExpectedShipData.data[shipId].win_rate;
    const expectedFrags = ExpectedShipData.data[shipId].average_frags;

    //Ratios
    const rDmg = actualDmg/expectedDmg;
    const rWins = actualWins/expectedWins;
    const rFrags = actualFrags/expectedFrags;

    //Normalization
    const nDmg = Math.max(0, (rDmg - 0.4) / (1 - 0.4))
    const nFrags = Math.max(0, (rFrags - 0.1) / (1 - 0.1))
    const nWins = Math.max(0, (rWins - 0.7) / (1 - 0.7))

    const pr = 700*nDmg + 300*nFrags + 150*nWins;

    return pr;
  }

  // Render the UI for your table
  return (
    <Fragment>
      <Grid container spacing={3}>
        <Grid item xs={9}>
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
                          {renderCell(cell)}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })}
            </TableBody>
          </MaUTable>
        </Grid>
        <Grid item xs={3}>
          <Box pl={2}>
            <Typography variant="h6" class="MuiTab-textColorPrimary" gutterBottom>
              Build Your Team
            </Typography>
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
                <Box pl={1}>
                  <Button style={{ height: 54 }} variant="contained" color="primary" onClick={clearPlayerEventHandler}>Clear</Button>
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