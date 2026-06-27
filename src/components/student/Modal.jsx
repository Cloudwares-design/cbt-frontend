export default function Modal({ title, message, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">

        <h3 className="modal-title">{title}</h3>

        <p className="modal-message">{message}</p>

        <button className="modal-btn" onClick={onClose}>
          OK
        </button>

      </div>
    </div>
  );
}