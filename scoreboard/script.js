const create = async () => {
    console.log(localStorage.getItem("token"));
    let name = document.getElementById("name").value;
    let password = document.getElementById("senha").value;
    let credentials = {
        "name": name,
        "password": password
    }
    const response = await fetch("http://localhost/web1-trabfinal/api/league/create.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token")
        },
        body: JSON.stringify(credentials)
    });

    if (!response.ok) {
        alert("Something went wrong. Try again!");
        return;
    }

    const data = await response.json();
    console.log(data);
    window.location.href = "./index.html";
};

const enter = async () => {
    let name = document.getElementById("name").value;
    let password = document.getElementById("senha").value;
    let credentials = {
        "league_name": name,
        "league_senha": password
    }
    const response = await fetch("http://localhost/web1-trabfinal/api/league/enter.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token")
        },
        body: JSON.stringify(credentials)
    });

    if (!response.ok) {
        alert("Something went wrong");

        return;
    }

    const data = await response.json();
    console.log(response);
    window.location.href = "./index.html";
};
