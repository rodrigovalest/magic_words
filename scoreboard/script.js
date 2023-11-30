const fetchCredentials = async () => {
    const response = await fetch("http://localhost:8000/web1-trabfinal/api/db/get_database.php", {
        method: "get",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
    });

    console.log(response);
};
