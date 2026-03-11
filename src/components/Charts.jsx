import { useEffect, useState } from "react";
import { db } from "../db";

export default function Charts() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await db.transactions.toArray();
      setTransactions(data);
    };
    load();
  }, []);

  const hasData = transactions.length > 0;

  return (
    <div className="container main-content">
      <div className="card">
        <h2>Charts (coming soon)</h2>
        <p className="charts-intro">
          Here are some starter views we can build from your transactions.
        </p>

        {!hasData && (
          <p className="charts-empty">
            Add a few transactions first to unlock richer charts.
          </p>
        )}

        <div className="charts-grid">
          <ChartIdea
            title="Spending by category"
            description="See how your expenses are distributed across categories for the current month."
          />
          <ChartIdea
            title="Income vs expenses"
            description="Compare total income (funds) vs expenses over the last 30 days."
          />
          <ChartIdea
            title="Cashflow over time"
            description="Line chart of daily net cashflow (income minus expenses)."
          />
          <ChartIdea
            title="Top expense categories"
            description="Rank the categories where you spend the most, all time or by month."
          />
          <ChartIdea
            title="Assets vs liabilities"
            description="Visual breakdown of asset-marked transactions vs liability expenses."
          />
          <ChartIdea
            title="Monthly savings trend"
            description="Track how much you save every month (income minus expenses)."
          />
          <ChartIdea
            title="Largest single expenses"
            description="Spot your biggest individual expenses to find easy wins to cut back."
          />
          <ChartIdea
            title="Recurring payments"
            description="Highlight categories or names that appear frequently, like subscriptions."
          />
          <ChartIdea
            title="Category over time"
            description="Pick a category and see how spending in it changes month to month."
          />
          <ChartIdea
            title="Net worth timeline"
            description="Approximate net position using assets and liabilities over time."
          />
        </div>
      </div>
    </div>
  );
}

function ChartIdea({ title, description }) {
  return (
    <div className="chart-idea">
      <div className="chart-idea-header">
        <span className="chart-idea-title">{title}</span>
        <span className="chart-idea-tag">Idea</span>
      </div>
      <p className="chart-idea-desc">{description}</p>
    </div>
  );
}

