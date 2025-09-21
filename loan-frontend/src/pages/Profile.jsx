// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    getUserProfile,
    updateUserProfile,
    getUserDocuments,
    uploadDocument,
    deleteDocument,
    UserAPI
} from "../api/api.js";
import { useToast } from "../components/ui/use-toast.jsx";
import { Trash2, Upload, Home } from "lucide-react";
import Navbar from "../components/Navbar";
import "../styles/profile.css";
import "../styles/navbar.css";

export default function Profile() {
    const { toast } = useToast();
    const [profile, setProfile] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [emiStats, setEmiStats] = useState(null);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [documentsLoading, setDocumentsLoading] = useState(true);
    const [emiStatsLoading, setEmiStatsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const profileResponse = await getUserProfile();
                const profileData = profileResponse.data;
                setProfile(profileData);
                setEditedProfile(profileData);

                setDocumentsLoading(true);
                const docsResponse = await getUserDocuments();
                const docs = docsResponse?.data || [];
                setDocuments(Array.isArray(docs) ? docs : []);

                setEmiStatsLoading(true);
                const emiStatsResponse = await UserAPI.getUserEmiStats();
                setEmiStats(emiStatsResponse.data);
            } catch (err) {
                toast({
                    title: "Error loading profile",
                    description: err.message || "Failed to load profile data",
                    variant: "destructive"
                });
                setDocuments([]);
                setEmiStats(null);
            } finally {
                setDocumentsLoading(false);
                setEmiStatsLoading(false);
            }
        };
        fetchData();
    }, [toast]);

    const handleProfileChange = (e) => {
        setEditedProfile({ ...editedProfile, [e.target.name]: e.target.value });
    };

    const saveProfile = async () => {
        try {
            await updateUserProfile(editedProfile);
            setProfile(editedProfile);
            setIsEditing(false);
            toast({ title: "Profile updated ✅" });
        } catch (err) {
            toast({ title: "Error updating profile", description: err.message, variant: "destructive" });
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", "GENERAL");
        try {
            await uploadDocument(formData);
            const docsResponse = await getUserDocuments();
            const docs = docsResponse?.data || [];
            setDocuments(Array.isArray(docs) ? docs : []);
            toast({ title: "Document uploaded ✅" });
        } catch (err) {
            toast({ title: "Upload failed", description: err.message || "Failed to upload document", variant: "destructive" });
        } finally {
            setLoading(false);
            setFile(null);
        }
    };

    const handleDelete = async (docId) => {
        try {
            await deleteDocument(docId);
            setDocuments(prevDocs => prevDocs.filter((d) => d.id !== docId));
            toast({ title: "Document deleted ❌" });
        } catch (err) {
            toast({ title: "Error deleting document", description: err.message || "Failed to delete document", variant: "destructive" });
        }
    };

    if (!profile) return <div className="loading-text">Loading profile...</div>;

    return (
        <div className="profile-container">
            <Navbar />
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="profile-title"
            >
                My Profile
            </motion.h1>

            {/* Personal Details */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="card"
            >
                <div className="card-header">
                    <h2>Personal Details</h2>
                    {!isEditing && (
                        <button onClick={() => setIsEditing(true)} className="btn-edit">
                            Edit Profile
                        </button>
                    )}
                </div>

                <div className="card-body">
                    {isEditing ? (
                        <div className="edit-grid">
                            {["name", "mobile", "pan", "aadhar"].map((field) => (
                                <div key={field} className="profile-field">
                                    <label>{field.toUpperCase()}</label>
                                    <input
                                        name={field}
                                        value={editedProfile?.[field] || ""}
                                        onChange={handleProfileChange}
                                        className="editable-input"
                                    />
                                </div>
                            ))}
                            <div className="profile-field">
                                <label>Email</label>
                                <input value={profile.email || ""} disabled className="editable-input" />
                            </div>
                            <div className="profile-field">
                                <label>CIBIL Score</label>
                                <input value={profile.cibilScore || "Not Available"} disabled className="editable-input" />
                            </div>
                            <div className="button-group">
                                <button onClick={saveProfile} className="btn-save">Save Changes</button>
                                <button onClick={() => setIsEditing(false)} className="btn-cancel">Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <div className="profile-details-grid">
                            <div className="profile-field"><label>Name</label><p>{profile.name || "Not provided"}</p></div>
                            <div className="profile-field"><label>Email</label><p>{profile.email || "Not provided"}</p></div>
                            <div className="profile-field"><label>Phone</label><p>{profile.mobile || "Not provided"}</p></div>
                            <div className="profile-field"><label>PAN</label><p>{profile.pan || "Not provided"}</p></div>
                            <div className="profile-field"><label>Aadhar</label><p>{profile.aadhar || "Not provided"}</p></div>
                            <div className="profile-field"><label>CIBIL Score</label><p>{profile.cibilScore || "Not Available"}</p></div>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* EMI Stats */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="card"
            >
                <div className="card-header">
                    <h2>EMI Statistics</h2>
                </div>
                <div className="card-body">
                    {emiStatsLoading ? (
                        <p className="loading-text">Loading EMI statistics...</p>
                    ) : emiStats ? (
                        <div className="emi-stats">
                            {[
                                { label: "Total EMIs", value: emiStats.totalEmis, color: "text-emerald-400" },
                                { label: "Paid EMIs", value: emiStats.paidEmis, color: "text-green-400" },
                                { label: "Pending EMIs", value: emiStats.pendingEmis, color: "text-red-400" },
                                { label: "Pending Amount", value: `₹${emiStats.pendingEmiAmount?.toFixed(2) || '0.00'}`, color: "text-blue-400" }
                            ].map((stat, i) => (
                                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="emi-stat">
                                    <p className={`emi-value ${stat.color}`}>{stat.value}</p>
                                    <p className="emi-label">{stat.label}</p>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <p className="loading-text">No EMI data available.</p>
                    )}
                </div>
            </motion.div>

            {/* Documents */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="card"
            >
                <div className="card-header">
                    <h2>Documents</h2>
                </div>
                <div className="card-body">
                    <div className="upload-section">
                        <input type="file" onChange={(e) => setFile(e.target.files[0])} className="file-input" />
                        <button onClick={handleUpload} disabled={loading} className="btn-upload">
                            <Upload className="mr-2 h-4 w-4" /> {loading ? "Uploading..." : "Upload"}
                        </button>
                    </div>

                    {documentsLoading ? (
                        <p className="loading-text">Loading documents...</p>
                    ) : documents.length === 0 ? (
                        <p className="loading-text">No documents uploaded yet.</p>
                    ) : (
                        <ul className="documents-list">
                            {documents.map((doc) => (
                                <motion.li key={doc.id || doc.fileName} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="document-item">
                                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="doc-link">{doc.fileName || doc.name || 'Unnamed Document'}</a>
                                    <button onClick={() => handleDelete(doc.id)} className="btn-delete">
                                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                                    </button>
                                </motion.li>
                            ))}
                        </ul>
                    )}
                </div>
            </motion.div>

            {/* Home Button */}
            <Link to="/" className="home-button">
                <Home size={24} />
            </Link>
        </div>
    );
}
