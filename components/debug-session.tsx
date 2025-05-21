"use client"

import { useAuth } from "@/components/auth-provider"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DebugSession() {
  const { user, session } = useAuth()
  const [isVisible, setIsVisible] = useState(false)

  if (!user || !session) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button variant="outline" size="sm" onClick={() => setIsVisible(!isVisible)} className="mb-2">
        {isVisible ? "Ocultar" : "Mostrar"} Datos de Sesión
      </Button>

      {isVisible && (
        <Card className="w-96 bg-white shadow-lg border border-gray-200 max-h-[80vh] overflow-auto">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-sm font-medium">Datos de Sesión y Usuario</CardTitle>
          </CardHeader>
          <CardContent className="p-4 text-xs">
            <div className="mb-4">
              <h3 className="font-bold mb-1">Usuario:</h3>
              <pre className="bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(
                  {
                    id: user.id,
                    email: user.email,
                    role: user.user_metadata?.role || "No definido",
                    name: user.user_metadata?.name || "No definido",
                  },
                  null,
                  2,
                )}
              </pre>
            </div>

            <div>
              <h3 className="font-bold mb-1">Metadatos completos:</h3>
              <pre className="bg-gray-100 p-2 rounded overflow-auto">{JSON.stringify(user.user_metadata, null, 2)}</pre>
            </div>

            <div className="mt-4">
              <h3 className="font-bold mb-1">Datos de sesión:</h3>
              <pre className="bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(
                  {
                    expires_at: session.expires_at,
                    token_type: session.token_type,
                  },
                  null,
                  2,
                )}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
