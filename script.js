console.log("Lets write some javascript")

async function getsongs() {
    //fetch api
    let a = await fetch("http://127.0.0.1:5500/Songs/")
    let responce = await a.text()
    let div = document.createElement("div")
    div.innerHTML = responce
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        //add all the songs to the array
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/Songs/")[1])
        }
    }
    return songs
}
async function main() {

    let currentsong;
    //get the list of all the songs   
    let songs = await getsongs()
    //add songs to the list
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    for (const song of songs) {
        let data = song.replaceAll("%20", " ")
        songul.innerHTML = songul.innerHTML + `<li><div class="details flex justify-between items-center border rounded padding">
                                                <div class="grp flex">
                                                    <img src="svg/music.svg" alt="music">
                                                    <div class="det">
                                                        <div class="name">${data.split("-")[0]}</div>
                                                        <div class="artist">${data.split("-")[1].split(".")[0]}</div>
                                                    </div>
                                                </div>
                                                <img class="play-btn" src="svg/play2.svg" alt="play" data-song="${song}">
                                            </div></li>`;
    }

    let playButtons = document.querySelectorAll(".play-btn");
    playButtons.forEach(button => {
        button.addEventListener("click", event => {
            let song = event.target.getAttribute("data-song"); //target says the particular element
            playMusic(song);
        });
    });
    function playMusic(song) {
        let audio = new Audio(`http://127.0.0.1:5500/Songs/${song}`);
        audio.play();
        currentsong = audio;
    }
}

main()