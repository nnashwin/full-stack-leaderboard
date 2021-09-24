import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

import Table from './Table';


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
        render(<Table />, container);       
    });

    expect(document.querySelector('[data-testid="leaderboard"]').getAttribute('role')).toEqual('leaderboard-table');
});

it('changes sorted order based on the header that is clicked', () => {
    act(() => {
        render(<Table />, container);
    });

    const prevFirstRowName = document.querySelector('tbody > tr:first-child').children[0].textContent;
    const tableHeaders = document.querySelector('[data-testid="header-row"]');

    act(() => {
        tableHeaders.children[0].dispatchEvent(new MouseEvent('click', {bubbles: true}));
    });

    const newFirstRowName = document.querySelector('tbody > tr:first-child').children[0].textContent;

    expect(newFirstRowName).not.toEqual(prevFirstRowName);
});