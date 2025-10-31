"use client"

import { useEffect, useRef, useState } from "react"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { persistStore } from "redux-persist"
import { AppStore, makestore } from "./store"


export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null)
  const [persistor, setPersistor] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    if (!storeRef.current) {
      storeRef.current = makestore()
      const ps = persistStore(storeRef.current) // ✅ Create persistor only on client
      setPersistor(ps)
    }
  }, [])

  if (!isClient || !storeRef.current || !persistor) return null

  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}