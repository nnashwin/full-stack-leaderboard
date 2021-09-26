import React from 'react';
import { useTable, useSortBy } from 'react-table';
import '../../css/Table.css';

interface TableColumn {
    Header: string;
    accessor: string;
    sortType: string;
}

interface TableProps {
    columns: TableColumn[];
    data: any;
}

function Table({ columns, data }: TableProps) {
   const {
     getTableProps,
     getTableBodyProps,
     headerGroups,
     rows,
     prepareRow
     // TODO: Fix typescript error that occurs due to type mismatch by extending the Column type.
     // Use the following for reference https://github.com/tannerlinsley/react-table/issues/3064
   } = useTable<any>({ columns, data }, useSortBy)
 
   return (
     <table {...getTableProps()} role="table" style={{ border: 'solid 1px blue' }} data-testid="leaderboard">
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
                 <div className="pointer-block">
                    <span>
                        {column.isSorted ? (column.isSortedDesc ? '↑' : '↓') : ''}
                    </span>
                 </div>
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