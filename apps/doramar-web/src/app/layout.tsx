import { AuthProvider } from "@/context/auth.context"
import "./globals.css"
import { AppToastContainer } from "@/components/toast"

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
