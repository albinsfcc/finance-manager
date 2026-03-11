import { useEffect, useState } from "react";
import { db } from "../db";
import AddTransaction from "./AddTransaction";
import TransactionCard from "./TransactionCard";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [editingTxn, setEditingTxn] = useState(null);

  const sortedTransactions = [...transactions].reverse();
  const visibleTransactions = sortedTransactions.slice(0, visibleCount);

  const loadData = async () => {
    const data = await db.transactions.toArray();
    setTransactions(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteTransaction = async (id) => {
    await db.transactions.delete(id);
    await loadData();
  };

  const handleEditTransaction = (txn) => {
    setEditingTxn(txn);
    const target = document.getElementById("add-transaction");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const totalBalance = transactions.reduce((acc, t) => {
    if (t.type === "fund") return acc + t.amount;
    return acc - t.amount;
  }, 0);

  const assets = transactions
    .filter(t => t.isAsset)
    .reduce((a, b) => a + b.amount, 0);

  const liabilities = transactions
    .filter(t => !t.isAsset && t.type === "expense")
    .reduce((a, b) => a + b.amount, 0);

  return (
    <div className="container main-content">
      <div className="card balance-card">
        <div className="balance-card-header">
          <span className="balance-card-title">Overview</span>
          <span className="balance-card-pill">Today</span>
        </div>

        <div className="balance-amount-row">
          <div className="balance-amount-label">Total balance</div>
          <div className="balance-amount">₹ {totalBalance}</div>
        </div>

        <div className="balance-breakdown">
          <div className="balance-breakdown-item">
            <span className="balance-breakdown-label">Assets</span>
            <span className="balance-breakdown-value positive">₹ {assets}</span>
          </div>
          <div className="balance-breakdown-item">
            <span className="balance-breakdown-label">Liabilities</span>
            <span className="balance-breakdown-value negative">₹ {liabilities}</span>
          </div>
        </div>
      </div>

      <AddTransaction
        refresh={loadData}
        editingTxn={editingTxn}
        clearEditing={() => setEditingTxn(null)}
      />

      <div className="card">
        <h3>Recent Transactions</h3>
        {visibleTransactions.map((txn) => (
          <TransactionCard
            key={txn.id}
            txn={txn}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
          />
        ))}

        {transactions.length > visibleCount && (
          <button
            className="load-more"
            onClick={() => setVisibleCount(visibleCount + 20)}
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
}