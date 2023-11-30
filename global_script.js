let isTvOn = true;
function TurnTv(local) {
    const title = document.getElementsByClassName('titleScreen');
    if (isTvOn) {
        for (let index = 0; index < title.length; index++) {
            title[index].style.visibility = 'hidden';
        }
        document.getElementById('powerButton').style.backgroundColor = "red";
        document.getElementById('powerButton').style.borderColor = "darkred";
        isTvOn = false;
    } else {
        window.location.href = local;
    }
}