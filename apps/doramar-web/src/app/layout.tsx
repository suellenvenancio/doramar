import "./globals.css"

import { AppToastContainer } from "@/components/toast"
import { AuthProvider } from "@/context/auth.context"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AppToastContainer />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
