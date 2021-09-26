import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

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

it('navigates home when you click on the home button', () => {
    act(() => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <App />
            </MemoryRouter>,
            container
        );
    });

    const homeContainerDiv = document.querySelector('[data-testid="HomePage"]')
    expect(homeContainerDiv).not.toBe(null);
});