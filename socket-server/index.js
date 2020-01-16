const fs = require("fs")
const child_process = require("child_process")
const app = require('express')();
const http = require('http').createServer(app);
const io = require("socket.io")(http)

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on("imageData", data => {
        const formatedData = data.replace(/^data:image\/\w+;base64,/, "");

        fs.writeFileSync("_images/input.jpg", formatedData, {encoding: "base64"})

        child_process.exec("node glitched-image-node-app/index.js _images/input.jpg", (error, stdout) => {

            if(error) {
                console.info(error)
                return
            }

            fs.copyFile('_images/glitched.jpg', 'client-result/glitched.jpg', (err) => {
                if (err) throw err;
                console.log('copied');
                io.emit("imageCopied")
            });

            io.emit("imageGlitched")
            console.log(stdout)
        })
    })
});

http.listen(3000, () => {
    console.info('listening on *:3000');
});
