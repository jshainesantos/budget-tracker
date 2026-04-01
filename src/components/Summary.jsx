import React, { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import { formatCurrency } from "../utils/format";

export default function Summary({
  transactions,
  budgets,
  categories,
  onDelete,
}) {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;

  const categoryTotals = categories.reduce((acc, c) => {
    acc[c] = transactions
      .filter((t) => t.type === "expense" && t.category === c)
      .reduce((s, t) => s + t.amount, 0);
    return acc;
  }, {});

  // compute budget alerts
  const alerts = { near: [], exceeded: [] };
  Object.entries(budgets || {}).forEach(([cat, b]) => {
    const spent = categoryTotals[cat] || 0;
    const pct = b > 0 ? Math.round((spent / b) * 100) : 0;
    if (pct >= 100) alerts.exceeded.push({ cat, spent, b, pct });
    else if (pct >= 80) alerts.near.push({ cat, spent, b, pct });
  });

  const alertCount = alerts.near.length + alerts.exceeded.length;
  const [isModalOpen, setIsModalOpen] = useState(alertCount > 0);
  const prevAlertCountRef = useRef(alertCount);

  useEffect(() => {
    if (alertCount > prevAlertCountRef.current) {
      setIsModalOpen(true);
    }
    prevAlertCountRef.current = alertCount;
  }, [alertCount]);

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="stat card bg-base-100 p-4">
          <div className="stat-title">Income</div>
          <div className="stat-value">{formatCurrency(income)}</div>
        </div>
        <div className="stat card bg-base-100 p-4">
          <div className="stat-title">Expenses</div>
          <div className="stat-value text-error">{formatCurrency(expense)}</div>
        </div>
        <div className="stat card bg-base-100 p-4">
          <div className="stat-title">Balance</div>
          <div className="stat-value">{formatCurrency(balance)}</div>
        </div>
      </div>

          <Modal isOpen={isModalOpen} title="Budget Alerts" onClose={() => setIsModalOpen(false)}>
            <div className="py-2">
              {alerts.exceeded.length > 0 && (
                <div className="mb-3">
                  <div className="font-semibold text-error">Exceeded</div>
                  <ul className="list-disc pl-5">
                    {alerts.exceeded.map((a) => (
                      <li key={`ex-${a.cat}`}>
                        {a.cat} — {formatCurrency(a.spent)} used of {formatCurrency(a.b)} ({a.pct}%)
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {alerts.near.length > 0 && (
                <div>
                  <div className="font-semibold text-warning">Almost full</div>
                  <ul className="list-disc pl-5">
                    {alerts.near.map((a) => (
                      <li key={`near-${a.cat}`}>
                        {a.cat} — {formatCurrency(a.spent)} used of {formatCurrency(a.b)} ({a.pct}%)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Modal>

      {transactions.length === 0 ? (
        <div className="card bg-base-100 p-6 items-center text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 17v-6a2 2 0 112 0v6m4 0v-4a2 2 0 112 0v4M3 13h18"
            />
          </svg>
          <h3 className="text-lg font-semibold">No transactions yet</h3>
          <p className="text-sm text-muted mb-4">
            Add income or expenses to see them appear here.
          </p>
          {/* <div className="mt-4">
            <Link to="/" className="btn btn-primary btn-sm">
              Add Transaction
            </Link>
          </div> */}
        </div>
      ) : (
        <div className="card bg-base-100 p-4">
          <h3 className="text-lg font-bold mb-2">Recent Transactions</h3>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Description</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {transactions
                  .slice()
                  .reverse()
                  .map((t) => (
                    <tr key={t.id}>
                      <td>
                        {t.type === "income" ? (
                          <span className="badge badge-success">Income</span>
                        ) : (
                          <span className="badge badge-warning">Expense</span>
                        )}
                      </td>
                      <td>{formatCurrency(t.amount)}</td>
                      <td>{t.category}</td>
                      <td>{t.date}</td>
                      <td>{t.description}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-ghost"
                          onClick={() => onDelete(t.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
