document.addEventListener("DOMContentLoaded", () => {
    const adminUser = "Asma";
    const adminPass = "1234";

    const loginModal = document.getElementById("loginModal");
    const closeModal = document.getElementById("closeModal");
    const submitLogin = document.getElementById("submitLogin");
    const usernameInput = document.getElementById("usernameInput");
    const passwordInput = document.getElementById("passwordInput");

    const welcomeModal = document.getElementById("welcomeModal");
    const welcomeMessage = document.getElementById("welcomeMessage");
    const closeWelcome = document.getElementById("closeWelcome");

    const userDisplay = document.getElementById("userDisplay");
    const adminControlMenu = document.getElementById("adminControlMenu");
    const adminDropdown = document.getElementById("adminDropdown");

    const addStaffModal = document.getElementById("addStaffModal");
    const closeAddStaff = document.getElementById("closeAddStaff");
    const addStaffForm = document.getElementById("addStaffForm");
    const viewStaffBtn = document.getElementById("viewStaffBtn");

    const accountBtn = document.getElementById("accountBtn");
    const accountMenu = document.getElementById("accountMenu");
    const loginOption = document.getElementById("loginOption");
    const logoutOption = document.getElementById("logoutOption");

    // ------------------ IndexedDB Setup ------------------
    let db;
    const request = indexedDB.open("StaffDB", 1);

    request.onupgradeneeded = (event) => {
        db = event.target.result;
        if (!db.objectStoreNames.contains("staff")) {
            const store = db.createObjectStore("staff", { keyPath: "email" });
            store.createIndex("name", "name", { unique: false });
        }
    };

    request.onsuccess = (event) => {
        db = event.target.result;
        console.log("Database initialized");
    };

    request.onerror = (event) => {
        console.error("Database error:", event.target.errorCode);
    };

    // ------------------ Helper Functions ------------------
    function addStaffToDB(name, email, password) {
        if (!db) return;

        const transaction = db.transaction(["staff"], "readwrite");
        const store = transaction.objectStore("staff");

        const getRequest = store.get(email);
        getRequest.onsuccess = () => {
            if (getRequest.result) {
                console.warn("Staff already exists!");
                return;
            }
            store.add({ name, email, password });
            console.log(`Staff ${name} added successfully`);
        };

        transaction.onerror = () => {
            console.error("Transaction failed");
        };
    }

    function getStaffByNameOrEmail(username, callback) {
        if (!db) return callback(null);

        const transaction = db.transaction(["staff"], "readonly");
        const store = transaction.objectStore("staff");

        const requestByEmail = store.get(username);
        requestByEmail.onsuccess = () => {
            if (requestByEmail.result) return callback(requestByEmail.result);

            // البحث بالاسم إذا لم يوجد بالبريد
            const index = store.index("name");
            const requestByName = index.get(username);
            requestByName.onsuccess = () => callback(requestByName.result);
        };
    }

    // ------------------ Modals Handling ------------------
    closeModal?.addEventListener("click", () => loginModal.style.display = "none");
    closeWelcome?.addEventListener("click", () => welcomeModal.style.display = "none");
    closeAddStaff?.addEventListener("click", () => addStaffModal.style.display = "none");

    window.addEventListener("click", (e) => {
        if (e.target === addStaffModal) addStaffModal.style.display = "none";
        if (e.target !== accountBtn && e.target.closest("#accountMenu") === null) {
            accountMenu.style.display = "none";
        }
    });

    accountBtn?.addEventListener("click", () => {
        accountMenu.style.display = accountMenu.style.display === "block" ? "none" : "block";
    });

    loginOption?.addEventListener("click", () => {
        loginModal.style.display = "flex";
        accountMenu.style.display = "none";
    });

    logoutOption?.addEventListener("click", () => {
        localStorage.removeItem("loggedUser");
        localStorage.removeItem("isAdmin");
        userDisplay.innerText = "";
        adminControlMenu.style.display = "none";
        adminDropdown.innerHTML = "";
        updateAccountMenu();
        accountMenu.style.display = "none";
    });

   // ------------------ Login ------------------
submitLogin?.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    if (!username || !password) return;

    let isAdmin = (username === adminUser && password === adminPass);

    getStaffByNameOrEmail(username, (staffUser) => {
        if (!isAdmin && !staffUser) return;

        localStorage.setItem("loggedUser", isAdmin ? adminUser : staffUser.name);
        localStorage.setItem("isAdmin", isAdmin ? "true" : "false");

        loginModal.style.display = "none";
        usernameInput.value = "";
        passwordInput.value = "";

        // تحديث واجهة المستخدم
        userDisplay.innerText = `(Welcome ${isAdmin ? "Admin " + username : staffUser.name})`;
        userDisplay.style.fontSize = "12px";
        userDisplay.style.marginTop = "0.3rem";

        // تحديث المودال
        const welcomeMessage = document.getElementById("welcomeMessage");
        const welcomeSubMessage = document.getElementById("welcomeSubMessage");

        // الرسالة الرئيسية
        welcomeMessage.innerText = "Welcome to our website 🌟";

        // الرسالة الفرعية حسب المستخدم
        welcomeSubMessage.innerText = isAdmin
            ? `Welcome, Admin ${username}!`
            : `Welcome, ${staffUser.name}!`;

        // إظهار المودال
        welcomeModal.style.display = "flex";

        // إخفاء تلقائي بعد 3 ثواني
        setTimeout(() => welcomeModal.style.display = "none", 3000);

        // تحديث القوائم
        updateAdminDropdown(isAdmin);
        updateAccountMenu();
    });
});

    // ------------------ Add Staff ------------------
    addStaffForm?.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("staffName").value.trim();
        const email = document.getElementById("staffEmail").value.trim();
        const password = document.getElementById("staffPassword").value.trim();
        if (!name || !email || !password) return;

        addStaffToDB(name, email, password);
        addStaffModal.style.display = "none";
        addStaffForm.reset();
    });

    viewStaffBtn?.addEventListener("click", () => {
        window.location.href = "Login.html";
    });

    // ------------------ Account Menu & Admin Dropdown ------------------
