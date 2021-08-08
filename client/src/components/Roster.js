import React, { Fragment, useState, useEffect } from 'react';
import { useTable, useGlobalFilter, useSortBy } from "react-table";
import GlobalFilter from './GlobalFilter';

//Data
import NokapMembersData from "../configdata/nokapmembersdata.json";
import ShipsData from "../configdata/shipsdata.json";
import RecommendedT6Ships from '../configdata/recommendedt6ships.json';
// import RentalShipidsReplacement from '../configdata/rentalshipidsreplacement.json';
// import ExpectedShipsData from '../configdata/expectedshipsdata.json';

//CSS
import { makeStyles } from '@material-ui/core/styles';
import MaUTable from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import SearchIcon from '@material-ui/icons/Search';
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
  const [teamTableData, setTeamTableData] = useState([]);

  const [avgPlayersWr, setAvgPlayersWr] = useState(0);
  const [avgPlayersPr, setAvgPlayersPr] = useState(0);
  const [avgPlayersXp, setAvgPlayersXp] = useState(0);
  const [avgPlayersDmg, setAvgPlayersDmg] = useState(0);

  const [avgShipsWr, setAvgShipsWr] = useState(0);
  const [avgShipsPr, setAvgShipsPr] = useState(0);
  const [avgShipsXp, setAvgShipsXp] = useState(0);
  const [avgShipsDmg, setAvgShipsDmg] = useState(0);

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

  const handleClickShipName = (event, row) => {
    const playerId = row.values.id;

    //Check if that item is already in TeamTableData
    const foundIndex = teamTableData.findIndex(player => player.playerId === playerId);
    if (foundIndex == -1) {
      //Player is NOT in the TeamTableData, Add the playerId, nickname, and ship data to the TeamTableData, make sure to mark CHECKED on the checkbox
      const newitem = {
        playerId: playerId,
        nickname: event.target.attributes.nickname.value,
        ship: event.target.attributes.shipName.value,
        shipWr: event.target.attributes.shipWr.value,
        shipPr: event.target.attributes.shipPr.value,
        shipXp: event.target.attributes.shipXp.value,
        shipDmg: event.target.attributes.shipDmg.value
      }

      const original = teamTableData;
      const newArray = original.concat(newitem);
      setTeamTableData(newArray);
      calculateTeamPlayersStats(newArray);
      calculateTeamShipsStats (newArray);

      //Mark CHECKED on the player's checkbox
      const newdata = data.slice();
      const newdataFoundIndex = newdata.findIndex(row => row.id === playerId);
      newdata[newdataFoundIndex].selection = true;
      setData(newdata);
    } else {    
      //Found existing player on the TeamTableData, Check if we have Ship data
      const newdata = teamTableData.slice();
      if (teamTableData[foundIndex].ship == '' || teamTableData[foundIndex].ship == undefined) {
        //Existing player but NO ship data, add ship data to existing player record
        newdata[foundIndex].ship = event.target.attributes.shipName.value;
        newdata[foundIndex].shipWr = event.target.attributes.shipWr.value;
        newdata[foundIndex].shipPr = event.target.attributes.shipPr.value;
        newdata[foundIndex].shipXp = event.target.attributes.shipXp.value;
        newdata[foundIndex].shipDmg = event.target.attributes.shipDmg.value;
      } else {
        //Existing player WITH ship data, Remove ship data from existing player record
        newdata[foundIndex].ship = '';
        newdata[foundIndex].shipWr = 0;
        newdata[foundIndex].shipPr = 0;
        newdata[foundIndex].shipXp = 0;
        newdata[foundIndex].shipDmg = 0;
      }
      setTeamTableData(newdata);
      calculateTeamShipsStats (newdata);
    }

    // if (event.target.selected == false) {
    //   //Click is to select
    //   switch(event.target.className) {
    //     case "badColor":
    //       event.target.classList.replace("badColor", "selectedBadColor");
    //       break;
    //     case "belowAverageColor":
    //       event.target.classList.replace("belowAverageColor", "selectedBelowAverageColor");
    //       break;
    //     case "averageColor":
    //       event.target.classList.replace("averageColor", "selectedAverageColor");
    //       break;
    //     case "goodColor":
    //       event.target.classList.replace("goodColor", "selectedGoodColor");
    //       break;
    //     case "veryGoodColor":
    //       event.target.classList.replace("veryGoodColor", "selectedVeryGoodColor");
    //       break;
    //     case "greatColor":
    //       event.target.classList.replace("greatColor", "selectedGreatColor");
    //       break; 
    //     case "unicumColor":
    //       event.target.classList.replace("unicumColor", "selectedUnicumColor");
    //       break;
    //     case "superUnicumColor":
    //       event.target.classList.replace("superUnicumColor", "selectedSuperUnicumColor");
    //       break;
    //     case "greyColor":
    //       event.target.classList.replace("greyColor", "selectedGreyColor");
    //       break;
    //     default:
    //       // code block
    //   }
    // } else {
    //   //Click is to de-select
    // }
  }

  const handdleCheckboxChange = (row) => {
    const playerId = row.values.id;
    const nickname = row.values.nickname;

    //Check if that item is already in TeamTableData
    const found = teamTableData.find(player => player.playerId === playerId);
    if (found == undefined) {
      //Player is NOT in the TeamTableData, Add the playerId, and nickname to the TeamTableData
      const newitem = {
        playerId: playerId,
        nickname: nickname,
        ship: '',
        shipWr: '',
        shipPr: '',
        shipXp: '',
        shipDmg: ''        
      }

      const original = teamTableData;
      const newArray = original.concat(newitem);
      setTeamTableData(newArray);
      calculateTeamPlayersStats(newArray); 
      
      row.values.selection = true;    
      const newData = data.slice();
      const newDataFoundIndex = newData.findIndex(player => player.id === playerId);
      newData[newDataFoundIndex].selection = true;
      setData(newData);
    } else {
        //Found existing player on the TeamTableData, Remove the player
        const filterData = teamTableData.filter(player => player.playerId != playerId);
        setTeamTableData(filterData);
        calculateTeamPlayersStats(filterData);
        
        row.values.selection = false;
        const newData = data.slice();
        const newDataFoundIndex = newData.findIndex(player => player.id === playerId);
        newData[newDataFoundIndex].selection = false;
        setData(newData);
    }
  }
  
  const toggleFilterByTeamOrAll = (event) => {
    if (event.target.textContent === "All") {
      const teamOnlyData = data.filter(player => player.selection == true);
      setData(teamOnlyData);
      event.target.textContent = "Team";
    } else {
      setData(allData);
      event.target.textContent = "All";
    }
  }

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id', // accessor is the "key" in the data
        show: false,
      },
      {
        Header: '',
        accessor: 'selection',          
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
    state,
    setGlobalFilter,
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
  useGlobalFilter,
  useSortBy,
  );

  const { globalFilter } = state

  const calculateTeamPlayersStats = (players) => {
    var wr = 0;
    var pr = 0;
    var xp = 0;
    var dmg = 0;
    var name = "";
    var battles = 0;
    players.forEach((player) => {
      name = player.nickname;
      for (var i = 0; i < allData.length; i++) {
        if (allData[i].nickname === name) {
          wr = wr + parseFloat(allData[i].wr);
          pr = pr + allData[i].pr;
          xp = xp + allData[i].xp;
          dmg = dmg + allData[i].dmg;
        }
      }
    });

    const numberOfPlayersInTeam = players.length;
    if (numberOfPlayersInTeam > 0) {
      setAvgPlayersWr(wr/numberOfPlayersInTeam);
      setAvgPlayersPr(pr/numberOfPlayersInTeam);
      setAvgPlayersXp(xp/numberOfPlayersInTeam);
      setAvgPlayersDmg(dmg/numberOfPlayersInTeam);
    } else {
      setAvgPlayersWr(0);
      setAvgPlayersPr(0);
      setAvgPlayersXp(0);
      setAvgPlayersDmg(0);
    }
  }

  const calculateTeamShipsStats = (players) => {
    var shipWr = 0;
    var shipPr = 0;
    var shipXp = 0;
    var shipDmg = 0;
    var skippedPlayers = 0;
    players.forEach((player) => {
      if (player.ship != '') {
        shipWr = shipWr + parseFloat(player.shipWr);
        shipPr = shipPr + parseInt(player.shipPr);
        shipXp = shipXp + parseInt(player.shipXp);
        shipDmg = shipDmg + parseInt(player.shipDmg);
      } else {
        ++skippedPlayers;
      }
    });

    const numberOfPlayersInTeam = players.length - skippedPlayers;
    if (numberOfPlayersInTeam > 0) {
      setAvgShipsWr(shipWr/numberOfPlayersInTeam);
      setAvgShipsPr(shipPr/numberOfPlayersInTeam);
      setAvgShipsXp(shipXp/numberOfPlayersInTeam);
      setAvgShipsDmg(shipDmg/numberOfPlayersInTeam);
    } else {
      setAvgShipsWr(0);
      setAvgShipsPr(0);
      setAvgShipsXp(0);
      setAvgShipsDmg(0);
    }
  }

  const clearPlayerEventHandler= () => {
    const newdata = allData.slice();
    newdata.forEach((element) => {
      element.selection = false;
    });

    setData(newdata);
    setTeamTableData([]);
    setAvgPlayersWr(0);
    setAvgPlayersPr(0);
    setAvgPlayersXp(0);
    setAvgPlayersDmg(0);
    setAvgShipsWr(0);
    setAvgShipsPr(0);
    setAvgShipsXp(0);
    setAvgShipsDmg(0);
  }

  const handleMouseOverShipName = (event) => {

  }
 
  const renderCell = (cell) => {
    if (cell.column.id === "ship_names") {
      const shipsList = [];
      if (cell.row.values.ships_data != undefined && cell.row.values.ships_data != null) {
        const playerShipsData = JSON.parse(cell.row.values.ships_data);
        if (playerShipsData != undefined && playerShipsData != null) {
          for (let i = 0; i < playerShipsData.length; i++) {
            const shipData = playerShipsData[i];
            if (shipData != undefined && shipsData[shipData.ship_id] && shipsData[shipData.ship_id].tier === 6) {
              const playerId = shipData.account_id;
              const nickname = cell.row.values.nickname;
              const shipName = shipsData[shipData.ship_id].name;
              var wr = 0;
              var pr = 0;
              var xp = 0;
              var dmg = 0;
              if (shipData.pvp.battles > 0) {
                wr = ((shipData.pvp.wins/shipData.pvp.battles)*100).toFixed(2);
                pr = Math.round(getShipPR(shipData.ship_id, shipData.pvp.battles, shipData.pvp.wins, shipData.pvp.frags, shipData.pvp.damage_dealt));
                xp = Math.round(shipData.pvp.xp/shipData.pvp.battles);
                dmg = Math.round(shipData.pvp.damage_dealt/shipData.pvp.battles);
              }
              
              var colorGroup = getPrGroupColor(pr);
              var style = "";
              var topGroup = 0;

              if (recommendedT6Ships.indexOf(shipName) > -1) {
                style = { fontWeight: 'bold', fontSize: 16, cursor: 'pointer' };
                topGroup = 1;
              } else {
                style = { fontWeight: 'lighter', fontSize: 14, cursor: 'pointer' };
                topGroup = 0;
              }

              if (shipData.pvp.battles < 5) {
                colorGroup = "greyPrColor";
                style = { fontWeight: 'lighter', fontSize: 14, cursor: 'pointer'};
                topGroup = 0;
              }

              const newItem = { 
                                shipName: shipName,
                                shipBattles: shipData.pvp.battles,
                                colorGroup: colorGroup,
                                playerId: playerId,
                                nickname: nickname,
                                shipWr: wr,
                                shipPr: pr,
                                shipXp: xp,
                                shipDmg: dmg,
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

      const selected = false;

      const ShipsList = ({shipsList}) => (
        <>
          {shipsList.map(ship => (
            <span 
              class={ship.colorGroup} 
              selected={selected}
              onClick={(event) => handleClickShipName(event, cell.row)}
              onmouseover={handleMouseOverShipName}
              playerId={ship.playerId}
              nickname={ship.nickname}
              shipName={ship.shipName}
              shipBattles={ship.shipBattles}
              shipWr={ship.shipWr}
              shipPr={ship.shipPr}
              shipXp={ship.shipXp}
              shipDmg={ship.shipDmg}
              style={ship.style}>
                &ensp;&ensp;{ship.shipName}({ship.shipBattles })&ensp;&ensp;
            </span>
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
    } else if (cell.column.id === "nickname") {
      style = { cursor: 'pointer'};
      return (<span playerId={cell.row.values.id} style={style}>{cell.row.values.nickname}</span>);
    } else if (cell.column.id === "selection") {   
        if (cell.row.values.selection == false || cell.row.values.selection == undefined) {
          return (<Checkbox color="primary" onChange={() => handdleCheckboxChange(cell.row)} checked={false} />);
        } else { 
          return (<Checkbox color="primary" onChange={() => handdleCheckboxChange(cell.row)} checked={true} />);
        }  
    }  else {
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

  const getDmgGroupColor = (dmg) => {
    var color = "";     
    if (dmg < 15000) { color = "badColor"; } else
    if (dmg < 25000) { color = "belowAverageColor"; } else
    if (dmg < 35000) { color = "averageColor"; } else
    if (dmg < 39000) { color = "goodColor"; } else
    if (dmg < 48000) { color = "greatColor"; } else {
      color = "superUnicumColor";
    }
    return color;
  }

  const getAvgFragsGroupColor = (avgFrags) => {
    var color = "";     
    if (avgFrags < 0.55) { color = "badColor"; } else
    if (avgFrags < 0.7) { color = "belowAverageColor"; } else
    if (avgFrags < 0.9) { color = "averageColor"; } else
    if (avgFrags < 1.2) { color = "goodColor"; } else
    if (avgFrags < 1.5) { color = "greatColor"; } else {
      color = "superUnicumColor";
    }
    return color;
  }

  // const getBattlesGroupColor = (battles) => {
  //   //44k is purple
  //   var color = "";     
  //   if (battles < 3000) { color = "badColor"; } else
  //   if (battles < 5000) { color = "belowAverageColor"; } else
  //   if (battles < 9000) { color = "averageColor"; } else
  //   if (battles < 14000) { color = "goodColor"; } else
  //   if (battles < 20000) { color = "greatColor"; } else {
  //     color = "superUnicumColor";
  //   }
  //   return color;
  // }

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

  const TeamDataTable = ({data}) => {
    const useStyles = makeStyles({
      table: {
        minWidth: 500
      },
      tr: {
        cursor: "pointer",
        borderLeft: "8px solid #9a031e",
        marginTop: "8px"
      },
      td: {
        marginLeft: "8px"
      }
    });
  
    const columns = React.useMemo(
     () => [      
       {
         Header: '',
         accessor: 'nickname',
       },
       {
         Header: '',
         accessor: 'ship',
       },
       {
         Header: 'WR',
         accessor: 'shipWr',
         Cell: cellInfo => ( cellInfo.cell.value != '' ? <span class={getWrGroupColor(parseFloat(cellInfo.cell.value))} >{cellInfo.cell.value}%</span> : '') 
       },
       {
         Header: 'PR',
         accessor: 'shipPr',
         Cell: cellInfo => ( cellInfo.cell.value != '' ? <span class={getPrGroupColor(parseInt(cellInfo.cell.value))} >{cellInfo.cell.value}</span> : '')
       },
       {
          Header: 'XP',
          accessor: 'shipXp',
          Cell: cellInfo => ( cellInfo.cell.value != '' ? <span class={getXpGroupColor(parseInt(cellInfo.cell.value))} >{cellInfo.cell.value}</span> : '' )
      },
      {
          Header: 'Dmg',
          accessor: 'shipDmg',
          Cell: cellInfo => ( cellInfo.cell.value != '' ? <span class={getDmgGroupColor(parseInt(cellInfo.cell.value))} >{cellInfo.cell.value}</span> : '')
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
    });
  
    const classes = useStyles();
  
    return (
      <table className={classes.table} {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  // {renderTeamDataCell(cell)}
                  return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  const pink = "#f48fb1";
  // Render the UI for your table
  return (
    <Fragment>
      <Grid container direction="row" alignItems="left">
        <Grid item>
          <Box pt={2} pl={3}>
            <Card variant="outlined" style={{ backgroundColor: "#D0F2FF", color: "#04297A" }} >
              <CardContent>
                <Box p={1}>
                <h5>Restriction</h5>
                <ul>
                  <li>Aug 18 - Oct 4, 7 vs 7 format, Tier VI ships</li>
                  <li>No more than two CVs or BBs per team in total.</li>
                  <li>Admiral Graf Spee and HSF Graf Spee are banned</li>
                  <br/>
                  <br/>
                  <br/>
                </ul>
                </Box>
              </CardContent>
            </Card>            
          </Box>
        </Grid>
        <Grid item>
          <Box pt={2} pl={10} pb={5}>
            <Card variant="outlined" style={{ backgroundColor: "#C8FACD", color: "#005249" }}>
              <CardContent>
                <Box p={1}>
                <h5>How-to</h5>
                <ul>
                  <li>Use <CheckBoxIcon fontSize="small"/> to add player to your team</li>
                  <li>Click on <b>Ship name</b> to assign ship to your player</li>
                  <li>Use <SearchIcon fontSize="small" /> to search for player</li>
                  <li>Click <b>ALL</b> or <b>TEAM</b> at top left of Roster table to toggle<br/> 
                      between displaying data of ALL members, vs only the one you selected <br/>
                      for your team.</li>
                </ul>
                </Box>
              </CardContent>
            </Card>            
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={7}>
          <Box align="left" pt={3} pl={3} pb={5}>
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
          </Box>
          <MaUTable {...getTableProps()}>
            <TableHead>
              {headerGroups.map(headerGroup => (
                <TableRow {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                      &nbsp;&nbsp;&nbsp;{column.id != 'selection' ? column.render('Header'): <>&nbsp;&nbsp;&nbsp;<span onClick={toggleFilterByTeamOrAll} variant="contained">All</span></>}
                      <span>
                        {(column.id != 'selection' && column.isSorted) ? (column.isSortedDesc ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />) : ''}
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
                  <TableRow className={row.values.selection ? "rowSelected" : ''} {...row.getRowProps()}>
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
        <Grid item xs={4}>
          <Box pl={6} pt={3}>
            <Card variant="outlined" style={{ backgroundColor: "#F4F6F8" }} >
              <CardContent>
                  <Box pb={3} align="center">
                    <Typography variant="h5" gutterBottom>
                      Your Team
                    </Typography>
                  </Box>
                  <Grid container direction="row" alignItems="left">
                    <Box pl={3} pr={3} width="50%">
                      <Grid item>
                        <Card variant="outlined">
                          <CardContent>
                            <Box align="center">
                              <Typography variant="body2" class="MuiTab-textColorPrimary" align="center">
                                Avg. Player Stats
                              </Typography>
                            </Box>
                          <Grid container direction="row" alignItems="left">
                            <Box width="50%">
                            <Grid item>
                              <Typography variant="caption" class="MuiTab-textColorPrimary" align="center">
                                WR: <span class={getWrGroupColor(avgPlayersWr)} >{avgPlayersWr.toFixed(2)}%</span>
                              </Typography>
                            </Grid>
                            </Box>
                            <Grid item>
                              <Typography variant="caption" class="MuiTab-textColorPrimary" align="center">
                                PR: Soon!
                              </Typography>
                            </Grid>
                          </Grid>
                          <Grid>
                          <Grid container direction="row" alignItems="left">
                            <Box width="50%">
                              <Grid item>
                                <Typography variant="caption" class="MuiTab-textColorPrimary" align="center">
                                  XP: <span class={getXpGroupColor(avgPlayersXp)} >{Math.round(avgPlayersXp)}</span>
                                </Typography>
                              </Grid>
                            </Box>
                            <Grid item>
                              <Typography variant="caption" class="MuiTab-textColorPrimary" align="center">
                                Dmg: <span class={getDmgGroupColor(avgPlayersDmg)} >{Math.round(avgPlayersDmg)}</span>
                              </Typography>
                            </Grid>
                            </Grid>
                          </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Box>
                    <Box pr={3} width="50%">
                      <Grid item>
                        <Card variant="outlined">
                          <CardContent>
                          <Box align="center">
                            <Typography variant="body2" class="MuiTab-textColorPrimary" align="center">
                              Avg. Ships Stats
                            </Typography>
                          </Box>
                          <Grid container direction="row" alignItems="left">
                            <Box width="50%">
                            <Grid item>
                              <Typography variant="caption" class="MuiTab-textColorPrimary" align="center">
                                WR: <span class={getWrGroupColor(avgShipsWr)} >{avgShipsWr.toFixed(2)}%</span>
                              </Typography>
                            </Grid>
                            </Box>
                            <Grid item>
                              <Typography variant="caption" class="MuiTab-textColorPrimary" align="center">
                                PR: <span class={getPrGroupColor(avgShipsPr)} >{Math.round(avgShipsPr)}</span>
                              </Typography>
                            </Grid>
                          </Grid>
                          <Grid>
                          <Grid container direction="row" alignItems="left">
                            <Box width="50%">
                              <Grid item>
                                <Typography variant="caption" class="MuiTab-textColorPrimary" align="center">
                                  XP: <span class={getXpGroupColor(avgShipsXp)} >{Math.round(avgShipsXp)}</span>
                                </Typography>
                              </Grid>
                              </Box>
                              <Grid item>
                                <Typography variant="caption" class="MuiTab-textColorPrimary" align="center">
                                  Dmg: <span class={getDmgGroupColor(avgShipsDmg)} >{Math.round(avgShipsDmg)}</span>
                                </Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Box>
                  </Grid>
                  <br/>
                  <Grid item>
                    <Box pl={3}>
                      <TeamDataTable data={teamTableData} />
                    </Box>
                    <Box pt={3} align="center">
                      <Button style={{ height: 54 }} variant="contained" color="primary" onClick={clearPlayerEventHandler}>Clear</Button>
                    </Box>
                  </Grid>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Fragment>
  );

}
 
export default Roster;