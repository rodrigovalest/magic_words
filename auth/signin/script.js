let username = "clodovaldo";
let password = "123mudar";

let credentials = {
    "username": username,
    "password": password
}

const fetchCredentials = async () => {
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
    console.log(data);

    token = data.data;
    localStorage.setItem("token", token);
};
