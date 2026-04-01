import { useState } from "react";
import ConfirmModal from "../components/ConfirmModal";
import ValidationModal from "../components/ValidationModal";

export default function CategoriesPage({
  categories,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
}) {
  const [newName, setNewName] = useState("");
  const [editing, setEditing] = useState(null);
  const [editName, setEditName] = useState("");
  const [validationError, setValidationError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleAdd = (e) => {
    e.preventDefault();
    const v = newName.trim();
    if (!v) {
      setValidationError("Enter a category name");
      return;
    }
    onAddCategory(v);
    setNewName("");
  };

  const startEdit = (cat) => {
    setEditing(cat);
    setEditName(cat);
  };

  const saveEdit = (oldName) => {
    const v = editName.trim();
    if (!v) {
      setValidationError("Enter a new name");
      return;
    }
    onEditCategory(oldName, v);
    setEditing(null);
  };

  const requestDelete = (cat) => {
    if (cat === "Other") {
      setValidationError('Cannot delete "Other" category');
      return;
    }
    setConfirmDelete(cat);
  };

  return (
    <div className="card bg-base-100 p-4">
      <h3 className="text-lg font-bold mb-2">Categories</h3>

      <form className="flex gap-2 mb-4" onSubmit={handleAdd}>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New category"
          className="input input-bordered"
        />
        <button className="btn btn-primary">Add</button>
      </form>

      <div className="space-y-2">
        {categories.map((cat) => (
          <div key={cat} className="flex items-center justify-between">
            <div className="font-medium">{cat}</div>
            <div className="flex gap-2">
              {editing === cat ? (
                <>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="input input-sm input-bordered w-36"
                  />
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => saveEdit(cat)}
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
                    onClick={() => startEdit(cat)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => requestDelete(cat)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        isOpen={!!confirmDelete}
        title="Confirm delete"
        message={confirmDelete ? `Delete category "${confirmDelete}"? Transactions will be moved to Other.` : ""}
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => {
          onDeleteCategory(confirmDelete);
          setConfirmDelete(null);
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
