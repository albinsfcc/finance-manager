import { useState, useEffect } from "react";
import { db } from "../db";

export default function AddTransaction({ refresh, editingTxn, clearEditing }) {
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isAsset, setIsAsset] = useState(false);
  const [category, setCategory] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [activeTab, setActiveTab] = useState("expense"); // "expense" | "fund"
  const [showAdvanced, setShowAdvanced] = useState(false);

  const isEditing = !!editingTxn;

  // 🔹 Load all categories once
  useEffect(() => {
    const loadCategories = async () => {
      const data = await db.categories.toArray();
      setAllCategories(data.map(c => c.name));
    };
    loadCategories();
  }, []);

  // 🔹 Filter suggestions when category changes
  useEffect(() => {
    if (!category.trim()) {
      setSuggestions([]);
      return;
    }

    const filtered = allCategories.filter(name =>
      name.toLowerCase().includes(category.toLowerCase())
    );

    setSuggestions(filtered);
  }, [category, allCategories]);

  // 🔹 Populate form when editing
  useEffect(() => {
    if (!editingTxn) return;

    setAmount(editingTxn.amount != null ? String(editingTxn.amount) : "");
    setName(editingTxn.name || "");
    setDescription(editingTxn.description || "");
    setCategory(editingTxn.category || "");
    setIsAsset(!!editingTxn.isAsset);
    setActiveTab(editingTxn.type === "fund" ? "fund" : "expense");
    setShowAdvanced(true);
  }, [editingTxn]);

  const resetForm = () => {
    setAmount("");
    setName("");
    setDescription("");
    setCategory("");
    setIsAsset(false);
    setSuggestions([]);
    setActiveTab("expense");
    setShowAdvanced(false);
  };

  const handleSubmit = async () => {
    if (!amount || !name || !category) return;

    const trimmedCategory = category.trim();

    const now = new Date();

    const baseData = {
      amount: Number(amount),
      name,
      description,
      type: activeTab === "expense" ? "expense" : "fund",
      category: trimmedCategory,
      isAsset
    };

    if (isEditing && editingTxn?.id != null) {
      await db.transactions.update(editingTxn.id, {
        ...baseData,
        lastModified: now
      });
    } else {
      await db.transactions.add({
        ...baseData,
        creationDate: now,
        lastModified: now,
        date: now
      });
    }

    // 🔹 Save category if new
    const existing = await db.categories
      .where("name")
      .equalsIgnoreCase(trimmedCategory)
      .first();

    if (!existing) {
      await db.categories.add({ name: trimmedCategory });
      setAllCategories(prev => [...prev, trimmedCategory]);
    }

    resetForm();
    if (clearEditing) clearEditing();
    refresh();
  };

  return (
    <div className="card" id="add-transaction">
      <h3>{isEditing ? "Update Transaction" : "Add Transaction"}</h3>

      <div className="txn-tabs">
        <button
          type="button"
          className={`txn-tab  expense-tab ${activeTab === "expense" ? "active" : ""}`}
          onClick={() => setActiveTab("expense")}
        >
          Expenditure
        </button>
        <button
          type="button"
          className={`txn-tab ${activeTab === "fund" ? "active" : ""}`}
          onClick={() => setActiveTab("fund")}
        >
          Income
        </button>
      </div>

      <div className="form-group">
        <input
          placeholder="Amount"
          type="tel"
          inputMode="decimal"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
      </div>

      <div className="form-group">
        <input
          placeholder="Label"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>

      {/* Category is mandatory and always visible */}
      <div className="form-group category-wrapper">
        <input
          placeholder="Category"
          value={category}
          onChange={e => setCategory(e.target.value)}
        />

        {suggestions.length > 0 && (
          <div className="suggestions-box">
            {suggestions.map((s, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => {
                  setCategory(s);
                  setSuggestions([]);
                }}
              >
                {s}
              </div>
            ))}
          </div>
        )}
      </div>

      {!isEditing && (
        <button
          type="button"
          className="txn-advanced-toggle"
          onClick={() => setShowAdvanced(prev => !prev)}
        >
          <span className={`txn-advanced-icon ${showAdvanced ? "open" : ""}`}>+</span>
          <span className="txn-advanced-label">
            {showAdvanced ? "Hide details" : "More details"}
          </span>
        </button>
      )}

      {(showAdvanced || isEditing) && (
        <div className="txn-advanced">
          <div className="form-group">
            <input
              placeholder="Description (optional)"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <div className="asset-row">
            <label className="checkbox-wrapper">
              <input
                type="checkbox"
                checked={isAsset}
                onChange={e => setIsAsset(e.target.checked)}
              />
              <span>Mark as Asset</span>
            </label>
          </div>
        </div>
      )}

      <button className="primary-btn" onClick={handleSubmit}>
        {isEditing ? "Update Transaction" : "Add Transaction"}
      </button>
    </div>
  );
}