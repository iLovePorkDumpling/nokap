import React, { Fragment, useState, useEffect } from 'react';
import { useTable, useSortBy } from "react-table";

//Data
import NokapMembersData from "../configdata/nokapmembersdata.json";
import ShipsData from "../configdata/shipsdata.json";
import RecommendedT6Ships from '../configdata/recommendedt6ships.json';
// import RentalShipidsReplacement from '../configdata/rentalshipidsreplacement.json';
// import ExpectedShipsData from '../configdata/expectedshipsdata.json';

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
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import Autocomplete from '@material-ui/lab/Autocomplete';
import "./Roster.css";

const Roster = () => {

  const [data, setData] = useState([]);
  
  const [searchablePlayers, setSearchablePlayers] = useState([]);
  const [addedPlayers, setAddedPlayers] = React.useState([]);
  
  const [allData, setAllData] = useState([]);
  const [expectedShipsData, setExpectedShipsData] = useState([]);
  const [shipsData, setShipsData] = useState([]);
  // const [rentalShipidsReplacement, setRentalShipidsReplacement] = useState([]);
  const [recommendedT6Ships, setRecommendedT6Ships] = useState([]);

  const RentalShipIdsReplacement = {
                                      "3315513040":
                                      {
                                          "real_id":4259231440,
                                          "name":"[Zaō]"
                                      },
                                      "3332323024":
                                      {
                                          "real_id":4276041424,
                                          "name":"[Yamato]"
                                      },
                                      "3333371888":
                                      {
                                          "real_id":4277090288,
                                          "name":"[Montana]"
                                      },
                                      "3333404368":
                                      {
                                          "real_id":4179605200,
                                          "name":"[Hakuryū]"
                                      },
                                      "3335501808":
                                      {
                                          "real_id":4179605488,
                                          "name":"[Midway]"
                                      },
                                      "3337500656":
                                      {
                                          "real_id":4281219056,
                                          "name":"[Gearing]"
                                      },
                                      "3338548944":
                                      {
                                          "real_id":4282267344,
                                          "name":"[Shimakaze]"
                                      },
                                      "3340645840":
                                      {
                                          "real_id":4074649040,
                                          "name":"[Grozovoi]"
                                      },
                                      "3340678608":
                                      {
                                          "real_id":4179539408,
                                          "name":"[Moskva]"
                                      },
                                      "3340678960":
                                      {
                                          "real_id":4179539760,
                                          "name":"[Hindenburg]"
                                      },
                                      "3340711728":
                                      {
                                          "real_id":4179572528,
                                          "name":"[Großer Kurfürst]"
                                      },
                                      "3340711888":
                                      {
                                          "real_id":4179572688,
                                          "name":"[Conqueror]"
                                      },
                                      "3340744656":
                                      {
                                          "real_id":4074747856,
                                          "name":"[Audacious]"
                                      }
                                    };

  useEffect(() => {
    const loadData = async () => {
      const expectedData = await import(`../configdata/expectedshipsdata`)
                              .then(result => {
                                setExpectedShipsData(result.default.data);
                                prepareData();
                                getAccountWrPrXpDmg(result.default.data);
                              });
    }
    loadData();
  }, []);

  const prepareData = async () => {
    await setShipsData(ShipsData);
    await setRecommendedT6Ships(RecommendedT6Ships);
    // setAllData(NokapMembersData);
    // setData(NokapMembersData);
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
        Header: 'Stats',
        accessor: 'statistics',
        show: false,
      },
      {
        Header: 'WR',
        accessor: 'wr',
      },
      {
        Header: 'PR',
        accessor: 'pr',
        show: false,
      },
      {
        Header: 'XP',
        accessor: 'xp',
      },
      {
        Header: 'DMG',
        accessor: 'dmg',
        show: false,
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

  const defaultSorted = React.useMemo(
    () => [
      {
        id: 'xp',
        desc: false,
      },
    ], []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
    defaultSorted,
    initialState: {
      hiddenColumns: columns.map(column => {
          if (column.show === false) return column.accessor || column.id;
      }),
      sortBy: [
        {
            id: 'xp',
            desc: true
        }
      ]
    },    
  },
  useSortBy,
  );

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
              const pr = getShipPR(shipData.ship_id, shipData.pvp.battles, shipData.pvp.wins, shipData.pvp.frags, shipData.pvp.damage_dealt);
              var colorGroup = getPrGroupColor(pr);
              var style = "";
              var topGroup = 0;

              if (recommendedT6Ships.indexOf(shipName) > -1) {
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
                                shipName: shipName + "(" + shipData.pvp.battles + ")",
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
    } else if (cell.column.id === "pr") {
      const color = getPrGroupColor(cell.row.values.pr);
      const style = { fontWeight: 'bold'};
      return (<span class={color} style={style}>{cell.row.values.pr}</span>);
    } else if (cell.column.id === "xp") {
      const color = getXpGroupColor(cell.row.values.xp);
      const style = { fontWeight: 'bold'};
      return (<span class={color} style={style}>{cell.row.values.xp}</span>);
    } else if (cell.column.id === "wr") {
      const color = getWrGroupColor(cell.row.values.wr);
      const style = { fontWeight: 'bold'};
      return (<span class={color} style={style}>{cell.row.values.wr}%</span>);
    } else {
      return cell.render('Cell');
    }
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

  const getXpGroupColor = (xp) => {
    var color = "";     
    if (xp < 550) { color = "badColor"; } else
    if (xp < 1100) { color = "belowAverageColor"; } else
    if (xp < 1350) { color = "averageColor"; } else
    if (xp < 1550) { color = "goodColor"; } else
    if (xp < 1750) { color = "veryGoodColor"; } else
    if (xp < 2100) { color = "greatColor"; } else
    if (xp < 2450) { color = "unicumColor"; } else {  //
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

  const replaceRentalShipIdWithRealShipId = (shipId) => {
    return RentalShipIdsReplacement[shipId].real_id;
  }

  const getAccountWrPrXpDmg = (expectedshipsdata) => {
    const newData = [];
    var newitem;

    var accountWr = 0;
    var accountPr = 0;
    var accountXp = 0;
    var accountDmg = 0;
    var accountStats;

    var ship_id = 0;
    var battles = 0;
    
    var actualDmg = 0;
    var actualWins = 0;
    var actualFrags = 0;

    var expectedDmg = 0;
    var expectedWins = 0;
    var expectedFrags = 0;

    //Ratios
    var rDmg = 0;
    var rWins = 0;
    var rFrags = 0;

    //Normalization
    var nDmg = 0;
    var nFrags = 0;
    var nWins = 0;

    NokapMembersData.forEach((player) => {
      accountStats = JSON.parse(player.statistics);
      if (accountStats.pvp != undefined) {

        //Get Account XP
        if (accountStats.pvp.battles != 0) {
          accountXp = accountStats.pvp.xp/accountStats.pvp.battles;
          accountWr = ((accountStats.pvp.wins/accountStats.pvp.battles)*100).toFixed(2);
          accountDmg = Math.round(accountStats.pvp.damage_dealt/accountStats.pvp.battles);
        } else {
          accountXp = 0;
          accountWr = 0;
          accountDmg = 0;
        }

        //Calculate Account PR
        // if (player.ships_data != undefined) {
        //   const shipsData = JSON.parse(player.ships_data);
        //   if (shipsData != undefined) {
        //     shipsData.forEach((ship) => {
        //       ship_id = ship.ship_id;
        //       battles = ship.pvp.battles;

        //       if (battles > 0) {

        //         if  (expectedshipsdata[ship_id] == undefined) {
        //           ship_id = replaceRentalShipIdWithRealShipId(ship_id)
        //         }

        //         actualDmg =+ ship.pvp.damage_dealt;
        //         actualWins =+ (ship.pvp.wins/battles)*100;
        //         actualFrags =+ ship.pvp.frags/battles;

        //         expectedDmg =+ battles*expectedshipsdata[ship_id].average_damage_dealt;
        //         expectedWins =+ battles*expectedshipsdata[ship_id].win_rate;
        //         expectedFrags =+ battles*expectedshipsdata[ship_id].average_frags;
        //       }
                
        //     });

        //     rDmg = actualDmg/expectedDmg;
        //     rFrags = actualFrags/expectedFrags;
        //     rWins = actualWins/expectedWins;

        //     nDmg = Math.max(0, (rDmg - 0.4) / (1 - 0.4));
        //     nFrags = Math.max(0, (rFrags - 0.1) / (1 - 0.1));
        //     nWins = Math.max(0, (rWins - 0.7) / (1 - 0.7));
        //     accountPr =  700*nDmg + 300*nFrags + 150*nWins;

        //   }
        // } else {
        //   accountPr = 0;
        // }
      }

      accountPr = 0;

      //create new item with Account PR and Account XP and push the newdata.
      newitem = {
        id: player.id,
        nickname: player.nickname,
        statistics: player.statistics,
        wr: accountWr,
        pr: Math.round(accountPr),
        xp: Math.round(accountXp),
        dmg: accountDmg,
        ships_data: player.ships_data,
        ship_names: player.ship_names
      };

      newData.push(newitem);

    });

    setData (newData);
    setAllData(newData);

  }

  const getShipPR = (shipId, battles, wins, frags, dmg) => {
    //Preparing data to calculate
    const actualDmg = dmg/battles;
    const actualWins = (wins/battles)*100;
    const actualFrags = frags/battles;

    const expectedDmg = expectedShipsData[shipId].average_damage_dealt;
    const expectedWins = expectedShipsData[shipId].win_rate;
    const expectedFrags = expectedShipsData[shipId].average_frags;

    //Ratios
    const rDmg = actualDmg/expectedDmg;
    const rWins = actualWins/expectedWins;
    const rFrags = actualFrags/expectedFrags;

    //Normalization
    const nDmg = Math.max(0, (rDmg - 0.4) / (1 - 0.4));
    const nFrags = Math.max(0, (rFrags - 0.1) / (1 - 0.1));
    const nWins = Math.max(0, (rWins - 0.7) / (1 - 0.7));

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
                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                      {column.render('Header')}
                      <span>
                        {column.isSorted ? (column.isSortedDesc ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />) : ''}
                      </span>
                    </th>
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