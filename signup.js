document.addEventListener("DOMContentLoaded", () => {
    const togglePassword = document.getElementById("togglePassword");
    const passwordInput = document.getElementById("password");
    const roleButtons = document.querySelectorAll(".role-btn");
    const roleInput = document.getElementById("role");

    // Toggle password visibility
    togglePassword.addEventListener("click", () => {
        passwordInput.type =
            passwordInput.type === "password" ? "text" : "password";

        togglePassword.classList.toggle("fa-eye");
        togglePassword.classList.toggle("fa-eye-slash");
    });

    // Role selection
    roleButtons.forEach(button => {
        button.addEventListener("click", () => {
            roleButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            roleInput.value = button.dataset.role;
        });
    });
});
