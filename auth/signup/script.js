
const fetchCredentials = async () => {
    let username = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("senha").value;
    let credentials = {
        "username": username,
        "email": email,
        "password": password
    }

    const response = await fetch("http://localhost/web1-trabfinal/api/auth/signup.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
    });

    if (!response.ok) {
        alert("Something went wrong. Try again!");
        return;
    }

    const data = await response.json();
    console.log(data);
    window.location.href = "../signin/";
};
