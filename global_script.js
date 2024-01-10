let isTvOn = true;
function TurnTv(local) {
    const title = document.getElementsByClassName('title_screen');
    if (isTvOn) {
        for (let index = 0; index < title.length; index++) {
            title[index].style.visibility = 'hidden';
        }
        document.getElementById('power_button').style.backgroundColor = "red";
        document.getElementById('power_button').style.borderColor = "darkred";
        isTvOn = false;
    } else {
        window.location.href = local;
    }
}

function scrollToTop() {
    var rootElement = document.documentElement;
    rootElement.scrollTo({
        top: 0,
        behavior: "smooth"
    })
}