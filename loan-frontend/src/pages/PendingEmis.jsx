// src/pages/PendingEmis.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyLoans, getMyEmis, PaymentAPI } from "@/api/api.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { useToast } from "@/components/ui/use-toast.jsx";
import { Home, Loader } from "lucide-react";
import "../styles/pendingemis.css";
import Navbar from "../components/Navbar";
import { useRazorpay } from "react-razorpay";


import "../styles/navbar.css";

export default function PendingEmis() {
    const { toast } = useToast();
    const [loans, setLoans] = useState([]);
    const [emis, setEmis] = useState([]);
    const [loading, setLoading] = useState(false);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const { error, isLoading, Razorpay } = useRazorpay();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const loanData = await getMyLoans();
                setLoans(loanData.data || []);
                const emiData = await getMyEmis();
                setEmis(emiData.data || []);
            } catch (err) {
                console.error(err);
                toast({ title: "Error fetching EMI details", variant: "destructive" });
            }
        };
        fetchData();
    }, []);

    const handlePayEmi = async (emiId, amount) => {
        
        setPaymentLoading(true);
        try {
            const orderResponse = await PaymentAPI.createEmiOrder({
                amount: amount,
                currency: "INR",
                emiId: emiId,
            });
            
            const { orderId, razorpayKey } = orderResponse?.data?.data;
            
            const options = {
                key: razorpayKey,
                amount: amount * 100, 
                currency: "INR",
                name: "Microloan EMI Payment",
                description: `EMI Payment for EMI ID: ${emiId}`,
                order_id: orderId,
                handler: async (response) => {
                    try {
                        
                        await PaymentAPI.verifyEmiPayment({
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                            emiId: emiId,
                        });
                        toast({ title: "EMI Paid Successfully ✅" });
                        const emiData = await getMyEmis();
                        setEmis(emiData.data || []);
                    } catch (verifyError) {
                        toast({ title: "Payment verification failed", description: verifyError.message, variant: "destructive" });
                    }
                },
                prefill: {
                    name: "User",
                    email: "user@example.com",
                },
                theme: {
                    color: "#3399cc",
                },
            };
            
            const rzp = new Razorpay(options);
            
           
            rzp.open();
        } catch (err) {
            toast({ title: "Payment initiation failed", description: err.message, variant: "destructive" });
        } finally {
            setPaymentLoading(false);
        }
    };

    // Calculate totals
    const totalLoan = Array.isArray(loans) ? loans.reduce((sum, loan) => sum + loan.amount, 0) : 0;
    const totalPaid = Array.isArray(emis) ? emis.filter((e) => e.status === "PAID").reduce((sum, e) => sum + e.amount, 0) : 0;
    const totalPending = Array.isArray(emis) ? emis.filter((e) => e.status === "PENDING").reduce((sum, e) => sum + e.amount, 0) : 0;

    return (
        <div className="pendingemis-container">
            <Navbar />
            <div className="pendingemis-header">
                <h1>My EMIs</h1>
            </div>

            {/* Loan Summary */}
            <Card className="summary-card">
                <CardHeader>
                    <CardTitle>Loan Summary</CardTitle>
                </CardHeader>
                <CardContent className="summary-grid">
                    <div>
                        <h3>Total Loan</h3>
                        <p className="text-emerald-400">₹{totalLoan}</p>
                    </div>
                    <div>
                        <h3>Paid</h3>
                        <p className="text-green-400">₹{totalPaid}</p>
                    </div>
                    <div>
                        <h3>Pending</h3>
                        <p className="text-red-400">₹{totalPending}</p>
                    </div>
                </CardContent>
            </Card>

            {/* EMI List */}
            <Card className="emi-card">
                <CardHeader>
                    <CardTitle>Pending EMIs</CardTitle>
                </CardHeader>
                <CardContent>
                    {emis.filter((e) => e.status === "PENDING").length === 0 ? (
                        <p className="text-gray-400 text-center">No pending EMIs available.</p>
                    ) : (
                        <div className="emi-table-container">
                            <table className="emi-table">
                                <thead>
                                    <tr>
                                        <th>Loan ID</th>
                                        <th>Amount</th>
                                        <th>Due Date</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {emis.filter((e) => e.status === "PENDING").map((emi) => (
                                        <tr key={emi.id}>
                                            <td>#{emi.loanId}</td>
                                            <td>₹{emi.amount}</td>
                                            <td>{emi.dueDate}</td>
                                            <td className="pending-status">{emi.status}</td>
                                            <td>
                                                <Button
                                                    onClick={() => handlePayEmi(emi.id, emi.amount)}
                                                    disabled={paymentLoading}
                                                    className="pay-btn"
                                                >
                                                    {paymentLoading ? <Loader className="animate-spin w-4 h-4 mr-1" /> : "Pay EMI"}
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Link to="/" className="home-button">
                <Home size={24} />
            </Link>
        </div>
    );
}
