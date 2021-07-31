import React, { Fragment, useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
  Legend
} from "recharts";

//Components
import ShipsFilter from "./ShipsFilter";

//Data
import NokapMembersData from "../configdata/nokapmembersdata.json";
import ShipsData from "../configdata/shipsdata.json";
import RecommendedT6Ships from '../configdata/recommendedt6ships.json';

//CSS
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import { withStyles } from "@material-ui/core/styles";
import Divider from '@material-ui/core/Divider';

const T6Ships = () => {

  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);

  //const [playerData, setPlayerData] = useState([]);

  // const handleSaveToPC = (jsonData,filename) => {
  //   const fileData = JSON.stringify(jsonData);
  //   const blob = new Blob([fileData], {type: "text/plain"});
  //   const url = URL.createObjectURL(blob);
  //   const link = document.createElement('a');
  //   link.download = `${filename}.json`;
  //   link.href = url;
  //   link.click();
  // }

  // const getAllT6ShipNames = () => {
  //   const newdata = [];
  //   NokapMembersData.forEach((item, i) => {
  //     var shipNames = "";
  //     if (item.ships_data != undefined) {
  //       const shipsDataJson = JSON.parse(item.ships_data);
  //       shipsDataJson.forEach((item) => {
  //         if (ShipsData[item.ship_id] != undefined && ShipsData[item.ship_id].tier == 6) {
  //           shipNames += ShipsData[item.ship_id].name + " ";
  //         }
  //       });
  //       console.log(shipNames);
  //       const newitem = {
  //         id: item.id,
  //         nickname: item.nickname,
  //         statistics: item.statistics,
  //         ships_data: item.ships_data,
  //         ship_names: shipNames
  //       }
  //       newdata.push(newitem);
  //     } else {
  //       const newitem = {
  //         id: item.id,
  //         nickname: item.nickname,
  //         statistics: item.statistics,
  //         ships_data: item.ships_data,
  //         ship_names: ""
  //       }
  //       newdata.push(newitem);
  //     }
  //   });

  //   setPlayerData(newdata);
  //   //handleSaveToPC(newdata, "nokapmembersdata");
  // }

    useEffect(() => {
      prepareData();
      //getAllT6ShipNames();
      
    }, []);

    const sortbyShiptype = (a, b) => {
      if ( a.shipType < b.shipType ) {
        return -1;
      }
      if ( a.shipType > b.shipType ) {
        return 1;
      }
      return 0;
    }

    const calculateWR = (battles, wins) => {
      // Bad
      // 47 >= Below Average
      // 49 >= Average
      // 52 >= Good
      // 54 >= Very Good
      // 56 >= Great
      // 60 >= Unicom
      // 65 >= Super Unicom

      const wr = (wins/battles) * 100;
      var wrgroup = "Bad";     
      if (wr < 47) { wrgroup = "Bad"; } else
      if (wr < 50) { wrgroup = "Below Average"; } else
      if (wr < 52) { wrgroup = "Average"; } else
      if (wr < 54) { wrgroup = "Good"; } else
      if (wr < 56) { wrgroup = "Very Good"; } else
      if (wr < 60) { wrgroup = "Great"; } else
      if (wr < 65) { wrgroup = "Unicom"; } else {
        wrgroup = "Super Unicom";
      }

      return wrgroup;
    }

    const shortenShipName = (shipName) => {
      switch(shipName) {
        case "Erich Loewenhardt":
          return "E. Loewenhardt";
        case "Prinz Eitel Friedrich":
          return "PE. Friedrich";
        case "W. Virginia 1941":
          return "W. Virginia";
        case "Admiral Graf Spee":
          return "Graf Spee";
        case "Admiral Makarov":
          return "Makarov";
        case "HSF Admiral Graf Spee":
          return "Graf Spee";
        // case "La Galissonnière":
        //   return "HSF Graf Spee";
        default:
          return shipName;
      }
    }

    const prepareData =  () => {
      const newdata = [];

      var newitem = null;
      NokapMembersData.forEach((member, id) => {
        if (member.ships_data != undefined) {
          const memberShipsData = JSON.parse(member.ships_data);
          memberShipsData.forEach((ship) => {
            if (ShipsData[ship.ship_id] != undefined && ShipsData[ship.ship_id].tier == 6 && ship.pvp.battles > 9) {
            
              const shipName = shortenShipName(ShipsData[ship.ship_id].name);
              const shipType = ShipsData[ship.ship_id].type;
              const playerName = member.nickname;
              const wrgroup = calculateWR(ship.pvp.battles, ship.pvp.wins);

              newitem = {
                shipName: shipName,
                shipType: shipType,
                SuperUnicom: 0,
                SuperUnicomPlayers: [],
                Unicom: 0,
                UnicomPlayers: [],
                Great: 0,
                GreatPlayers: [],
                VeryGood: 0,
                VeryGoodPlayers: [],
                Good: 0,
                GoodPlayers: [],
                Average: 0,
                BelowAverage: 0,
                Bad: 0          
              };

              if (newdata.length == 0) {
                //newdata array is empty
                newdata.push(newitem);
              } else {
                //newdata array is NOT empty, find existing ship and +1 to count
                var found = newdata.find(x => x.shipName == shipName);
                if (found != undefined) {
                  //If found, +1 to count
                  switch(wrgroup) {
                    case "Super Unicom":
                      found.SuperUnicom++;
                      found.SuperUnicomPlayers.push(playerName);
                      break;
                    case "Unicom":
                      found.Unicom++;
                      found.UnicomPlayers.push(playerName);
                      break;
                    case "Great":
                      found.Great++;
                      found.GreatPlayers.push(playerName);
                      break;
                    case "Very Good":
                      found.VeryGood++;
                      found.VeryGoodPlayers.push(playerName);
                      break;
                    case "Good":
                      found.Good++;
                      found.GoodPlayers.push(playerName);
                      break;
                    case "Average":
                      found.Average++;
                      break; 
                    case "Below Average":
                      found.BelowAverage++;
                      break;
                    case "Bad":
                      found.Bad++;
                      break;                
                    default:
                      // code block
                  } 
                  
                } else {
                  //If not found, add new item
                  newdata.push(newitem);
                }
              }
            }
          });
        }
      });

      newdata.sort(sortbyShiptype);            
      setAllData(newdata);
      //TODO: Hack solution, please fix
      let shipFilterValue = "Recommended"
      const checkShipType = (element) => {      
        if (shipFilterValue === "All") {
          return true;
        } else {
          if (shipFilterValue === "Recommended") {
            return RecommendedT6Ships.indexOf(element.shipName) > -1;
          } else {
            return element.shipType === shipFilterValue;
          }
        }
      }
      setData(newdata.filter(checkShipType));
  };

  const renderCustomizedLabel = (props) => {
    const { x, y, width, height, value } = props;
  
    if (value > 0) {
      return (
        <g>
          <text x={x + width / 2} y={y + height / 2} fill="#fff" textAnchor="middle" dominantBaseline="middle" fontSize="13">
            {value}
          </text>
        </g>
      );
    } else {
      return "";
    }
  };

  const SuperUnicomTypography = withStyles({ root: { color: "#A00DC5" }})(Typography);
  const UnicomTypography = withStyles({ root: { color: "#D042F3" }})(Typography);
  const GreatTypography = withStyles({ root: { color: "#02C9B3" }})(Typography);
  const VeryGoodTypography = withStyles({ root: { color: "#318000" }})(Typography);
  const GoodTypography = withStyles({ root: { color: "#44B300" }})(Typography);  

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Card>
          <CardContent>
            <SuperUnicomTypography variant="body2" component="p">            
              {payload[0].payload.SuperUnicomPlayers.map((item, id) => <ListItem >{item}</ListItem>)}
            </SuperUnicomTypography>
            <Divider />
            <UnicomTypography variant="body2" component="p">
              {payload[0].payload.UnicomPlayers.map((item, id) => <ListItem >{item}</ListItem>)}
            </UnicomTypography>
            <Divider />
            <GreatTypography variant="body2" component="p">
              {payload[0].payload.GreatPlayers.map((item, id) => <ListItem >{item}</ListItem>)}
            </GreatTypography>
            <Divider />
            <VeryGoodTypography variant="body2" component="p">
              {payload[0].payload.VeryGoodPlayers.map((item, id) => <ListItem >{item}</ListItem>)}
            </VeryGoodTypography>
            <Divider />
            <GoodTypography variant="body2" component="p">
              {payload[0].payload.GoodPlayers.map((item, id) => <ListItem >{item}</ListItem>)}
            </GoodTypography>
          </CardContent>     
        </Card>
      );
    }
  
    return null;
  };

  const shipTypeFilterChangeHandler = (shipFilterValue) => {
    const checkShipType = (element) => {      
      if (shipFilterValue === "All") {
        return true;
      } else {
        if (shipFilterValue === "Recommended") {
          return RecommendedT6Ships.indexOf(element.shipName) > -1;
        } else {
          return element.shipType === shipFilterValue;
        }
      }
    }
    setData(allData.filter(checkShipType));
  }

  const SuperUnicomPlayerNames = () => {

    console.log(data);
    return (<ListItem >hello</ListItem>);
  }

  return (
    <Fragment>       
      <ShipsFilter parentCallback={shipTypeFilterChangeHandler}/>
      <Grid container spacing={3}>
        <Grid item xs={8}>
          <BarChart
            layout="vertical"
            width={1000}
            height={60*data.length}
            data={data}
            reverseStackOrder="true"
            maxBarSize={60}
            margin={{
              top: 20,
              right: 20,
              left: 50,
              bottom: 20
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" fontSize="13" />
            <YAxis dataKey="shipName" type="category" fontSize="13" />
            <Tooltip content={<CustomTooltip />} />
            <Legend align="right" verticalAlign="top" wrapperStyle={{top: -40, right: 10, fontSize: "13px"}}  />
            <Bar dataKey="SuperUnicom" stackId="a" fill="#A00DC5" >
              <LabelList dataKey="SuperUnicom" content={renderCustomizedLabel} />
            </Bar>
            <Bar dataKey="Unicom" stackId="a" fill="#D042F3" >
              <LabelList dataKey="Unicom" content={renderCustomizedLabel} />
            </Bar>
            <Bar dataKey="Great" stackId="a" fill="#02C9B3" >
              <LabelList dataKey="Great" content={renderCustomizedLabel} />
            </Bar>
            <Bar dataKey="VeryGood" stackId="a" fill="#318000" >
              <LabelList dataKey="VeryGood" content={renderCustomizedLabel} />
            </Bar>
            <Bar dataKey="Good" stackId="a" fill="#44B300" >
              <LabelList dataKey="Good" content={renderCustomizedLabel} />
            </Bar>
            <Bar dataKey="Average" stackId="a" fill="#FFC71F" >
              <LabelList dataKey="Average" content={renderCustomizedLabel} />
            </Bar>
            <Bar dataKey="BelowAverage" stackId="a" fill="#FE7903" >
              <LabelList dataKey="BelowAverage" content={renderCustomizedLabel} />
            </Bar>
            <Bar dataKey="Bad" stackId="a" fill="#FE0E00" >
              <LabelList dataKey="Bad" content={renderCustomizedLabel} />
            </Bar>                 
          </BarChart>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardContent>              
              <Typography variant="h7" component="h7">
                Top Dogs
              </Typography>
              <SuperUnicomTypography variant="body2" component="p"> 
                <SuperUnicomPlayerNames />
              </SuperUnicomTypography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>     
    </Fragment>
  );
}

export default T6Ships;