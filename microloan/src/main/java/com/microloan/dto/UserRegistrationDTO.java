package main.java.com.microloan.dto;

public class UserRegistrationDTO {
    private String fullName;
    private String email;
    private String mobile;
    private String password;
    private String address;
    private Documents documents;

    public static class Documents {
        private String aadhar;
        private String pan;

        public String getAadhar() {
            return aadhar;
        }

        public void setAadhar(String aadhar) {
            this.aadhar = aadhar;
        }

        public String getPan() {
            return pan;
        }

        public void setPan(String pan) {
            this.pan = pan;
        }
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Documents getDocuments() {
        return documents;
    }

    public void setDocuments(Documents documents) {
        this.documents = documents;
    }
}
