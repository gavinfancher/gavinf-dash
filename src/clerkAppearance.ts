import { dark } from '@clerk/themes'

// Clerk's widget is the only third-party surface in the portal, so it gets the
// palette handed to it explicitly — left alone it renders in Clerk's own neutral
// greys and the sign-in card reads as a different product bolted onto the page.
// homecloud renders no Clerk components of its own — it only redirects here —
// so this is the one place the widget is themed.
export const clerkAppearance = {
  baseTheme: dark,
  variables: {
    colorBackground: '#141c19',
    colorForeground: '#e6efe9',
    colorMutedForeground: '#8fa49a',
    colorNeutral: '#e6efe9',
    colorInput: '#0f1614',
    colorInputForeground: '#e6efe9',
    colorPrimary: '#3fd79a',
    // The mint is bright enough that Clerk's default white label on it sits at
    // ~1.9:1. Ink on mint instead.
    colorPrimaryForeground: '#06130e',
    colorDanger: '#e8595c',
    colorRing: '#3fd79a',
    borderRadius: '7px',
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
  },
}
