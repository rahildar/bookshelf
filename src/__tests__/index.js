import ReactDOM from 'react-dom'
import '@testing-library/jest-dom/extend-expect'
import {screen, userEvent, waitFor} from '@testing-library/react'
import {server} from 'test/server'

// enable API mocking in test runs using the same request handlers
// as for the client-side mocking.
beforeAll(() => server.listen())
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

// this is a pretty comprehensive test and CI is pretty slow...
jest.setTimeout(25000)

test('renders the app', async () => {
  const root = document.createElement('div')
  root.id = 'root'
  document.body.append(root)

  require('..')

  await userEvent.type(screen.getByPlaceholderText(/search/i), 'voice of war')
  await userEvent.click(screen.getByLabelText(/search/i))
  await waitFor(() =>
    expect(screen.queryByLabelText(/loading/i)).not.toBeInTheDocument(),
  )
  expect(screen.getByText(/voice of war/i)).toBeInTheDocument()

  // cleanup
  ReactDOM.unmountComponentAtNode(root)
  document.body.removeChild(root)
})
