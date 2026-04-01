import React from "react";
import Modal from "./Modal";

export default function ValidationModal({
  isOpen,
  title = "Validation",
  message,
  onClose,
  closeLabel = "Close",
}) {
  return (
    <Modal
      isOpen={isOpen}
      title={title}
      onClose={onClose}
      actions={<button className="btn" onClick={onClose}>{closeLabel}</button>}
    >
      <p className="py-2">{message}</p>
    </Modal>
  );
}
