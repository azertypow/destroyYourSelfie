const socket = io('http://localhost:3000');

socket.on("connect", () => {
    console.log("connected")

    socket.on("imageGlitched", () => {
        console.log("imageGlitched")
    })

    socket.on("imageCopied", () => {
        console.log("imageCopied")

        location.reload(true)

    })
})
