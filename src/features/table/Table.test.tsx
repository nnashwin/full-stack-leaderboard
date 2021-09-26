import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

import Table from './Table';

const playerColumns = [
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
];

const playerData = [
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


let container;
beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
});

afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;   
});

it('renders into the dom', () => {
    act(() => {
        render(<Table columns={playerColumns} data={playerData} />, container);       
    });

    expect(document.querySelector('[data-testid="leaderboard"]').getAttribute('role')).toEqual('leaderboard-table');
});

it('changes sorted order based on the header that is clicked', () => {
    act(() => {
        render(<Table columns={playerColumns} data={playerData} />, container);
    });

    const prevFirstRowName = document.querySelector('tbody > tr:first-child').children[0].textContent;
    const tableHeaders = document.querySelector('[data-testid="header-row"]');

    act(() => {
        tableHeaders.children[0].dispatchEvent(new MouseEvent('click', {bubbles: true}));
    });

    const newFirstRowName = document.querySelector('tbody > tr:first-child').children[0].textContent;

    expect(newFirstRowName).not.toEqual(prevFirstRowName);
});