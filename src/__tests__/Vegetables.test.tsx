import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import ky from 'ky';
import { MantineProvider } from '@mantine/core';
import App from '../App';
import { Context } from '../utils/Context';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
});

vi.mock('ky', () => ({
    default: {
        get: vi.fn(),
    },
}));

const mockVegetables = [
    { id: 1, name: 'Broccoli - 1 Kg', image: 'img1', price: 10 },
    { id: 2, name: 'Tomato - 1 Kg', image: 'img2', price: 5 },
    { id: 3, name: 'Carrot - 1 Kg', image: 'img3', price: 7 },
];

const renderApp = () => {
    return render(
        <MantineProvider>
            <Context>
                <App />
            </Context>
        </MantineProvider>
  );
};

describe('Vegetables shop', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    })

    describe('Main', () => {
        it('Check the quantity of vegetables', async () => {
            vi.mocked(ky.get).mockReturnValueOnce({
                json: vi.fn(() => Promise.resolve(mockVegetables)),
            } as any)
            renderApp();
            const vegetables = await screen.findAllByRole('img');
            expect(vegetables).toHaveLength(3);
        })

        it('Error quantity of vegetables', async () => {
            vi.mocked(ky.get).mockReturnValueOnce({
                json: vi.fn(() => Promise.reject(new Error('Error'))),
            } as any)
            renderApp();
            await waitFor(() => {
                expect(screen.getByText('Error')).toBeInTheDocument();
            })
        })

        it('add to Cart', async () => {
            vi.mocked(ky.get).mockReturnValueOnce({
                json: vi.fn(() => Promise.resolve(mockVegetables)),
            } as any);
            renderApp();
            const btns = await screen.findAllByText(/Add to cart/i);
            const user = userEvent.setup();
            await user.click(btns[0]);
            await waitFor(() => {
                const basket = JSON.parse(localStorage.getItem('basket') || '[]');
                expect(basket).toHaveLength(1);
            });
        })

        it('plus Cart', async () => {
            vi.mocked(ky.get).mockReturnValueOnce({
                json: vi.fn(() => Promise.resolve(mockVegetables)),
            } as any);
            renderApp();
            const plusButtons = await screen.findAllByRole('button', { name: 'Primary variant' })
            const user = userEvent.setup();
            await user.click(plusButtons[0]);
            await waitFor(() => {
                const basket = JSON.parse(localStorage.getItem('basket') || '[]');
                expect(basket).toHaveLength(1);
            });
        })

        it('minus Cart', async () => {
            vi.mocked(ky.get).mockReturnValueOnce({
                json: vi.fn(() => Promise.resolve(mockVegetables)),
            } as any);
            renderApp();
            const plusButtons = await screen.findAllByRole('button', { name: 'Primary variant' })
            const minusButtons = await screen.findAllByRole('button', { name: 'Danger variant' })
            const user = userEvent.setup();
            await user.click(plusButtons[0]);
            await user.click(minusButtons[0]);
            await waitFor(() => {
                const basket = JSON.parse(localStorage.getItem('basket') || '[]');
                expect(basket).toHaveLength(0);
            });
        })
    })
    describe('Popup', () => {
        it('Open Popup empty', async () => {
            renderApp();
            const button = await screen.findByRole('button', { name: /^cart$/i });
            const user = userEvent.setup();
            await user.click(button);
            const empty = await screen.findByText(/Your cart is empty!/i);
            expect(empty).toBeInTheDocument();
        })
        
        it('Change total price', async () => {
            vi.mocked(ky.get).mockReturnValueOnce({
                json: vi.fn(() => Promise.resolve(mockVegetables)),
            } as any);
            renderApp();
            const plusButtons = await screen.findAllByRole('button', { name: 'Primary variant' })
            const button = await screen.findByRole('button', { name: /^cart$/i });
            const user = userEvent.setup();
            await user.click(plusButtons[0]);
            await user.click(button);
            const popup = await screen.findByTestId('popup');
            await waitFor(() => {
                expect(within(popup).getByTestId('total-price')).toHaveTextContent('$ 10');
            });
            const popupPlus = within(popup).getAllByRole('button', { name: 'Primary variant' });
            await user.click(popupPlus[0])
            await waitFor(() => {
                expect(within(popup).getByTestId('total-price')).toHaveTextContent('$ 20');
            });
            const minusPopup = within(popup).getAllByRole('button', { name: 'Danger variant' })
            await user.click(minusPopup[0])
            await waitFor(() => {
                expect(within(popup).getByTestId('total-price')).toHaveTextContent('$ 10');
            });
        })
    })
})