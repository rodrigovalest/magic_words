
const fetchCredentials = async () => {
    let username = document.getElementById("name").value;
    let password = document.getElementById("senha").value;
    let credentials = {
        "username": username,
        "password": password
    }
    const response = await fetch("http://localhost/web1-trabfinal/api/auth/signin.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
    });

    if (!response.ok) {
        alert("Something went wrong");
        localStorage.removeItem("token");
        return;
    }

    const data = await response.json();

    token = data.data;
    localStorage.setItem("token", token);
    window.location.href = "../../";
};
