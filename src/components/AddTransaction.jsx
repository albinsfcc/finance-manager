import { useState, useEffect } from "react";
import { db } from "../db";

export default function AddTransaction({ refresh }) {
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("expense");
  const [isAsset, setIsAsset] = useState(false);
  const [category, setCategory] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [allCategories, setAllCategories] = useState([]);

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

  const handleAdd = async () => {
    if (!amount || !name || !category) return;

    const trimmedCategory = category.trim();

    await db.transactions.add({
      amount: Number(amount),
      name,
      description,
      type,
      category: trimmedCategory,
      isAsset,
      date: new Date()
    });

    // 🔹 Save category if new
    const existing = await db.categories
      .where("name")
      .equalsIgnoreCase(trimmedCategory)
      .first();

    if (!existing) {
      await db.categories.add({ name: trimmedCategory });
      setAllCategories(prev => [...prev, trimmedCategory]);
    }

    // Reset form
    setAmount("");
    setName("");
    setDescription("");
    setCategory("");
    setIsAsset(false);
    setSuggestions([]);

    refresh();
  };

  return (
    <div className="card">
      <h3>Add Transaction</h3>

      <div className="form-group">
        <input
          placeholder="Amount"
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
      </div>

      <div className="form-group">
        <input
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>

      {/* 🔹 CATEGORY FIELD WITH AUTOSUGGEST */}
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

      <div className="form-group">
        <input
          placeholder="Description (optional)"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>

      <div className="form-group">
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="expense">Expense</option>
          <option value="fund">Fund</option>
        </select>
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

      <button className="primary-btn" onClick={handleAdd}>
        Add Transaction
      </button>
    </div>
  );
}