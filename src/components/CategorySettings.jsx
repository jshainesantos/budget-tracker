import { useState } from "react";
import ConfirmModal from "./ConfirmModal";
import ValidationModal from "./ValidationModal";
import { formatCurrency } from "../utils/format";

export default function CategorySettings({ categories, budgets, onSetBudget }) {
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAmount, setNewAmount] = useState("");

  const [editing, setEditing] = useState(null);
  const [editName, setEditName] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [validationError, setValidationError] = useState("");
  const [confirmDeleteBudget, setConfirmDeleteBudget] = useState(null);

  const handleAdd = (e) => {
    e && e.preventDefault();
    const name = newName.trim();
    const v = parseFloat(newAmount);
    if (!name) {
      setValidationError("Enter a budget name");
      return;
    }
    if (isNaN(v) || v <= 0) {
      setValidationError("Enter a valid positive amount");
      return;
    }
    if (budgets && Object.prototype.hasOwnProperty.call(budgets, name)) {
      setValidationError("Budget already exists");
      return;
    }
    onSetBudget(name, Math.round(v * 100) / 100);
    setNewName("");
    setNewAmount("");
    setAdding(false);
  };

  const startEdit = (name) => {
    setEditing(name);
    setEditName(name);
    setEditAmount(budgets[name] != null ? String(budgets[name]) : "");
  };

  const saveEdit = (oldName) => {
    const name = editName.trim();
    const v = parseFloat(editAmount);
    if (!name) {
      setValidationError("Enter a budget name");
      return;
    }
    if (isNaN(v) || v <= 0) {
      setValidationError("Enter a valid positive amount");
      return;
    }
    onSetBudget(name, Math.round(v * 100) / 100);
    if (name !== oldName) onSetBudget(oldName, null);
    setEditing(null);
  };

  const deleteBudget = (name) => {
    setConfirmDeleteBudget(name);
  };

  return (
    <div className="card bg-base-100 p-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold mb-2">Budgets</h3>
        <div>
          <button className="btn btn-sm" onClick={() => setAdding((s) => !s)}>
            {adding ? "Close" : "Add Budget"}
          </button>
        </div>
      </div>

      {adding && (
        <form className="mt-3 flex gap-2 items-center" onSubmit={handleAdd}>
          <input
            className="input input-bordered"
            placeholder="Budget name (e.g., Food)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Amount"
            className="input input-bordered"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
          />
          <button className="btn btn-primary btn-sm" disabled={!newName}>
            Save
          </button>
        </form>
      )}

      <div className="mt-4">
        {!budgets || Object.keys(budgets).length === 0 ? (
          <div className="card bg-base-100 p-6 items-center text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-primary mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2v4h6v-4c0-1.105-1.343-2-3-2z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 20h14a2 2 0 002-2v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1a2 2 0 002 2z"
              />
            </svg>
            <h3 className="text-lg font-semibold">No budgets yet</h3>
            <p className="text-sm text-muted">
              Create budgets to track spending.
            </p>
            <div className="mt-4">
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setAdding(true)}
              >
                Add Budget
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {Object.entries(budgets).map(([name, amt]) => (
              <div key={name} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{name}</div>
                  <div className="text-sm text-muted">
                    {formatCurrency(amt)}
                  </div>
                </div>

                <div className="flex gap-2">
                  {editing === name ? (
                    <>
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="input input-sm input-bordered w-36"
                      />
                      <input
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        type="number"
                        step="0.01"
                        className="input input-sm input-bordered w-28"
                      />
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => saveEdit(name)}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-sm"
                        onClick={() => setEditing(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-sm btn-ghost"
                        onClick={() => startEdit(name)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-error"
                        onClick={() => deleteBudget(name)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <ConfirmModal
        isOpen={!!confirmDeleteBudget}
        title="Confirm delete"
        message={confirmDeleteBudget ? `Delete budget "${confirmDeleteBudget}"?` : ""}
        onCancel={() => setConfirmDeleteBudget(null)}
        onConfirm={() => {
          onSetBudget(confirmDeleteBudget, null);
          setConfirmDeleteBudget(null);
        }}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmClass="btn-error"
      />

      <ValidationModal
        isOpen={!!validationError}
        message={validationError}
        onClose={() => setValidationError("")}
      />
    </div>
  );
}
