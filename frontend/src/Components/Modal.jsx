import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"

import "../styles/modal.scss"

function Modal({ children, open }) {
  const dialog = useRef()

  useEffect(() => {
    const modal = dialog.current

    if (open) {
      modal.showModal()
    }

    return () => modal.close()
  }, [open])

  return createPortal(
    <dialog ref={dialog} className="modal">
      <div className="modal-inner">{children}</div>
    </dialog>,
    document.getElementById("modal")
  )
}

export default Modal
