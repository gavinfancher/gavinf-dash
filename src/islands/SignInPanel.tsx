import { ClerkProvider, ClerkLoading, ClerkLoaded, SignIn, Show } from '@clerk/react'
import { useEffect } from 'react'
import { IconCloudMark } from '../Icons'

const PUBLISHABLE_KEY = import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY

// Island for auth.gavinf.com. The page chrome around it is static Astro; only
// the Clerk widget needs React, so it mounts client:only.
export default function SignInPanel() {
  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      localization={{ signIn: { start: { title: 'Sign in' } } }}
    >
      <ClerkLoading>
        <div className="portal-main"><p className="muted">Loading…</p></div>
      </ClerkLoading>
      <ClerkLoaded>
      <Show when="signed-out">
        <div className="land-shell">
          <header className="land-header">
            <div className="land-logo-mark">
              <IconCloudMark size={18} />
            </div>
            <a className="btn-login" href="https://gavinf.com">← Back</a>
          </header>
          <main className="portal-main">
            <SignIn
              routing="hash"
              fallbackRedirectUrl="https://dash.gavinf.com"
            />
          </main>
        </div>
      </Show>
        <Show when="signed-in">
          <RedirectToDash />
        </Show>
      </ClerkLoaded>
    </ClerkProvider>
  )
}

function RedirectToDash() {
  useEffect(() => {
    window.location.href = 'https://dash.gavinf.com'
  }, [])

  return (
    <div className="portal-main">
      <p className="muted">Redirecting to dashboard…</p>
    </div>
  )
}
