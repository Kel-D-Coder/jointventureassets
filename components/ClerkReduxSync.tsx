'use client'

import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useDispatch } from 'react-redux'
import { logout, setCredentials } from '@/store/authSlice'
import axios from 'axios'
import { AppDispatch } from '@/store/store'

export default function ClerkReduxSync() {
  const { isLoaded, isSignedIn, user } = useUser()
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (!isLoaded) return

    const syncUser = async () => {
        if (isSignedIn && user) {
            const userData = {
            googleEmail: user.emailAddresses[0].emailAddress
            }

            try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/login`,
                userData,
                {
                headers: { 'Content-Type': 'application/json' }
                }
            )

            // Optionally update Redux with server response or userData
                dispatch(
                    setCredentials({ user: response.data.user, token: response.data.token })
                ); 
            } catch (error) {
            console.error('Error syncing user with backend:', error)
            }
        } else {
            dispatch(logout())
        }
    }

    syncUser()
  }, [isLoaded, isSignedIn, user, dispatch])

  return null
}
