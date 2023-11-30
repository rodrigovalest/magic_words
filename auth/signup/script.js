let username = "clodovaldo";
let email = "clodovaldo@email.com";
let password = "123mudar";

let credentials = {
    "username": username,
    "email": email,
    "password": password
}

const fetchCredentials = async () => {
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
};
