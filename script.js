console.log("Lets write some javascript")
let audio = new Audio();
let play = document.getElementById("play")

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
    // play music
    function playMusic(song) {
        audio.src = `http://127.0.0.1:5500/Songs/${song}`
        audio.play();
        play.src = "svg/pause.svg"
        document.querySelector(".songinfo").innerHTML = song.replaceAll("%20", " ");
        audio.addEventListener("timeupdate", () => {
            const currentTime = audio.currentTime;
            const duration = audio.duration;
            const formattedCurrentTime = formatTime(currentTime);
            const formattedDuration = formatTime(duration);
            
            document.querySelector(".songduration").innerHTML = `${formattedCurrentTime} / ${formattedDuration}`;
            document.querySelector(".circle").style.left = `${(currentTime / duration) * 100}%`;
        })
    }

    //Access the play buttons

    play.addEventListener("click", () => {
        if (audio.paused) {
            audio.play()
            play.src = "svg/pause.svg"
        } else {
            audio.pause()
            play.src = "svg/play-circle.svg"
        }
    })

    //Add time update

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    function getFormattedTimes(currentTime, duration) {
        const formattedCurrentTime = formatTime(currentTime);
        const formattedDuration = formatTime(duration);
        return { formattedCurrentTime, formattedDuration };
    }
    
    // Add event listner to trackbar
    document.querySelector(".track").addEventListener("click", (e) => {
        const track = e.target;
        const rect = track.getBoundingClientRect();  //returns the size of an element and its position relative to the viewport. It provides various properties like the height, width, top, right, bottom, left.
        const offsetX = e.offsetX;
        const trackWidth = rect.width;
        const newTime = (offsetX / trackWidth) * audio.duration;

        document.querySelector(".circle").style.left = (offsetX / trackWidth) * 100 + "%";
        audio.currentTime = newTime;
    });

    //ALTERNATIVELY, THIS CAN BE USED AS A SINGLE LINER(THIS IS WITHOUT THE TIME UPDATE)
    
    // document.querySelector(".track").addEventListener("click", e =>{
    //     document.querySelector(".circle").style.left = (e.offsetX / e.target.getBoundingClientRect().width) * 100 + "%"
    // })

    
}

main()