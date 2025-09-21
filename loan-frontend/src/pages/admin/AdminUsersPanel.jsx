import React, { useEffect, useState } from 'react';
import { AdminAPI } from '../../api/api';

export default function AdminUsersPanel() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [userDocuments, setUserDocuments] = useState([]);
    const [showEmiModal, setShowEmiModal] = useState(false);
    const [selectedEmis, setSelectedEmis] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        setLoading(true);
        try {
            const res = await AdminAPI.getUsers({ page: 0, size: 100 });
            const data = res?.data?.data || res?.data || [];
            const usersArray = Array.isArray(data) ? data : (data.content || []);
            setUsers(usersArray);
        } catch (e) {
            console.error('Users fetch failed', e);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }

    async function updateCibil(userId) {
        const newScore = prompt('Enter new CIBIL score (300-900):');
        if (!newScore || isNaN(newScore) || newScore < 300 || newScore > 900) {
            alert('Please enter a valid CIBIL score between 300-900');
            return;
        }
        try {
            await AdminAPI.updateUserCibil(userId, newScore);
            alert('CIBIL score updated successfully');
            fetchUsers();
        } catch (e) {
            alert('Failed to update CIBIL score');
        }
    }

    async function deleteUser(userId) {
        if (!confirm('Delete this user? This will also delete all their loans and documents. This action cannot be undone.')) return;
        try {
            await AdminAPI.deleteUser(userId);
            alert('User deleted successfully');
            fetchUsers();
        } catch (e) {
            alert('Failed to delete user');
        }
    }

    async function viewUserDetails(user) {
        setSelectedUser(user);
        try {
            // Fetch comprehensive user details
            const detailsRes = await AdminAPI.getUserDetails(user.id);
            const details = detailsRes?.data?.data || {};
            setUserDetails(details);

            // Also fetch documents for backward compatibility
            const docsRes = await AdminAPI.getUserDocuments(user.id);
            const documents = docsRes?.data?.data || docsRes?.data || [];
            setUserDocuments(Array.isArray(documents) ? documents : []);
        } catch (e) {
            console.error('Failed to fetch user details:', e);
            setUserDetails(null);
            setUserDocuments([]);
        }
    }

    function viewUserEmis(user) {
        if (userDetails && userDetails.emis) {
            setSelectedEmis(userDetails.emis);
            setShowEmiModal(true);
        }
    }

    function closeEmiModal() {
        setShowEmiModal(false);
        setSelectedEmis([]);
    }



    function closeUserDetails() {
        setSelectedUser(null);
        setUserDetails(null);
        setUserDocuments([]);
    }

    return (
        <div>
            <h4>Users Management</h4>
            {loading ? (
                <div>Loading users...</div>
            ) : (
                <table className="table small">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>CIBIL Score</th>
                            <th>Role</th>
                            <th>Total Loans</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u, index) => (
                            <tr key={u.id}>
                                <td>{index + 1}</td>
                                <td>{u.name || 'N/A'}</td>
                                <td>{u.email}</td>
                                <td>{u.cibilScore || 'Not Set'}</td>
                                <td>{u.role || 'USER'}</td>
                                <td>{u.totalLoans || 0}</td>
                                <td>
                                    <button
                                        className="btn small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            viewUserDetails(u);
                                        }}
                                    >
                                        View Details
                                    </button>
                                    <button
                                        className="btn small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            viewUserEmis(u);
                                        }}
                                    >
                                        View EMIs
                                    </button>
                                    <button
                                        className="btn small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            updateCibil(u.id);
                                        }}
                                    >
                                        Update CIBIL
                                    </button>
                                    <button
                                        className="btn small muted"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteUser(u.id);
                                        }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {selectedUser && userDetails && (
                <div className="modal">
                    <div className="modal-body">
                        <h4>Comprehensive User Details: {selectedUser.name}</h4>

                        {/* Basic User Information */}
                        <div className="user-details">
                            <h5>Basic Information</h5>
                            <div className="detail-row"><strong>ID:</strong> {userDetails.id}</div>
                            <div className="detail-row"><strong>Name:</strong> {userDetails.name || 'N/A'}</div>
                            <div className="detail-row"><strong>Email:</strong> {userDetails.email}</div>
                            <div className="detail-row"><strong>Mobile:</strong> {userDetails.mobile || 'N/A'}</div>
                            <div className="detail-row"><strong>CIBIL Score:</strong> {userDetails.cibilScore || 'Not Set'}</div>
                            <div className="detail-row"><strong>PAN:</strong> {userDetails.pan || 'N/A'}</div>
                            <div className="detail-row"><strong>Aadhar:</strong> {userDetails.aadhar || 'N/A'}</div>
                            <div className="detail-row"><strong>Role:</strong> {userDetails.role}</div>
                            <div className="detail-row"><strong>Active:</strong> {userDetails.active ? 'Yes' : 'No'}</div>
                            <div className="detail-row"><strong>Created:</strong> {userDetails.createdAt ? new Date(userDetails.createdAt).toLocaleDateString() : 'N/A'}</div>
                        </div>

                        {/* Loan Statistics */}
                        <div className="user-details">
                            <h5>Loan Statistics</h5>
                            <div className="detail-row"><strong>Total Loans:</strong> {userDetails.totalLoans}</div>
                            <div className="detail-row"><strong>Approved Loans:</strong> {userDetails.approvedLoans}</div>
                            <div className="detail-row"><strong>Pending Loans:</strong> {userDetails.pendingLoans}</div>
                            <div className="detail-row"><strong>Rejected Loans:</strong> {userDetails.rejectedLoans}</div>
                            <div className="detail-row"><strong>Total Loan Amount:</strong> ₹{userDetails.totalLoanAmount?.toLocaleString()}</div>
                            <div className="detail-row"><strong>Approved Loan Amount:</strong> ₹{userDetails.approvedLoanAmount?.toLocaleString()}</div>
                        </div>

                        {/* EMI Statistics */}
                        <div className="user-details">
                            <h5>EMI Statistics</h5>
                            <div className="detail-row"><strong>Total EMIs:</strong> {userDetails.totalEmis}</div>
                            <div className="detail-row"><strong>Paid EMIs:</strong> {userDetails.paidEmis}</div>
                            <div className="detail-row"><strong>Pending EMIs:</strong> {userDetails.pendingEmis}</div>
                            <div className="detail-row"><strong>Total EMI Amount:</strong> ₹{userDetails.totalEmiAmount?.toLocaleString()}</div>
                            <div className="detail-row"><strong>Paid EMI Amount:</strong> ₹{userDetails.paidEmiAmount?.toLocaleString()}</div>
                            <div className="detail-row"><strong>Pending EMI Amount:</strong> ₹{userDetails.pendingEmiAmount?.toLocaleString()}</div>
                        </div>

                        {/* Documents */}
                        <h5>Documents ({userDetails.totalDocuments})</h5>
                        <div className="documents-list">
                            {userDetails.documents && userDetails.documents.length > 0 ? (
                                userDetails.documents.map((doc, index) => (
                                    <div key={doc.id || index} className="document-item">
                                        <div className="doc-info">
                                            <strong>{doc.documentType || 'Document'}</strong><br />
                                            <small>Uploaded: {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : 'N/A'}</small>
                                        </div>
                                        <button
                                            className="btn small"
                                            onClick={() => window.open(doc.url, '_blank')}
                                        >
                                            View Document
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="muted">No documents found</div>
                            )}
                        </div>

                        <div className="modal-actions">
                            <button className="btn" onClick={() => viewUserEmis(selectedUser)}>View All EMIs</button>
                            <button className="btn" onClick={() => updateCibil(selectedUser.id)}>Update CIBIL</button>
                            <button className="btn muted" onClick={() => deleteUser(selectedUser.id)}>Delete User</button>
                            <button className="btn" onClick={closeUserDetails}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* EMI Details Modal */}
            {showEmiModal && (
                <div className="modal">
                    <div className="modal-body">
                        <div className="modal-header">
                            <h4>All EMIs for {selectedUser?.name}</h4>
                            <button className="close-btn" onClick={closeEmiModal}>×</button>
                        </div>

                        <div className="emi-table-container">
                            <table className="table small">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Loan ID</th>
                                        <th>Loan Purpose</th>
                                        <th>Amount</th>
                                        <th>Due Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedEmis.map(emi => (
                                        <tr key={emi.id}>
                                            <td>{emi.id}</td>
                                            <td>{emi.loanId}</td>
                                            <td>{emi.loanPurpose}</td>
                                            <td>₹{emi.amount?.toLocaleString()}</td>
                                            <td>{emi.dueDate ? new Date(emi.dueDate).toLocaleDateString() : 'N/A'}</td>
                                            <td>
                                                <span className={`status ${emi.status === 'PAID' ? 'status-approved' : 'status-pending'}`}>
                                                    {emi.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="modal-actions">
                            <button className="btn" onClick={closeEmiModal}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

