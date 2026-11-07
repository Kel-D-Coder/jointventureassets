"use client"

import { useEffect, useRef } from "react"
import { Provider } from "react-redux"
import { persistStore } from "redux-persist"
import { AppStore, makestore } from "./store"

/**
 * The Redux store for the whole site. Pages render straight away (also on the server, so search
 * engines get the full HTML); the saved sign-in loads from the browser right after. Anything that
 * depends on who's signed in waits for that with <AuthReady> (see components/auth/AuthReady.tsx).
 */
export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null)
  if (!storeRef.current) storeRef.current = makestore()

  // Load the saved sign-in from the browser; sets _persist.rehydrated when done.
  useEffect(() => {
    persistStore(storeRef.current!)
  }, [])

  return <Provider store={storeRef.current}>{children}</Provider>
}
