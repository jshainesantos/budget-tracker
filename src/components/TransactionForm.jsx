import { useEffect, useState } from "react";
import ValidationModal from "./ValidationModal";

export default function TransactionForm({ categories, budgets = {}, onAdd }) {
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(categories[0] || "Other");
  const [budget, setBudget] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState("");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (!categories.includes(category)) setCategory(categories[0] || "Other");
    if (budget && !Object.prototype.hasOwnProperty.call(budgets, budget))
      setBudget("");
  }, [categories]);

  const submit = (e) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setValidationError("Enter a valid positive amount");
      return;
    }

    const tx = {
      id: Date.now(),
      type,
      amount: Math.round(amt * 100) / 100,
      category: type === "expense" ? category : "Income",
      budget: budget || null,
      date,
      description: description.trim(),
    };

    onAdd(tx);
    setAmount("");
    setDescription("");
  };

  return (
    <form onSubmit={submit} className="card card-body bg-base-100 shadow-md">
      <div className="form-control">
        <label className="label">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="select select-bordered"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      <div className="form-control">
        <label className="label">Amount</label>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input input-bordered"
          placeholder="0.00"
        />
      </div>

      {type === "expense" && (
        <div className="form-control">
          <label className="label">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="select select-bordered"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      )}

      {type === "expense" && (
        <div className="form-control mt-2">
          <label className="label">Budget (optional)</label>
          <select
            value={budget}
            onChange={(e) => {
              setBudget(e.target.value);
              if (e.target.value) setCategory(e.target.value);
            }}
            className="select select-bordered"
          >
            <option value="">-- none --</option>
            {Object.keys(budgets || {}).map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="form-control">
        <label className="label">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input input-bordered"
        />
      </div>

      <div className="form-control">
        <label className="label">Description</label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input input-bordered"
          placeholder="Lunch, paycheck, etc."
        />
      </div>

      <div className="form-control mt-4">
        <button type="submit" className="btn btn-primary">Add Transaction</button>
      </div>

      <ValidationModal
        isOpen={!!validationError}
        message={validationError}
        onClose={() => setValidationError("")}
      />
    </form>
  );
}
