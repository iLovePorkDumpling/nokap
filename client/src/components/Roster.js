import React, { Fragment, useState, useEffect } from 'react';
import { useTable } from "react-table";
import ShipsData from "../configdata/shipsdata.json";
import NokapMembersData from "../configdata/nokapmembersdata.json";

//CSS
import MaUTable from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

const Roster = () => {

  const [data, setData] = useState([]);

  const handleSaveToPC = (jsonData,filename) => {
    const fileData = JSON.stringify(jsonData);
    const blob = new Blob([fileData], {type: "text/plain"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${filename}.json`;
    link.href = url;
    link.click();
  }

  useEffect(() => {
    getShipNames();
  }, []);

  const getShipNames = () => {
    const newdata = [];
    NokapMembersData.forEach((item, i) => {
      var shipNames = "";
      if (item.ships_data != undefined) {
        const shipsDataJson = JSON.parse(item.ships_data);
        shipsDataJson.forEach((item) => {
          if (ShipsData[item.ship_id] != undefined && ShipsData[item.ship_id].tier == 6) {
            shipNames += ShipsData[item.ship_id].name + " ";
          }
        });
        const newitem = {
          id: item.id,
          nickname: item.nickname,
          statistics: item.statistics,
          ships_data: item.ships_data,
          ship_names: shipNames
        }
        newdata.push(newitem);
      } else {
        const newitem = {
          id: item.id,
          nickname: item.nickname,
          statistics: item.statistics,
          ships_data: item.ships_data,
          ship_names: ""
        }
        newdata.push(newitem);
      }
    });

    setData (newdata);
    //handleSaveToPC(newdata, "newdata");
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
 
  // Render the UI for your table
  return (
    <Fragment>
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
    </Fragment>
  );
}
 
export default Roster;