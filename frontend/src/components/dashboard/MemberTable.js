import React, { useState } from 'react';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import memberService from '../../services/memberService';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

export default function MemberTable({ members = [], refresh }) {
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const tableStyle = {
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 0 10px rgba(0,0,0,0.05)',
  };

  const tableHeaderStyle = {
    backgroundColor: '#343a40',
    color: 'white',
  };

  const tableRowStyle = {
    transition: 'background-color 0.2s',
    cursor: 'pointer',
  };

  const formatID = (id) => {
    return String(id).padStart(4, '0');
  };

  async function onDelete(id) {
    if (!window.confirm('Apakah Anda yakin ingin menghapus anggota ini?')) return;

    setDeletingId(id);
    setError(null);
    try {
      await memberService.deleteMember(id);
      await refresh();
    } catch (err) {
      console.error("Error deleting member:", err);
      setError(err.response?.data?.message || 'Gagal menghapus anggota.');
    } finally {
      setDeletingId(null);
    }
  }

  const handleEditClick = (id) => {
    navigate(`/admin/members/edit/${id}`);
  };

  const handleViewClick = (id) => {
    navigate(`/admin/members/view/${id}`);
  };

  return (
    <div className="table-responsive" style={tableStyle}>
      {error && <Alert variant="danger">{error}</Alert>}
      <Table striped hover responsive>
        <thead style={tableHeaderStyle}>
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>Email</th>
            <th>Telepon</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {members.length > 0 ? (
            members.map(m => (
              <tr
                key={m.id}
                style={tableRowStyle}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <td>{formatID(m.id)}</td>
                <td>{m.fullName}</td>
                <td>{m.email}</td>
                <td>{m.phone}</td>
                <td>
                  <Button
                    size="sm"
                    variant="info"
                    onClick={() => handleViewClick(m.id)}
                  >
                    <FaEye />
                  </Button>
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => handleEditClick(m.id)}
                    className="ms-2"
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => onDelete(m.id)}
                    disabled={deletingId === m.id}
                    className="ms-2"
                  >
                    {deletingId === m.id ? (
                      <Spinner as="span" animation="border" size="sm" />
                    ) : (
                      <FaTrash />
                    )}
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center">Tidak ada data anggota.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}