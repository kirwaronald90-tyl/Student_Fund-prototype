require("dotenv").config();

const express = require("express");
const cors = require("cors");
const AfricasTalking = require("africastalking");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

if (!process.env.AT_API_KEY) {
throw new Error("AT_API_KEY is missing. Check your server/.env file.");
}

const africasTalking = AfricasTalking({
apiKey: process.env.AT_API_KEY,
username: process.env.AT_USERNAME || "sandbox"
});

const sms = africasTalking.SMS;
app.post("/api/test-sms", async (req, res) => {
    const { phoneNumber } = req.body;

    // Only allow Kenyan phone numbers in this test.
    if (
        typeof phoneNumber !== "string" ||
        !/^(?:\+254|254|0)7\d{8}$/.test(phoneNumber) &&
        !/^(?:\+254|254|0)1\d{8}$/.test(phoneNumber)
    ) {
        return res.status(400).json({
            error: "Enter a valid Kenyan mobile number."
        });
    }

    // Require a private test token before allowing an SMS request.
    if (!process.env.SMS_TEST_TOKEN) {
        return res.status(503).json({
            error: "SMS testing is not configured."
        });
    }

    if (req.get("x-test-token") !== process.env.SMS_TEST_TOKEN) {
        return res.status(401).json({
            error: "Unauthorized."
        });
    }

    try {
        const result = await sms.send({
            to: [phoneNumber],
            message: "FursaAlert Sandbox test: your SMS integration is being tested."
        });
        console.log("Africa's Talking response:");
console.dir(result, { depth: null });

        return res.json({
            message: "SMS request submitted to Africa's Talking Sandbox.",
            result
        });
    } catch (error) {
        console.error("SMS request failed:", error.message);

        return res.status(502).json({
            error: "The SMS request failed. Check the server logs."
        });
    }
});
// FursaAlert subscription endpoint
app.post("/api/subscribe", (req, res) => {
    const { studentName, phoneNumber, fundingType, smsConsent } = req.body;

    // Validate the student's name
    if (typeof studentName !== "string" || !studentName.trim()) {
        return res.status(400).json({
            success: false,
            message: "Please enter your name."
        });
    }

    // Validate the Kenyan mobile number
    const kenyanPhonePattern = /^(?:\+254|254|0)(?:7|1)[0-9]{8}$/;

    if (
        typeof phoneNumber !== "string" ||
        !kenyanPhonePattern.test(phoneNumber.trim())
    ) {
        return res.status(400).json({
            success: false,
            message: "Please enter a valid Kenyan mobile number."
        });
    }

    // Validate the funding preference
    const allowedFundingTypes = [
        "scholarships",
        "bursaries",
        "student-loans",
        "all"
    ];

    if (!allowedFundingTypes.includes(fundingType)) {
        return res.status(400).json({
            success: false,
            message: "Please select a valid funding category."
        });
    }

    // Require explicit consent
    if (smsConsent !== true) {
        return res.status(400).json({
            success: false,
            message: "Consent is required to subscribe to SMS alerts."
        });
    }

    // Temporary response until we connect the database
    return res.status(200).json({
        success: true,
        message: "Your information is valid. Database saving and SMS alerts are not active yet.",
        subscription: {
            studentName: studentName.trim(),
            phoneNumber: phoneNumber.trim(),
            fundingType
        }
    });
});

app.get("/", (req, res) => {
res.json({
message: "FursaAlert backend is running!",
smsConfigured: true
});
});

app.listen(PORT, () => {
console.log(`FursaAlert server is running on port ${PORT}`);
});

