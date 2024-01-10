const view = async () => {
    let Semanal = document.getElementById("semanal").value;
    let mode = document.getElementById("form-select").value;
    let league_name = "teste";
    let credentials = {
        "weekly": false,
        "mode": mode,
        "league_name": league_name
    }
    const response = await fetch("http://localhost/web1-trabfinal/api/league/view.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token")
        },
        body: JSON.stringify(credentials)
    });

    if (!response.ok) {
        alert("Something went wrong");
        const data = await response.json();
        console.log(data);
        return;
    }

    const data = await response.json();
    console.log(data.leagues);

    // for (let index = 0; index < data.leagues.length; index++) {
    //     var option = document.createElement("option");
    //     option.text = data.leagues[index].name;
    //     option.value = data.leagues[index].id;
    //     var select = document.getElementById("form-select");
    //     select.appendChild(option);
    // }
};