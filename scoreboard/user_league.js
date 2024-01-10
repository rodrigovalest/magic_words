const league = async () => {
    console.log(localStorage.getItem("token"));
    const response = await fetch("http://localhost/web1-trabfinal/api/league/user_leagues.php", {
        method: "get",
        headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token")
        }
    });

    if (!response.ok) {
        alert("Something went wrong. Try again!");
        return;
    }

    const data = await response.json();
    console.log(data, data.leagues[0]);
    //let liga = data.league;
    // data.forEach(liga => {
    //     var option = document.createElement("option");
    //     option.text = liga.name;
    //     option.value = liga[index].id;
    // });
    for (let index = 0; index < data.leagues.length; index++) {
        var option = document.createElement("option");
        option.text = data.leagues[index].name;
        option.value = data.leagues[index].id;
        var select = document.getElementById("form-select");
        select.appendChild(option);
    }
};
