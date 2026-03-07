import { useEffect, useState } from "react";
import { db } from "../db";
import AddTransaction from "./AddTransaction";
import TransactionCard from "./TransactionCard";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const sortedTransactions = [...transactions].reverse();
  const visibleTransactions = sortedTransactions.slice(0, visibleCount);
  const loadData = async () => {
    const data = await db.transactions.toArray();
    setTransactions(data);
  };

  useEffect(() => {
    loadData();
  }, []);

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
      <div className="card">
        <h2>Balance: ₹ {totalBalance}</h2>
        <p>Assets: ₹ {assets}</p>
        <p>Liabilities: ₹ {liabilities}</p>
      </div>

      <AddTransaction refresh={loadData} />

      <div className="card">
        <h3>Recent Transactions</h3>
        {visibleTransactions.map((txn) => (
            <TransactionCard key={txn.id} txn={txn} />
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