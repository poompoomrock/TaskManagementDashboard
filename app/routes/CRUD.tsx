import React, { useState } from "react";

interface Item {
  id: number;
  name: string;
}

const CRUD: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  // Create หรือ Update
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId !== null) {
      // Update
      setItems(
        items.map((item) =>
          item.id === editingId ? { ...item, name } : item
        )
      );
      setEditingId(null);
    } else {
      // Create
      const newItem: Item = {
        id: Date.now(),
        name,
      };
      setItems([...items, newItem]);
    }
    setName("");
  };

  // Delete
  const handleDelete = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // Edit
  const handleEdit = (item: Item) => {
    setName(item.name);
    setEditingId(item.id);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>CRUD Operations</h2>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">
          {editingId !== null ? "Update" : "Add"}
        </button>
      </form>

      {/* List */}
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name}{" "}
            <button onClick={() => handleEdit(item)}>Edit</button>{" "}
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CRUD;
