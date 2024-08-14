'use client'

import { useEffect } from "react"
import { redirect } from "next/navigation"

const LoginPage = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get("demo")) {
      redirect('https://dashboard.qikstarts.com/login?demo=true')
    }
    redirect('https://dashboard.qikstarts.com/login')
  },)
  return (
    null
  )
}

export default LoginPage