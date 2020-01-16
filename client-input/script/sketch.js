const socket = io('http://localhost:3000');

socket.on("connect", () => {
  console.log("connected")
})

socket.on("imageGlitched", () => {
  console.log("image gliched")
})

// based on ml5 p5 sample:

// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet example using p5.js
=== */

// params
const minFrameBetweenToImageSave = 15
// ---

let imageSavedFrameCounter = 0
let handGoToBottomTrigger = true

let modelLoaded = false
let p5Canvas

let video
let poseNet
let poses = []

function setup() {
  p5Canvas = createCanvas(640, 480)
  video = createCapture(VIDEO)
  video.size(width, height)

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady)
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', (results) => {
    poses = results
  })
  // Hide the video element, and just show the canvas
  video.hide()
}

function modelReady() {
  modelLoaded = true
  select("body").addClass("modelLoaded")
}

function draw() {
  image(video, 0, 0, width, height)

  if( modelLoaded ) {

    if( handIsUpShoulder() && handGoToBottomTrigger) {

      if(imageSavedFrameCounter > minFrameBetweenToImageSave) {
        imageSavedFrameCounter = 0
        handGoToBottomTrigger = false
        sentImageToWebSOcket(p5Canvas.elt)
      }

      imageSavedFrameCounter++
      console.log(imageSavedFrameCounter)

    } else if( !handIsUpShoulder() ) {
      console.log("NO")
      handGoToBottomTrigger = true
      imageSavedFrameCounter = 0
    }
  }
}

function canTakeNewImage() {
  return imageSavedFrameCounter > minFrameBetweenToImageSave && handGoToBottomTrigger
}

// A function to draw ellipses over the detected keypoints
function handIsUpShoulder() {
  let handPosition = null
  let shoulderPosition = null

  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j]


      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {


        if (keypoint.part === "rightWrist") {
          handPosition = keypoint.position
        }

        if (keypoint.part === "rightShoulder") {
          shoulderPosition = keypoint.position
        }

        if (handPosition !== null && shoulderPosition !== null && handPosition.y <= shoulderPosition.y) {
          return true
        }

      }
    }
  }

  return false
}

/**
 * @param {HTMLCanvasElement} canvas
 */
function sentImageToWebSOcket(canvas) {
  const urlContent = canvas.toDataURL("image/jpeg")

  socket.emit("imageData", urlContent)

  console.log("image sending")
}
