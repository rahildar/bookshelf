import '@testing-library/jest-dom'
import {queryCache} from 'react-query'
import * as auth from 'auth-provider'
import {server} from 'test/server'

// enable API mocking in test runs using the same request handlers
// as for the client-side mocking.
beforeAll(() => server.listen())
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

// general cleanup
afterEach(async () => {
  queryCache.clear()
  await auth.logout()
})
