import React, { useMemo } from 'react';
import { Column, useTable } from 'react-table';

interface ExampleObject {
    col1: string
    col2: string
}

function Table() {
   const data = React.useMemo(
     () => [
       {
         col1: 'Hello',
         col2: 'World',
       },
       {
         col1: 'react-table',
         col2: 'rocks',
       },
       {
         col1: 'whatever',
         col2: 'you want',
       },
     ],
     []
   )
 
   const columns: Column<ExampleObject>[] = [
        {
            Header: 'Column 1',
            accessor: 'col1', // accessor is the "key" in the data
        },
        {
            Header: 'Column 2',
            accessor: 'col2',
        },
    ]
     
 
   const {
     getTableProps,
     getTableBodyProps,
     headerGroups,
     rows,
     prepareRow,
   } = useTable<ExampleObject>({ columns, data })
 
   return (
     <table {...getTableProps()} role="leaderboard-table" style={{ border: 'solid 1px blue' }} data-testid="leaderboard">
       <thead>
         {headerGroups.map(headerGroup => (
           <tr {...headerGroup.getHeaderGroupProps()}>
             {headerGroup.headers.map(column => (
               <th
                 {...column.getHeaderProps()}
                 style={{
                   borderBottom: 'solid 3px red',
                   background: 'aliceblue',
                   color: 'black',
                   fontWeight: 'bold',
                 }}
               >
                 {column.render('Header')}
               </th>
             ))}
           </tr>
         ))}
       </thead>
       <tbody {...getTableBodyProps()}>
         {rows.map(row => {
           prepareRow(row)
           return (
             <tr {...row.getRowProps()}>
               {row.cells.map(cell => {
                 return (
                   <td
                     {...cell.getCellProps()}
                     style={{
                       padding: '10px',
                       border: 'solid 1px gray',
                       background: 'papayawhip',
                     }}
                   >
                     {cell.render('Cell')}
                   </td>
                 )
               })}
             </tr>
           )
         })}
       </tbody>
     </table>
   )
 }

export default Table;