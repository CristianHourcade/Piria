"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { useState } from "react"

interface ShowAlertOptions {
  message: string
  type: "success" | "error"
  duration?: number
}

export function useAlertMessage() {
  const [showAlert, setShowAlert] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
    show: false,
    message: "",
    type: "success",
  })

  const showAlertMessage = (message: string, type: "success" | "error", duration = 3000) => {
    setShowAlert({
      show: true,
      message,
      type,
    })

    setTimeout(() => {
      setShowAlert({
        show: false,
        message: "",
        type: "success",
      })
    }, duration)
  }

  return { showAlert, showAlertMessage }
}

export function AlertMessage({ alert }: { alert: { show: boolean; message: string; type: "success" | "error" } }) {
  if (!alert.show) return null

  return (
    <Alert
      className={
        alert.type === "success"
          ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900/30"
          : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900/30"
      }
    >
      <AlertDescription
        className={alert.type === "success" ? "text-green-800 dark:text-green-300" : "text-red-800 dark:text-red-300"}
      >
        {alert.message}
      </AlertDescription>
    </Alert>
  )
}
