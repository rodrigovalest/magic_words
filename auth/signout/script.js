function Salvar() {
    if (confirm("Ultimo aviso. Você realmente quer fazer isso?")) {
        localStorage.removeItem("token");
        window.location.href = "../../index.html";
    }
}
