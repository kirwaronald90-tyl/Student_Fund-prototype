// Select all scholarship buttons
// Expand or collapse opportunity details
const detailButtons = document.querySelectorAll(".details-button");

detailButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        const card = button.closest(".scholarship-card");
        const details = card.querySelector(".opportunity-details");

        const isHidden = details.hidden;

        details.hidden = !isHidden;

        button.textContent = isHidden ? "Hide Details" : "View Details";
    });
});


// Scholarship search
const searchInput = document.getElementById("scholarshipSearch");
const searchButton = document.getElementById("searchButton");
const searchMessage = document.getElementById("searchMessage");

function searchScholarships() {
    const searchTerm = searchInput.value.trim().toLowerCase();

    const cards = document.querySelectorAll(".scholarship-card");
    let visibleCards = 0;

    cards.forEach(function(card) {
        const cardText = card.textContent.toLowerCase();
        const matches = cardText.includes(searchTerm);

        card.style.display = matches ? "" : "none";

        if (matches) {
            visibleCards++;
        }
    });

    if (visibleCards === 0) {
        searchMessage.textContent =
            "No matching categories found. Try another search.";
    } else {
        searchMessage.textContent =
            "Found " + visibleCards + " matching category/categories.";
    }
}

searchButton.addEventListener("click", searchScholarships);

searchInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        searchScholarships();
    }
});
// Application checklist progress
const checklistItems = document.querySelectorAll(
    '.checklist-item input[type="checkbox"]'
);

const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

function updateProgress() {
    const totalTasks = checklistItems.length;

    let completedTasks = 0;

    checklistItems.forEach(function(item) {
        if (item.checked) {
            completedTasks++;
        }
    });

    const percentage = totalTasks > 0
        ? (completedTasks / totalTasks) * 100
        : 0;

    if (progressBar && progressText) {
        progressBar.style.width = percentage + "%";

        progressText.textContent =
            completedTasks + " of " + totalTasks + " tasks completed";

        console.log("Progress:", percentage + "%");
    } else {
        console.error("Progress bar or progress text was not found.");
    }
}

// Save checklist progress whenever a checkbox changes
checklistItems.forEach(function(item) {
    item.addEventListener("change", function() {
        localStorage.setItem(item.id, item.checked);
        updateProgress();
    });
});
// Restore previously saved checklist progress
checklistItems.forEach(function(item) {
    const savedState = localStorage.getItem(item.id);

    if (savedState !== null) {
        item.checked = savedState === "true";
    }
});

updateProgress();

// Scholarship deadline countdown
function updateCountdowns() {
    const countdowns = document.querySelectorAll(".countdown");

    countdowns.forEach(function(countdown) {
        const deadline = countdown.dataset.deadline;
        const deadlineDate = new Date(deadline + "T23:59:59");
        const now = new Date();

        const timeRemaining = deadlineDate - now;

        if (timeRemaining <= 0) {
    countdown.textContent = "Deadline has passed.";
    countdown.classList.remove("urgent");
    countdown.classList.add("expired");
    return;
}

        const daysRemaining = Math.ceil(
            timeRemaining / (1000 * 60 * 60 * 24)
        );

        countdown.classList.remove("urgent", "expired");

if (daysRemaining < 10) {
    countdown.classList.add("urgent");
}

countdown.textContent =
    daysRemaining + " day(s) remaining (demo deadline)";
    });
}

// Run the countdown immediately
updateCountdowns();

// Refresh the countdown every minute
setInterval(updateCountdowns, 60000);

// Eligibility checker
const eligibilityForm = document.getElementById("eligibilityForm");
const eligibilityResults = document.getElementById("eligibilityResults");

