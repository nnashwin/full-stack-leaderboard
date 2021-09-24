import React, { useMemo } from 'react';
import { Column, useTable, useSortBy } from 'react-table';

interface ExampleObject {
    name: string
    wins: number
    losses: number
    rating: number
    gamesPlayed: number
}

interface SortType {
    sortType: string
}

const columns: Column<ExampleObject>[] = [
        {
            Header: 'Player Name',
            accessor: 'name', 
            sortType: 'basic'
        },
        {
            Header: 'Wins',
            accessor: 'wins',
            sortType: 'basic'
        },

        {
            Header: 'Losses',
            accessor: 'losses',
            sortType: 'basic'
        },
        {
            Header: 'Total Matches Played',
            accessor: 'gamesPlayed',
            sortType: 'basic'
        },
        {
            Header: 'Rating',
            accessor: 'rating',
            sortType: 'basic'
        },
    ]

const data = [
       {
         name: 'Liu Guoliang',
         wins: 100,
         losses: 5,
         rating: 2300,
         gamesPlayed: 105
       },
       {
         name: 'Chen Meng',
         wins: 110,
         losses: 0,
         rating: 3900,
         gamesPlayed: 110
       },
       {
         name: 'Mima Ito',
         wins: 55,
         losses: 80,
         rating: 1600,
         gamesPlayed: 135
       },
     ];

function Table() {
   const {
     getTableProps,
     getTableBodyProps,
     headerGroups,
     rows,
     prepareRow
   } = useTable<ExampleObject>({ columns, data }, useSortBy)
 
   return (
     <table {...getTableProps()} role="leaderboard-table" style={{ border: 'solid 1px blue' }} data-testid="leaderboard">
       <thead>
         {headerGroups.map(headerGroup => (
           <tr {...headerGroup.getHeaderGroupProps()} data-testid='header-row'>
             {headerGroup.headers.map(column => (
               <th
                 {...column.getHeaderProps(column.getSortByToggleProps())}
                 style={{
                   borderBottom: 'solid 3px red',
                   background: 'aliceblue',
                   color: 'black',
                   fontWeight: 'bold',
                 }}
               >
                 {column.render('Header')}
                 <span>
                     {column.isSorted ? (column.isSortedDesc ? '↑' : '↓') : ''}
                 </span>
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