// ------------------ Account Menu & Admin Dropdown ------------------
function updateAccountMenu() {
    const currentUser = localStorage.getItem("loggedUser");
    const currentIsAdmin = localStorage.getItem("isAdmin") === "true";

    if (currentUser) {
        userDisplay.innerText = `(Welcome ${currentIsAdmin ? "Admin " + currentUser : currentUser})`;
        userDisplay.style.fontSize = "9px";
        userDisplay.style.marginTop = "0.48rem";
        loginOption.style.display = "none";
        logoutOption.style.display = "block";
        updateAdminDropdown(currentIsAdmin);
    } else {
        userDisplay.innerText = "";
        loginOption.style.display = "block";
        logoutOption.style.display = "none";
        adminControlMenu.style.display = "none";
        adminDropdown.innerHTML = "";
    }
}

function updateAdminDropdown(isAdmin) {
    if (!isAdmin) {
        adminControlMenu.style.display = "none";
        adminDropdown.innerHTML = "";
        return;
    }

    adminControlMenu.style.display = "inline-block";
    adminDropdown.innerHTML = "";

const adminOptions = [
  { text: "Add Staff (Web)", action: () => addStaffModal.style.display = "flex" },
  { text: "Add Staff (New)", action: () => window.location.href = "EnterDate.html" },
  { text: "Edit Staff", action: () => window.location.href = "EnterDate Edit.html" },
  { text: "Dashboard", action: () => window.location.href = "Dashboard.html" } // نفس الرابط للجميع
];

    adminOptions.forEach(opt => {
        const li = document.createElement("li");
        li.style.listStyle = "none";

        const link = document.createElement("a");
        link.href = "javascript:void(0)";
        link.innerText = opt.text;
        Object.assign(link.style, {
            display: "block",
            padding: "10px",
            color: "#fff",
            whiteSpace: "nowrap",
            textDecoration: "none",
            borderRadius: "5px"
        });

        link.addEventListener("mouseenter", () => link.style.backgroundColor = "#4e5a70");
        link.addEventListener("mouseleave", () => link.style.backgroundColor = "transparent");
        link.addEventListener("click", opt.action);

        li.appendChild(link);
        adminDropdown.appendChild(li);
    });
}

// إضافة أحداث الهيدر فقط مرة واحدة
if (!adminControlMenu.dataset.eventsAdded) {
    adminControlMenu.addEventListener("mouseenter", () => {
        adminDropdown.style.display = "block";
    });
    adminControlMenu.addEventListener("mouseleave", () => {
        adminDropdown.style.display = "none";
    });
    adminControlMenu.dataset.eventsAdded = "true";
}

// تهيئة القائمة عند تحميل الصفحة
updateAccountMenu();

});
