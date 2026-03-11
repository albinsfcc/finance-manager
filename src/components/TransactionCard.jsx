import { useState } from "react";

export default function TransactionCard({ txn, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const isLong = txn.description?.length > 120;
  const kindLabel = txn.isAsset
    ? "Asset"
    : txn.type === "fund"
    ? "Income"
    : "Expense";

  const toggleActions = () => {
    setShowActions(prev => !prev);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    if (onEdit) onEdit(txn);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete(txn.id);
  };

  return (
    <div
      className={`txn-card ${txn.type} ${txn.isAsset ? "asset" : ""} ${
        showActions ? "selected" : ""
      }`}
      onClick={toggleActions}
    >
      <div className="txn-top">
        <div className="txn-main">
          <h4>{txn.name}</h4>
          <span className="txn-kind">{kindLabel}</span>
        </div>
        <span className={`amount ${txn.type}`}>
          ₹ {txn.amount}
        </span>
      </div>

      <div className="txn-category">
        <span className="badge">{txn.category}</span>
      </div>

      {txn.description && (
        <div className="txn-description">
          <p className={expanded ? "expanded" : ""}>
            {txn.description}
          </p>

          {isLong && !expanded && (
            <span
              className="see-more"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(true);
              }}
            >
              See more
            </span>
          )}
        </div>
      )}

      {showActions && (
        <div className="txn-actions">
          <button
            type="button"
            className="txn-action-btn edit"
            onClick={handleEditClick}
          >
            Edit
          </button>
          <button
            type="button"
            className="txn-action-btn delete"
            onClick={handleDeleteClick}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}