if (eligibilityForm && eligibilityResults) {
eligibilityForm.addEventListener("submit", function(event) {
event.preventDefault();

    const educationLevel = document.getElementById("educationLevel").value;
    const fundingType = document.getElementById("fundingType").value;
    const citizenship = document.getElementById("citizenship").value;
    const institutionType = document.getElementById("institutionType").value;

    const opportunities = [
        {
            title: "Universities Fund Government Scholarship",
            category: "scholarship",
            education: ["undergraduate"],
            institutions: ["public-university"],
            kenyanCitizenRequired: true
        },
        {
            title: "HELB Undergraduate Student Loan",
            category: "loan",
            education: ["undergraduate"],
            institutions: ["public-university", "private-university"],
            kenyanCitizenRequired: true
        },
        {
            title: "NGAAF Education Bursary",
            category: "bursary",
            education: ["secondary", "college", "undergraduate"],
            institutions: ["secondary", "college", "public-university", "private-university"],
            kenyanCitizenRequired: true
        }
    ];

    const matches = opportunities.filter(function(opportunity) {
        const fundingMatches =
            fundingType === "any" ||
            opportunity.category === fundingType;

        const educationMatches =
            opportunity.education.includes(educationLevel);

        const citizenshipMatches =
            citizenship === "yes" && opportunity.kenyanCitizenRequired;

        const institutionMatches =
            opportunity.institutions.includes(institutionType);

        return fundingMatches &&
               educationMatches &&
               citizenshipMatches &&
               institutionMatches;
    });

    if (matches.length > 0) {
        eligibilityResults.innerHTML =
            "<h3>Potential Matches</h3>" +
            "<p>These opportunities match your selected categories. This is a preliminary check, not confirmation that you qualify.</p>" +
            "<ul>" +
            matches.map(function(opportunity) {
                return "<li><strong>" + opportunity.title + "</strong></li>";
            }).join("") +
            "</ul>" +
            "<p>Please open each opportunity's details and verify the official eligibility requirements and application status.</p>";
    } else {
        eligibilityResults.innerHTML =
            "<h3>No Potential Matches Found</h3>" +
            "<p>No listed opportunity matched all your answers. Try different answers or browse the full list. This does not mean you are ineligible for all funding.</p>";
    }
});

}
// FursaAlert backend connection test
async function testFursaAlertBackend() {
    try {
        const response = await fetch("http://localhost:3000/");

        if (!response.ok) {
            throw new Error("Backend connection failed.");
        }

        const data = await response.json();

        console.log("FursaAlert backend:", data.message);
    } catch (error) {
        console.error("Could not connect to FursaAlert backend:", error.message);
    }
}

testFursaAlertBackend();

/* FursaAlert SMS Alerts Form */

const smsAlertForm = document.getElementById("smsAlertForm");

if (smsAlertForm) {
    const fundingDropdown = document.getElementById("fundingType");
    const smsAlertMessage = document.getElementById("smsAlertMessage");
    const subscribeButton = document.getElementById("smsSubscribeButton");

    smsAlertForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const studentName =
            document.getElementById("studentName").value.trim();

        const phoneNumber =
            document.getElementById("phoneNumber").value.trim();

        const fundingType = fundingDropdown.value;

        const smsConsent =
            document.getElementById("smsConsent").checked;

        const kenyanPhonePattern =
            /^(?:\+254|254|0)(?:7|1)[0-9]{8}$/;

        const fundingLabels = {
            scholarships: "Scholarships",
            bursaries: "Bursaries",
            "student-loans": "Student Loans",
            all: "All Funding Opportunities"
        };

        smsAlertMessage.style.color = "#142850";

        if (!studentName) {
            smsAlertMessage.textContent = "Please enter your name.";
            return;
        }

        if (!kenyanPhonePattern.test(phoneNumber)) {
            smsAlertMessage.textContent =
                "Please enter a valid Kenyan mobile number, e.g. 0712345678.";
            return;
        }

        if (!fundingLabels[fundingType]) {
            smsAlertMessage.textContent =
                "Please select a valid funding category.";
            return;
        }

        if (!smsConsent) {
            smsAlertMessage.textContent =
                "Please agree to receive SMS alerts before subscribing.";
            return;
        }

        subscribeButton.disabled = true;
        subscribeButton.textContent = "Submitting...";
        smsAlertMessage.textContent = "Connecting to FursaAlert...";

        try {
            const response = await fetch(
                "http://localhost:3000/api/subscribe",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        studentName: studentName,
                        phoneNumber: phoneNumber,
                        fundingType: fundingType,
                        smsConsent: smsConsent
                    })
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Your subscription could not be processed."
                );
            }

            smsAlertMessage.style.color = "#15803d";

            smsAlertMessage.textContent =
                "Thank you, " + studentName + "! " +
                "Your " + fundingLabels[fundingType] +
                " subscription details passed validation. " +
                "Database saving and SMS alerts are not active yet.";

            smsAlertForm.reset();

        } catch (error) {
            console.error("FursaAlert subscription error:", error);

            smsAlertMessage.style.color = "#b91c1c";

            smsAlertMessage.textContent =
                "We couldn't connect to FursaAlert. " +
                "Please ensure the backend is running and try again.";

        } finally {
            subscribeButton.disabled = false;
            subscribeButton.textContent = "Subscribe to SMS Alerts";
        }
    });
}