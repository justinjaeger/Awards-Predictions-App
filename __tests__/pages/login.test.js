jest.mock('axios');
import axios from 'axios';

import React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Login from './components/loginComponents/Login';

const username = process.env.TEST_USERNAME;
const password = process.env.TEST_PASSWORD;

// Set up mock server / api call
const server = setupServer(
  rest.get('/api/login', (req, res, ctx) => {
    return res(ctx.json({ message: 'you are logged in' }))
  })
);

beforeAll(() => {
  server.listen();
  render(<Login />);
});
// afterEach(() => server.resetHandlers())
afterAll(() => {
  server.close();
});

describe('Login component', () => {
  
  it('sends request to /login when I click the login button', async () => {
    // Enter username
    fireEvent.change(screen.getByLabelText('Email or Username'), {
      target: { value: username },
    });
    // Enter password
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: password },
    });
    // Click submit
    fireEvent.click(screen.getByText('Submit'))


    await waitFor(() => 
      // wait to retrieve a DOM element (later called in expect argument)
      screen.getById('something')
    );

    expect(screen.getByRole('heading')).toHaveTextContent('hello there')
    expect(screen.getByRole('button')).toHaveAttribute('disabled')
  });

});

