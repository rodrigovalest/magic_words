let isTvOn = true;
function TurnTv(local) {
    const title = document.getElementsByClassName('title_screen');
    if (isTvOn) {
        for (let index = 0; index < title.length; index++) {
            title[index].style.display = 'none';
        }
        document.getElementById('power_button').style.backgroundColor = "red";
        document.getElementById('power_button').style.borderColor = "darkred";
        isTvOn = false;
    } else {
        window.location.href = local;
    }
}

function scrollToTop(local) {
    window.location.href = local;
}