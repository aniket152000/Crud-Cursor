import React, { useState, useMemo } from 'react';
import './App.css';

function generateEmployeeId(existingIds) {
  let id;
  do {
    id = Math.floor(100000 + Math.random() * 900000).toString();
  } while (existingIds.includes(id));
  return id;
}

function EmployeeForm({ onSubmit, editingEmployee, onCancel }) {
  const [name, setName] = useState(editingEmployee ? editingEmployee.name : '');
  const [role, setRole] = useState(editingEmployee ? editingEmployee.role : '');

  React.useEffect(() => {
    if (editingEmployee) {
      setName(editingEmployee.name);
      setRole(editingEmployee.role);
    } else {
      setName('');
      setRole('');
    }
  }, [editingEmployee]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) return;
    onSubmit({ name: name.trim(), role: role.trim() });
    setName('');
    setRole('');
  };

  return (
    <form className="employee-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Employee Name"
        value={name}
        onChange={e => setName(e.target.value)}
        maxLength={50}
        required
      />
      <input
        type="text"
        placeholder="Role"
        value={role}
        onChange={e => setRole(e.target.value)}
        maxLength={30}
        required
      />
      <button type="submit">{editingEmployee ? 'Update' : 'Add'} Employee</button>
      {editingEmployee && <button type="button" onClick={onCancel}>Cancel</button>}
    </form>
  );
}

function EmployeeList({ employees, onEdit, onDelete }) {
  if (employees.length === 0) return <div className="no-employees">No employees found.</div>;
  return (
    <table className="employee-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {employees.map(emp => (
          <tr key={emp.id}>
            <td>{emp.id}</td>
            <td>{emp.name}</td>
            <td>{emp.role}</td>
            <td>
              <button onClick={() => onEdit(emp)}>Edit</button>
              <button onClick={() => onDelete(emp.id)} className="delete">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function App() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [editingEmployee, setEditingEmployee] = useState(null);

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp =>
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.role.toLowerCase().includes(search.toLowerCase()) ||
      emp.id.includes(search)
    );
  }, [employees, search]);

  const handleAddOrUpdate = (data) => {
    if (editingEmployee) {
      setEmployees(emps => emps.map(emp =>
        emp.id === editingEmployee.id ? { ...emp, ...data } : emp
      ));
      setEditingEmployee(null);
    } else {
      const id = generateEmployeeId(employees.map(e => e.id));
      setEmployees(emps => [...emps, { id, ...data }]);
    }
  };

  const handleEdit = (emp) => setEditingEmployee(emp);
  const handleDelete = (id) => {
    setEmployees(emps => emps.filter(emp => emp.id !== id));
    if (editingEmployee && editingEmployee.id === id) setEditingEmployee(null);
  };
  const handleCancelEdit = () => setEditingEmployee(null);

  return (
    <div className="crud-app">
      <h1>Employee Manager</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name, role, or ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <EmployeeForm
        onSubmit={handleAddOrUpdate}
        editingEmployee={editingEmployee}
        onCancel={handleCancelEdit}
      />
      <EmployeeList
        employees={filteredEmployees}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default App;
