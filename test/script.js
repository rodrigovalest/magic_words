const auth = "123mudar";

const fetchData = async () => {
  const response = await fetch("http://localhost/web1-trabfinal/api/teste", {
    method: "GET",
    headers: {
      Authorization: auth,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    return;
  }

  const data = await response.json();

  console.log(data);
  
  document.getElementById("data").innerHTML = data.message + " | " + data.token;
};

fetchData();
