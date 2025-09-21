import React, { useState } from 'react';
import { AdminAPI, PaymentAPI } from '../../api/api';

export default function AdminLoansPanel({ loans = [], refresh, loading }) {
    const [selected, setSelected] = useState(null);
    const [userDocuments, setUserDocuments] = useState([]);
    const [adminComments, setAdminComments] = useState('');
    const [user, setUsers] = useState([]);

    async function fetchUserDetails(userId) {
        try {
            const res = await AdminAPI.getUserDetails(userId);
            setUsers(res?.data || []);
        } catch (e) {
            console.error('Failed to fetch user details:', e);
            setUsers([]);
        }
    }

    async function changeStatus(loanId, status) {
        const comments = adminComments || (status === 'APPROVED' ? 'Approved by admin' : 'Updated by admin');
        try {
            await AdminAPI.updateLoanStatus(loanId, { status, adminComments: comments });
            alert(`Loan ${status.toLowerCase()} successfully`);
            setAdminComments('');
            if (refresh) refresh();
        } catch (e) {
            console.error(e);
            alert('Failed to update loan status');
        }
    }

    async function handlePayEMI(loan) {
        try {
            // Assuming amount to pay is full EMI amount, can be adjusted as needed
            const emiAmount = loan.emiAmount || 0;

            // Call backend to create Razorpay order for EMI payment
            const orderData = await PaymentAPI.createEmiOrder({
                amount: emiAmount,
                emiId: loan.id // Assuming loan.id is emiId for now
            });

            const options = {
                key: orderData.data.razorpayKey,
                amount: emiAmount * 100,
                currency: "INR",
                name: "MicroLoan EMI Payment",
                order_id: orderData.data.orderId,
                handler: async function (response) {
                    // Verify payment on backend
                    await PaymentAPI.verifyEmiPayment({
                        razorpayOrderId: response.razorpay_order_id,
                        razorpayPaymentId: response.razorpay_payment_id,
                        razorpaySignature: response.razorpay_signature,
                        emiId: loan.id, // Note: This should be EMI ID, but using loan ID for now
                    });

                    alert("EMI payment successful");
                    if (refresh) refresh();
                },
                prefill: {
                    email: loan.user?.email || "",
                },
                theme: {
                    color: "#3399cc",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (e) {
            console.error('Failed to pay EMI:', e);
            alert('Failed to pay EMI: ' + (e.response?.data?.message || e.message));
        }
    }

    async function viewLoanDetails(loan) {
        setSelected(loan);
        setAdminComments(loan.adminComments || '');
        // Fetch user documents
        if (loan.user?.id) {
            try {
                const res = await AdminAPI.getUserDocuments(loan.user.id);
                const documents = res?.data?.data || res?.data || [];
                setUserDocuments(Array.isArray(documents) ? documents : []);
            } catch (e) {
                console.error('Failed to fetch user documents:', e);
                setUserDocuments([]);
            }
        }
    }

    function closeLoanDetails() {
        setSelected(null);
        setUserDocuments([]);
        setAdminComments('');
    }

    function getStatusColor(status) {
        switch (status) {
            case 'APPROVED': return 'status-approved';
            case 'REJECTED': return 'status-rejected';
            case 'PENDING': return 'status-pending';
            case 'VERIFIED': return 'status-verified';
            case 'NEW_VERIFIED': return 'status-new-verified';
            default: return 'status-default';
        }
    }

    return (
        <div>
            <h4>Loan Applications Management</h4>
            {loading ? <div>Loading loans...</div> : (
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Amount</th>
                            <th>Tenure</th>
                            <th>Status</th>
                            <th>Applied Date</th>
                            <th>Cibil</th>
                            <th>User Email</th>
                            <th>Document</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loans.map((l, index) => (
                            <tr key={l.id}>
                                <td>{index + 1}</td>
                                <td>
                                    <div>
                                        <strong>{l.user?.name || 'N/A'}</strong>
                                        <br />
                                        <small>{l.user?.email}</small>
                                    </div>
                                </td>
                                <td>₹{Number(l.amount || 0).toLocaleString()}</td>
                                <td>{l.tenure} months</td>
                                <td>
                                    <select
                                        value={l.status}
                                        onChange={(e) => changeStatus(l.id, e.target.value)}
                                        className="status-dropdown"
                                    >
                                        <option value="PENDING">PENDING</option>
                                        <option value="VERIFIED">VERIFIED</option>
                                        <option value="NEW_VERIFIED">NEW_VERIFIED</option>
                                        <option value="APPROVED">APPROVED</option>
                                        <option value="REJECTED">REJECTED</option>
                                    </select>
                                </td>
                                <td>{l.createdAt ? new Date(l.createdAt).toLocaleDateString() : 'N/A'}</td>
                                <td>{l.user?.cibilScore || 'Not Set'}</td>
                                <td>{l.user?.email || 'Not Set'}</td>
                                <td><button onClick={() => viewLoanDetails(l)}>view docs</button></td>
                                <td>
                                    <button className="btn small" onClick={() => viewLoanDetails(l)}>Details</button>
                                    {l.status === 'VERIFIED' && (
                                        <button className="btn small success" onClick={() => handlePayEMI(l)}>Pay EMI</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {selected && (
                <div className="modal">
                    <div className="modal-body">
                        <h4>Loan Application #{selected.id}</h4>

                        <div className="loan-details">
                            <div className="detail-section">
                                <h5>Loan Information</h5>
                                <div className="detail-row">
                                    <strong>Amount:</strong> ₹{Number(selected.amount || 0).toLocaleString()}
                                </div>
                                <div className="detail-row">
                                    <strong>Tenure:</strong> {selected.tenure} months
                                </div>
                                <div className="detail-row">
                                    <strong>Purpose:</strong> {selected.purpose || 'N/A'}
                                </div>
                                <div className="detail-row">
                                    <strong>Interest Rate:</strong> {selected.interestRate || 0}%
                                </div>
                                <div className="detail-row">
                                    <strong>Status:</strong>
                                    <span className={`status ${getStatusColor(selected.status)}`}>
                                        {selected.status}
                                    </span>
                                </div>
                                <div className="detail-row">
                                    <strong>Applied Date:</strong> {selected.createdAt ? new Date(selected.createdAt).toLocaleDateString() : 'N/A'}
                                </div>
                                <div className="detail-row">
                                    <strong>Status Updated:</strong> {selected.statusUpdatedAt ? new Date(selected.statusUpdatedAt).toLocaleDateString() : 'N/A'}
                                </div>
                            </div>

                            <div className="detail-section">
                                <h5>Applicant Information</h5>
                                <div className="detail-row">
                                    <strong>Name:</strong> {selected.user?.name || 'N/A'}
                                </div>
                                <div className="detail-row">
                                    <strong>Email:</strong> {selected.user?.email || 'N/A'}
                                </div>
                                <div className="detail-row">
                                    <strong>CIBIL Score:</strong> {selected.user?.cibilScore || 'Not Set'}
                                </div>
                                <div className="detail-row">
                                    <strong>PAN Number:</strong> {selected.user?.panNumber || 'Not Set'}
                                </div>
                                <div className="detail-row">
                                    <strong>Aadhar Number:</strong> {selected.user?.aadharNumber || 'Not Set'}
                                </div>
                            </div>

                            <div className="detail-section">
                                <h5>Documents ({userDocuments.length})</h5>
                                <div className="documents-list">
                                    {userDocuments.length === 0 ? (
                                        <div className="muted">No documents found for this user</div>
                                    ) : (
                                        userDocuments.map((doc, index) => (
                                            <div key={doc.id || index} className="document-item">
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
                            </div>

                            <div className="detail-section">
                                <h5>Admin Comments</h5>
                                <textarea
                                    value={adminComments}
                                    onChange={(e) => setAdminComments(e.target.value)}
                                    placeholder="Add admin comments..."
                                    rows="3"
                                    className="admin-comments"
                                />
                            </div>
                        </div>

                        <div className="modal-actions">
                            {selected.status === 'PENDING' && (
                                <>
                                    <button className="btn success" onClick={() => { changeStatus(selected.id, 'VERIFIED'); closeLoanDetails(); }}>
                                        Verify Application
                                    </button>
                                    <button className="btn danger" onClick={() => { changeStatus(selected.id, 'REJECTED'); closeLoanDetails(); }}>
                                        Reject Application
                                    </button>
                                </>
                            )}
                            {selected.status === 'VERIFIED' && (
                                <>
                                    <button className="btn success" onClick={() => { changeStatus(selected.id, 'NEW_VERIFIED'); closeLoanDetails(); }}>
                                        New Verify
                                    </button>
                                    <button className="btn primary" onClick={() => { changeStatus(selected.id, 'APPROVED'); closeLoanDetails(); }}>
                                        Approve & Disburse
                                    </button>
                                    <button className="btn danger" onClick={() => { changeStatus(selected.id, 'REJECTED'); closeLoanDetails(); }}>
                                        Reject Application
                                    </button>
                                </>
                            )}
                            {selected.status === 'NEW_VERIFIED' && (
                                <>
                                    <button className="btn success" onClick={() => { changeStatus(selected.id, 'APPROVED'); closeLoanDetails(); }}>
                                        Approve & Disburse
                                    </button>
                                    <button className="btn danger" onClick={() => { changeStatus(selected.id, 'REJECTED'); closeLoanDetails(); }}>
                                        Reject Application
                                    </button>
                                </>
                            )}
                            <button className="btn" onClick={closeLoanDetails}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
