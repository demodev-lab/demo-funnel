'use client'

import { useEffect, useState } from 'react'

export default function MSWBootstrap({
  children,
}: {
  children: React.ReactNode
}) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
      import('./browser').then(({ worker }) => {
        worker.start({ onUnhandledRequest: 'bypass' }).then(() => {
          console.log('🧪 MSW started')
          setReady(true)
        })
      })
    } else {
      setReady(true) // mock 안 쓰는 경우도 children 렌더링
    }
  }, [])

  // MSW 준비될 때까지 children 렌더링 지연
  if (!ready) return null

  return <>{children}</>
}