import { useEffect, useState } from 'react';
import { getLoans, updateLoanStatus, deleteLoan } from '../services/adminApi';
import '../styles/Loans.css';
import image from '../assets/delete.png';

function Loans() {
  const [loans, setLoans] = useState([]);

  useEffect(() => {
      const fetchLoans = async () => {
        try {
          const data = await getLoans();
          console.log('Fetched loans data:', data);
          setLoans(data);
        } catch (err) {
          console.error('Failed to fetch loans:', err);
        }
      };
    fetchLoans();
  }, []);

  const handleStatusChange = async (_id, status) => {
    console.log('handleStatusChange called with:', _id, status);
    if (!_id || !status) {
      console.error('Invalid loan ID or status:', _id, status);
      return;
    }
    try {
      await updateLoanStatus(_id, { status });
      setLoans(loans.map((loan) =>
        loan.loanId === _id ? { ...loan, status } : loan
      ));
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDelete = async (loanId) => {
    if (!loanId) {
      console.error('Invalid loan ID for deletion:', loanId);
      return;
    }
    try {
      await deleteLoan(loanId);
      setLoans(loans.filter(loan => loan.loanId !== loanId));
      console.log(`Loan with ID ${loanId} deleted successfully.`);
    } catch (err) {
      console.error('Failed to delete loan:', err);
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
            <th>DEL</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan, index) => (
            <tr key={loan.loanId ? loan.loanId : index}>
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
                <a href={loan.aadharFile} target="_blank" rel="noopener noreferrer">Aadhar</a> | 
                <a href={loan.panFile} target="_blank" rel="noopener noreferrer">PAN</a>
              </td>
              <td>
                <select
                  value={loan.status}
                  onChange={(e) => handleStatusChange(loan.loanId, e.target.value)}
                  disabled={!loan.loanId}
                  title={!loan.loanId ? "Loan ID missing, cannot update status" : ""}
                >
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </td>
              <td>
                <button onClick={() => handleDelete(loan.loanId)}>
                  <img src={image} alt="Delete" style={{height:'20px',width:'20px'}}/>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Loans;
