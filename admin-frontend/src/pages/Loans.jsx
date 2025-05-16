import { useEffect, useState } from 'react';
import { getLoans, updateLoanStatus } from '../services/adminApi';
import '../styles/Loans.css';

function Loans() {
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const data = await getLoans();
        setLoans(data);
      } catch (err) {
        console.error('Failed to fetch loans:', err);
      }
    };
    fetchLoans();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateLoanStatus(id, { status });
      setLoans(loans.map((loan) =>
        loan.id === id ? { ...loan, status } : loan
      ));
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };
  let idx = 1;
  return (
    <div className="loans">
      <h2>Manage Loans</h2>
      <table className="loans-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Status</th>
            <th>Documents</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr key={loan.id}>
              <td>{idx++}</td>
              <td>{loan.userId}</td>
              <td>{loan.amount}</td>
              <td>{loan.type}</td>
              <td>
                <span className={`status-${loan.status.toLowerCase()}`}>
                  {loan.status}
                </span>
              </td>
              <td>
                <a href={loan.aadharFile} target="_blank">Aadhar</a> | 
                <a href={loan.panFile} target="_blank">PAN</a>
              </td>
              <td>
                <select
                  value={loan.status}
                  onChange={(e) => handleStatusChange(loan.id, e.target.value)}
                >
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Loans;