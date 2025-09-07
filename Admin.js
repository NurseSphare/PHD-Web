document.addEventListener("DOMContentLoaded", () => {
    // بيانات الأدمن
    const adminUser = "Asma";
    const adminPass = "1234";

    // العناصر من الصفحة
    const loginBtn = document.getElementById("loginBtn");
    const loginModal = document.getElementById("loginModal");
    const closeModal = document.getElementById("closeModal");
    const submitLogin = document.getElementById("submitLogin");
    const usernameInput = document.getElementById("usernameInput");
    const passwordInput = document.getElementById("passwordInput");

    const welcomeModal = document.getElementById("welcomeModal");
    const welcomeMessage = document.getElementById("welcomeMessage");
    const closeWelcome = document.getElementById("closeWelcome");

    const hrDropdown = document.getElementById("hrDropdown");

    // فتح مودال تسجيل الدخول
    loginBtn.addEventListener("click", () => {
        loginModal.style.display = "flex";
    });

    // غلق مودال تسجيل الدخول
    closeModal.addEventListener("click", () => {
        loginModal.style.display = "none";
    });

    // غلق مربع الترحيب
    closeWelcome.addEventListener("click", () => {
        welcomeModal.style.display = "none";
    });

    // زر تسجيل الدخول
    submitLogin.addEventListener("click", () => {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if(!username || !password) {
            alert("يرجى إدخال كل من اسم المستخدم وكلمة المرور!");
            return;
        }

        loginModal.style.display = "none";
        usernameInput.value = "";
        passwordInput.value = "";

        // إزالة عنصر Staff إذا موجود مسبقًا
        const existingStaff = document.getElementById("staff");
        if(existingStaff) existingStaff.remove();

        // تحقق إذا المستخدم أدمن
        if(username === adminUser && password === adminPass) {
            const newItem = document.createElement("li");
            newItem.id = "staff"; 
            const link = document.createElement("a");
            link.href = "#staffPage"; 
            link.innerText = "Staff";
            newItem.appendChild(link);
            hrDropdown.appendChild(newItem);

            welcomeMessage.innerText = "Welcome, Admin " + username + "!";
        } else {
            welcomeMessage.innerText = "Welcome, " + username + "!";
        }

        // عرض مربع الترحيب
        welcomeModal.style.display = "flex";

        setTimeout(() => {
            welcomeModal.style.display = "none";
        }, 3000);
    });
});
