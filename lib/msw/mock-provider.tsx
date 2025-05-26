'use client'

import { useEffect } from 'react'

export default function MockProvider() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
      import('./browser').then(({ worker }) => {
        worker.start({
          onUnhandledRequest: 'bypass',
        })
      })
    }
  }, [])

  return null // 이 컴포넌트는 아무 UI도 렌더하지 않음
}