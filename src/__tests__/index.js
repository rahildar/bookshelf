import ReactDOM from 'react-dom'
import '@testing-library/jest-dom/extend-expect'
import {screen, userEvent, waitFor, within} from '@testing-library/react'
import faker from 'faker'
import {server} from 'test/server'

// enable API mocking in test runs using the same request handlers
// as for the client-side mocking.
beforeAll(() => server.listen())
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

// this is a pretty comprehensive test and CI is pretty slow...
jest.setTimeout(25000)

function buildUser(overrides) {
  return {
    id: faker.random.uuid(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
    ...overrides,
  }
}

const waitForLoading = () =>
  waitFor(
    () => expect(screen.queryByLabelText(/loading/i)).not.toBeInTheDocument(),
    {timeout: 6000},
  )

test('can login and use the book search', async () => {
  // setup
  const root = document.createElement('div')
  root.id = 'root'
  document.body.append(root)

  require('..')

  await waitForLoading()

  const user = buildUser()

  await userEvent.click(screen.getByRole('button', {name: /register/i}))

  const modal = within(screen.getByRole('dialog'))
  await userEvent.type(modal.getByLabelText(/username/i), user.username)
  await userEvent.type(modal.getByLabelText(/password/i), user.password)

  await userEvent.click(modal.getByRole('button', {name: /register/i}))

  await waitForLoading()

  await userEvent.click(screen.getAllByRole('link', {name: /discover/i})[0])

  const searchInput = screen.getByPlaceholderText(/search/i)
  await userEvent.type(searchInput, 'voice of war')

  await userEvent.click(screen.getByLabelText(/search/i))
  await waitForLoading()

  await userEvent.click(screen.getByText(/voice of war/i))

  expect(window.location.href).toMatchInlineSnapshot(
    `"http://localhost/book/B084F96GFZ"`,
  )

  expect(
    await screen.findByText(/to the west, a sheltered girl/i),
  ).toBeInTheDocument()

  await userEvent.click(screen.getByRole('button', {name: /logout/i}))

  expect(searchInput).not.toBeInTheDocument()

  // cleanup
  ReactDOM.unmountComponentAtNode(root)
  document.body.removeChild(root)
})
