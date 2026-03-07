import { useState } from "react";

export default function TransactionCard({ txn }) {
  const [expanded, setExpanded] = useState(false);

  const isLong = txn.description?.length > 120;

  return (
    <div className="txn-card">
      <div className="txn-top">
        <h4>{txn.name}</h4>
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
              onClick={() => setExpanded(true)}
            >
              See more
            </span>
          )}
        </div>
      )}
    </div>
  );
}