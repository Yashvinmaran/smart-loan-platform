import React, { useEffect, useState } from 'react';
import { AdminAPI } from '../../api/api';

export default function AdminDocumentsPanel() {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userDocs, setUserDocs] = useState([]);

    useEffect(() => { fetchRecentDocuments(); }, []);

    async function fetchRecentDocuments() {
        setLoading(true);
        try {
            // Get recent loans to find users with documents
            const loansRes = await AdminAPI.getLoans({ page: 0, size: 20 });
            const loansData = loansRes.data?.data || loansRes.data || {};
            const loans = Array.isArray(loansData.content) ? loansData.content :
                         Array.isArray(loansData) ? loansData : [];

            // Collect all documents from recent loans
            const allDocs = [];
            if (Array.isArray(loans)) {
                for (const loan of loans.slice(0, 5)) { // Check first 5 users
                    if (loan && loan.user?.id) {
                        try {
                            const userDocsRes = await AdminAPI.getUserDocuments(loan.user.id);
                            const userDocuments = userDocsRes.data?.data || userDocsRes.data || [];
                            if (Array.isArray(userDocuments)) {
                                userDocuments.forEach(doc => {
                                    allDocs.push({
                                        ...doc,
                                        userName: loan.user?.name || loan.user?.email || 'Unknown',
                                        userEmail: loan.user?.email || '',
                                        userId: loan.user.id
                                    });
                                });
                            }
                        } catch (e) {
                            console.error(`Failed to fetch docs for user ${loan.user.id}:`, e);
                        }
                    }
                }
            }
            setDocs(allDocs.slice(0, 10)); // Show latest 10 documents
        } catch (e) {
            console.error('Failed to fetch recent documents:', e);
            setDocs([]);
        }
        setLoading(false);
    }

    async function viewUserDocuments(userId, userName) {
        try {
            const res = await AdminAPI.getUserDocuments(userId);
            const documents = res.data?.data || res.data || [];
            setUserDocs(Array.isArray(documents) ? documents : []);
            setSelectedUser({ id: userId, name: userName });
        } catch (e) {
            console.error('Failed to fetch user documents:', e);
            setUserDocs([]);
        }
    }

    function closeUserDocs() {
        setSelectedUser(null);
        setUserDocs([]);
    }

    return (
        <div>
            <h4>Recent Documents</h4>
            {loading ? (
                <div>Loading documents...</div>
            ) : (
                <div className="doc-list">
                    {docs.length === 0 ? (
                        <div className="muted">No documents found</div>
                    ) : (
                        <table className="table small">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Document Type</th>
                                    <th>Uploaded Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {docs.map((doc, index) => (
                                    <tr key={doc.id || index}>
                                        <td>{doc.userName}</td>
                                        <td>{doc.type || 'Unknown'}</td>
                                        <td>{doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'N/A'}</td>
                                        <td>
                                            <button
                                                className="btn small"
                                                onClick={() => window.open(doc.url, '_blank')}
                                            >
                                                View
                                            </button>
                                            <button
                                                className="btn small"
                                                onClick={() => viewUserDocuments(doc.user?.id, doc.userName)}
                                            >
                                                All Docs
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {selectedUser && (
                <div className="modal">
                    <div className="modal-body">
                        <h4>{selectedUser.name}'s Documents</h4>
                        <div className="doc-grid">
                            {userDocs.length === 0 ? (
                                <div className="muted">No documents found for this user</div>
                            ) : (
                                userDocs.map((doc, index) => (
                                    <div key={doc.id || index} className="doc-item">
                                        <div className="doc-info">
                                            <strong>{doc.type || 'Document'}</strong>
                                            <br />
                                            <small>Uploaded: {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'N/A'}</small>
                                        </div>
                                        <button
                                            className="btn small"
                                            onClick={() => window.open(doc.url, '_blank')}
                                        >
                                            View Document
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="modal-actions">
                            <button className="btn" onClick={closeUserDocs}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
