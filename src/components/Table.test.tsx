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