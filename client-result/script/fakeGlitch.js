let glitchLen = 0;

function setup() {
    createCanvas(400, 400);
}

function draw() {

    // update screen
    if(frameCount%60 === 0){

        // new background
        background(random(255), random(255), random(255));
        // new colored circle
        fill(random(255), random(255), random(255));
        ellipse(width/2, height/2, 300, 300);

        // random glitch pixel length
        glitchLen = int(random(4,2400))*4;
        // edit the pixels array
        loadPixels();
        // channel shift?
        let channelshift = int(random(0,4));

        const paramFrom = 25;                 // percent value
        const paramTo   = 75  // percent value


        const pixelFrom = (pixels.length / 100) * paramFrom;
        const pixelTo   = (pixels.length / 100) * paramTo;

        // loop over chunks
        for(let i=pixelFrom; i<pixelTo-glitchLen; i=i+glitchLen){
            // set all pixels in chunk to color of the first pixel
            for(let p=channelshift; p<glitchLen; p+=4){
                pixels[i+p] = pixels[i];
                pixels[i+p+1] = pixels[i+1];
                pixels[i+p+2] = pixels[i+2];
                //pixels[i+p+3] = pixels[i+3];
            }
        }
        updatePixels();
    }
    push();
}
