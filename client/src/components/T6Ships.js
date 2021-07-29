import React, { Fragment, useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList
} from "recharts";
import NokapMembersData from "../configdata/nokapmembersdata.json";
import ShipsData from "../configdata/shipsdata.json";

const T6Ships = () => {

  const [data, setData] = useState([]);

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

    const prepareData =  () => {
      const newdata = [];

      var newitem = null;
      var shipTypeColor = null;
      NokapMembersData.forEach((member, id) => {
        if (member.ships_data != undefined) {
          const memberShipsData = JSON.parse(member.ships_data);
          memberShipsData.forEach((ship) => {
            if (ShipsData[ship.ship_id] != undefined && ShipsData[ship.ship_id].tier == 6) {
            
              const shipId = ship.ship_id;
              const shipName = ShipsData[ship.ship_id].name;
              const shipType = ShipsData[ship.ship_id].type;

              switch(shipType) {
                case "AirCarrier":
                  shipTypeColor = "#FFE194";
                  break;
                case "Destroyer":
                  shipTypeColor = "#BEE0B4";
                  break;
                case "Battleship":
                  shipTypeColor = "#86c6ee";
                  break;
                case "Cruiser":
                  shipTypeColor = "#FF9C9F";
                  break;
                default:
                  // code block
              } 

              newitem = {
                shipId: shipId,
                shipName: shipName,
                shipType: shipType,
                shipTypeColor: shipTypeColor,
                count: 1
              };

              if (newdata.length == 0) {
                //newdata array is empty
                newdata.push(newitem);
              } else {
                //newdata array is NOT empty, find existing ship and +1 to count
                var found = newdata.find(x => x.shipName == shipName);
                if (found != undefined) {
                  //If found, +1 to count
                  found.count++;
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

      setData(newdata);
   
  };

  const renderCustomizedLabel = (props) => {
    const { x, y, width, height, value } = props;
  
    return (
      <g>
        <text x={x + width / 2} y={y + height / 2} fill="#666" textAnchor="middle" dominantBaseline="middle">
          {value}
        </text>
      </g>
    );
  };

  return (
    <Fragment>
      <BarChart
        layout="vertical"
        width={1600}
        height={4000}
        data={data}
        margin={{
          top: 0,
          right: 50,
          left: 50,
          bottom: 50
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="shipName" type="category" />
        <Tooltip />
        <Bar dataKey="count" fill="#666">
        {
          data.map((entry, index) => (
            <Cell fill={data[index].shipTypeColor}/>
          ))
        }
          <LabelList dataKey="count" content={renderCustomizedLabel} />
        </Bar>
      </BarChart>
    </Fragment>
  );
}

export default T6Ships;