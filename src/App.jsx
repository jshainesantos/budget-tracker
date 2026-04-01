import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import TransactionForm from "./components/TransactionForm";
import CategorySettings from "./components/CategorySettings";
import Summary from "./components/Summary";
import CategoriesPage from "./pages/Categories";

const DEFAULT_CATEGORIES = [
  "Food",
  "Rent",
  "Transport",
  "Utilities",
  "Entertainment",
  "Other",
];

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  useEffect(() => {
    try {
      const t = localStorage.getItem("bt_transactions");
      const b = localStorage.getItem("bt_budgets");
      const c = localStorage.getItem("bt_categories");
      if (t) setTransactions(JSON.parse(t));
      if (b) setBudgets(JSON.parse(b));
      if (c) setCategories(JSON.parse(c));
    } catch (e) {
      console.error("Failed to load saved data", e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("bt_transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("bt_budgets", JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem("bt_categories", JSON.stringify(categories));
  }, [categories]);

  const addTransaction = (tx) => {
    const safeTx = { ...tx };
    if (safeTx.type === "expense" && !categories.includes(safeTx.category)) {
      safeTx.category = "Other";
    }
    setTransactions((s) => [...s, safeTx]);
  };

  const deleteTransaction = (id) =>
    setTransactions((s) => s.filter((t) => t.id !== id));

  const setBudget = (cat, value) => {
    setBudgets((prev) => {
      const copy = { ...prev };
      if (value === null) delete copy[cat];
      else copy[cat] = value;
      return copy;
    });
    // ensure category exists when adding a budget
    if (value !== null && !categories.includes(cat)) {
      setCategories((prev) => [...prev, cat]);
    }
  };

  const addCategory = (name) => {
    const n = name.trim();
    if (!n) return;
    setCategories((prev) => (prev.includes(n) ? prev : [...prev, n]));
  };

  const editCategory = (oldName, newName) => {
    const nn = newName.trim();
    if (!nn) return;
    setCategories((prev) => prev.map((c) => (c === oldName ? nn : c)));
    setBudgets((prev) => {
      if (!Object.prototype.hasOwnProperty.call(prev, oldName)) return prev;
      const copy = { ...prev };
      copy[nn] = copy[oldName];
      delete copy[oldName];
      return copy;
    });
    setTransactions((prev) =>
      prev.map((tx) =>
        tx.category === oldName ? { ...tx, category: nn } : tx,
      ),
    );
  };

  const deleteCategory = (name) => {
    if (name === "Other") return;
    setCategories((prev) => prev.filter((c) => c !== name));
    setBudgets((prev) => {
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
    setTransactions((prev) =>
      prev.map((tx) =>
        tx.category === name ? { ...tx, category: "Other" } : tx,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Budget Tracker</h1>
              <p className="text-sm text-muted">
                Quickly log expenses and income, set budgets, and see a summary.
              </p>
            </div>
            <div className="flex gap-2">
              <Link to="/" className="btn btn-ghost btn-sm">
                Dashboard
              </Link>
              <Link to="/budgets" className="btn btn-ghost btn-sm">
                Budgets
              </Link>

              <Link to="/categories" className="btn btn-ghost btn-sm">
                Categories
              </Link>
            </div>
          </div>
        </header>

        <Routes>
          <Route
            path="/"
            element={
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="col-span-1 space-y-4">
                  <TransactionForm
                    categories={categories}
                    budgets={budgets}
                    onAdd={addTransaction}
                  />
                </div>
                <div className="lg:col-span-2 col-span-1">
                  <Summary
                    transactions={transactions}
                    budgets={budgets}
                    categories={categories}
                    onDelete={deleteTransaction}
                  />
                </div>
              </div>
            }
          />

          <Route
            path="/budgets"
            element={
              <div className="">
                <CategorySettings
                  categories={categories}
                  budgets={budgets}
                  onSetBudget={setBudget}
                />
              </div>
            }
          />

          <Route
            path="/categories"
            element={
              <div className="">
                <CategoriesPage
                  categories={categories}
                  onAddCategory={addCategory}
                  onEditCategory={editCategory}
                  onDeleteCategory={deleteCategory}
                />
              </div>
            }
          />
        </Routes>
      </div>
    </div>
  );
}
