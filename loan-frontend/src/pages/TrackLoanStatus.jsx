// src/pages/TrackLoanStatus.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyLoans, PaymentAPI } from "@/api/api.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Loader, Home } from "lucide-react";
import { useToast } from "@/components/ui/use-toast.jsx";
import Navbar from "../components/Navbar";
import "../styles/trackloanstatus.css";
import "../styles/navbar.css";

export default function TrackLoanStatus() {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchLoans = async () => {
            try {
                const res = await getMyLoans();
                const loansData = res?.data || res || [];
                setLoans(Array.isArray(loansData) ? loansData : []);
            } catch (err) {
                console.error("Error fetching loans:", err);
                setLoans([]);
            } finally {
                setLoading(false);
            }
        };
        fetchLoans();
    }, []);

    async function handlePay(loan) {
        try {
            const amount = loan.emi || loan.amount;
            const username = loan.user?.name || "user";
            const createOrderRes = await PaymentAPI.createEmiOrder({ amount, emiId: loan.emiId || loan.id });
            const { orderId, razorpayKey } = createOrderRes.data;

            const options = {
                key: razorpayKey,
                amount: amount * 100,
                currency: "INR",
                name: "Microloan",
                description: "Loan EMI Payment",
                order_id: orderId,
                handler: async function (response) {
                    try {
                        await PaymentAPI.verifyEmiPayment({
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                            emiId: loan.emiId || loan.id,
                        });
                        toast({ title: "Payment successful ✅" });
                        const updatedLoans = await getMyLoans();
                        setLoans(updatedLoans?.data || updatedLoans || []);
                    } catch (err) {
                        toast({ title: "Payment verification failed", description: err.message, variant: "destructive" });
                    }
                },
                prefill: { name: username },
                theme: { color: "#10b981" },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            toast({ title: "Payment initiation failed", description: err.message, variant: "destructive" });
        }
    }

    if (loading) {
        return (
            <div className="loading-container">
                <Loader className="animate-spin h-12 w-12 text-emerald-400" />
            </div>
        );
    }

    return (
        <div className="trackloanstatus-container">
            <Navbar />
            <div className="trackloanstatus-header">
                <h1>My Loan Applications</h1>
            </div>

            {loans.length === 0 ? (
                <p className="text-center text-gray-400 text-lg">No loans found.</p>
            ) : (
                <div className="loan-grid">
                    {loans.map((loan) => (
                        <Card key={loan.id} className="loan-card">
                            <CardHeader>
                                <CardTitle>Loan #{loan.id}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p><strong>Amount:</strong> ₹{loan.amount}</p>
                                <p><strong>Tenure:</strong> {loan.tenure} months</p>
                                <p>
                                    <strong>Status:</strong>
                                    <span className={`status-badge ${loan.status.toLowerCase()}`}>
                                        {loan.status}
                                    </span>
                                </p>
                                {loan.emi && <p><strong>EMI:</strong> ₹{loan.emi}</p>}
                                {loan.approvedDate && <p><strong>Approved:</strong> {loan.approvedDate}</p>}
                                {loan.status === "APPROVED" && (
                                    <Button onClick={() => handlePay(loan)} className="pay-btn">
                                        Pay EMI
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Link to="/" className="home-button">
                <Home size={26} />
            </Link>
        </div>
    );
}
