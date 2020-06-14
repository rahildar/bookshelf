/** @jsx jsx */
import {jsx} from '@emotion/core'

import React from 'react'
import * as auth from 'auth-provider'
import {client} from './utils/api-client'
import {AuthenticatedApp} from './authenticated-app'
import {UnauthenticatedApp} from './unauthenticated-app'

async function getUser() {
  let user = null

  const token = await auth.getToken()
  if (token) {
    user = await client('me', {token})
  }

  return user
}

function App() {
  const [user, setUser] = React.useState(null)

  React.useEffect(() => {
    getUser().then(u => setUser(u))
  }, [])

  const login = form => auth.login(form).then(u => setUser(u))
  const register = form => auth.register(form).then(u => setUser(u))
  const logout = () => {
    auth.logout()
    setUser(null)
  }

  const props = {user, login, register, logout}
  return user ? (
    <AuthenticatedApp {...props} />
  ) : (
    <UnauthenticatedApp {...props} />
  )
}

export {App}
