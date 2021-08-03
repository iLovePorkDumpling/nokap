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
import TopDogs from "./TopDogs";

//Data
import NokapMembersData from "../configdata/nokapmembersdata.json";
import ShipsData from "../configdata/shipsdata.json";
import RecommendedT6Ships from '../configdata/recommendedt6ships.json';
//import ExpectedShipData from '../configdata/shipsexpecteddata.json';


//CSS
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import { withStyles } from "@material-ui/core/styles";
import Divider from '@material-ui/core/Divider';

const T6Ships = () => {

  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);

    useEffect(() => {
      prepareData();      
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

      if (battles > 0) {
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
      } else {
        wrgroup = "Bad";
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
              var wr = Math.round((ship.pvp.wins/ship.pvp.battles)*100);
              if (ship.pvp.battles === 0) { wr = 0; }
              const playerName = member.nickname + " / " + ship.pvp.battles + " battles";
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
                AveragePlayers: [],
                BelowAverage: 0,
                BelowAveragePlayers: [],
                Bad: 0,
                BadPlayers: []        
              };

              switch(wrgroup) {
                case "Super Unicom":
                  newitem.SuperUnicom++;
                  newitem.SuperUnicomPlayers.push(playerName);
                  break;
                case "Unicom":
                  newitem.Unicom++;
                  newitem.UnicomPlayers.push(playerName);
                  break;
                case "Great":
                  newitem.Great++;
                  newitem.GreatPlayers.push(playerName);
                  break;
                case "Very Good":
                  newitem.VeryGood++;
                  newitem.VeryGoodPlayers.push(playerName);
                  break;
                case "Good":
                  newitem.Good++;
                  newitem.GoodPlayers.push(playerName);
                  break;
                case "Average":
                  newitem.Average++;
                  newitem.AveragePlayers.push(playerName);
                  break; 
                case "Below Average":
                  newitem.BelowAverage++;
                  newitem.BelowAveragePlayers.push(playerName);
                  break;
                case "Bad":
                  newitem.Bad++;
                  newitem.BadPlayers.push(playerName);
                  break;                
                default:
                  // code block
              }

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
                      found.AveragePlayers.push(playerName);
                      break; 
                    case "Below Average":
                      found.BelowAverage++;
                      found.BelowAveragePlayers.push(playerName);
                      break;
                    case "Bad":
                      found.Bad++;
                      found.BadPlayers.push(playerName);
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
  const AverageTypography = withStyles({ root: { color: "#FFC71F" }})(Typography);  
  const GreyTypography = withStyles({ root: { color: "#989898" }})(Typography);

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
            <Divider />
            <AverageTypography variant="body2" component="p">
              {payload[0].payload.AveragePlayers.map((item, id) => <ListItem >{item}</ListItem>)}
            </AverageTypography>
            <Divider />
            <GreyTypography variant="body2" component="p">
              {payload[0].payload.BelowAveragePlayers.map((item, id) => <ListItem >{item}</ListItem>)}
              {payload[0].payload.BadPlayers.map((item, id) => <ListItem >{item}</ListItem>)}
            </GreyTypography>
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

  // const colorFilterChangeHandler = (colorFilterValue) => {
  //   ExpectedShipData.
  // }

  return (
    <Fragment>       
      <ShipsFilter parentCallback={shipTypeFilterChangeHandler}/>
      <Grid container spacing={1}>
        <Grid item xs={7}>
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
        {/* <Grid item xs={3}>
          <TopDogs data={data} />
        </Grid> */}
      </Grid>     
    </Fragment>
  );
}

export default T6Ships;