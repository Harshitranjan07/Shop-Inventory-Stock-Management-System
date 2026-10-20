import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/products" className="nav-brand">
          <span className="logo-icon">📦</span>
          <span>Shop Inventory</span>
        </NavLink>

        {user ? (
          <>
            <ul className="nav-links">
              {}
              <li>
                <NavLink to="/products">Products</NavLink>
              </li>
              <li>
                <NavLink to="/stock/in">Stock In</NavLink>
              </li>
              <li>
                <NavLink to="/stock/out">Stock Out</NavLink>
              </li>
              <li>
                <NavLink to="/low-stock">Low Stock</NavLink>
              </li>

              {}
              {user.role === 'admin' && (
                <>
                  <li>
                    <NavLink to="/admin/suppliers">Suppliers</NavLink>
                  </li>
                  <li>
                    <NavLink to="/admin/dashboard">Dashboard</NavLink>
                  </li>
                </>
              )}
            </ul>

            <div className="nav-user">
              <span className="user-name">{user.name}</span>
              <span className={`role-badge ${user.role}`}>{user.role}</span>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                Logout
              </button>
            </div>
          </>
        ) : (
          <ul className="nav-links">
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
            <li>
              <NavLink to="/register">Register Staff</NavLink>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
