import { ToastContainer, toast as tostify } from "react-toastify"
import type { ToastOptions } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export function toast(message: string, options?: ToastOptions) {
  tostify(message, {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: true,
    closeButton: true,
    style: { backgroundColor: "#e91e63", color: "white", fontWeight: 700 },
    ...options,
  })
}

export function AppToastContainer() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={4000}
      hideProgressBar
      closeButton={true}
    />
  )
}
