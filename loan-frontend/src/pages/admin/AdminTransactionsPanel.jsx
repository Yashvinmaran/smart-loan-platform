
import React, { useEffect, useState } from 'react';
import api from '../../api/api';

export default function AdminTransactionsPanel() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchTransactions(); }, []);

    async function fetchTransactions() {
        setLoading(true);
        try {
            // Try to get transactions from loans (since transactions are created during disbursement)
            const loansRes = await api.get("/api/admin/loans?page=0&size=50");
            const loansData = loansRes.data?.data || loansRes.data || {};
            const loans = Array.isArray(loansData.content) ? loansData.content :
                         Array.isArray(loansData) ? loansData : [];

            // Extract transaction-like data from loans
            const transactionData = [];
            if (Array.isArray(loans)) {
                loans.forEach(loan => {
                    if (loan && loan.status === 'APPROVED') {
                        transactionData.push({
                            id: `loan-${loan.id}`,
                            type: 'DISBURSEMENT',
                            amount: loan.amount || 0,
                            user: loan.user?.name || loan.user?.email || 'Unknown',
                            date: loan.statusUpdatedAt || loan.createdAt,
                            status: 'SUCCESS',
                            reference: `LOAN-${loan.id}`
                        });
                    }
                });
            }

            setTransactions(transactionData.slice(0, 20)); // Show latest 20 transactions
        } catch (e) {
            console.error('Failed to fetch transactions:', e);
            setTransactions([]);
        }
        setLoading(false);
    }

    return (
        <div>
            <h4>Recent Transactions</h4>
            {loading ? (
                <div>Loading transactions...</div>
            ) : (
                <div className="transaction-list">
                    {transactions.length === 0 ? (
                        <div className="muted">No transactions found</div>
                    ) : (
                        <table className="table small">
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>User</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Reference</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((tx, index) => (
                                    <tr key={tx.id || index}>
                                        <td>{tx.type}</td>
                                        <td>{tx.user}</td>
                                        <td>₹{Number(tx.amount).toLocaleString()}</td>
                                        <td>{tx.date ? new Date(tx.date).toLocaleDateString() : 'N/A'}</td>
                                        <td>
                                            <span className={`status ${tx.status.toLowerCase()}`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td>{tx.reference}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}
