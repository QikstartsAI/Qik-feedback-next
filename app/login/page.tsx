'use client'

import { useEffect } from "react"
import { redirect } from "next/navigation"
import { useSearchParams } from "next/navigation"

const LoginPage = () => {
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get("demo")) {
      redirect('https://dashboard.qikstarts.com/login?demo=true')
    }
    redirect('https://dashboard.qikstarts.com/login')
  },)
  return (
    null
  )
}

export default LoginPage
