function setup() {
  createCanvas(400, 400);

  // 等待用戶互動後啟動 AudioContext
  userStartAudio().then(() => {
    console.log("AudioContext 已啟動");
  });
}

function draw() {
  background(220);
}

function sketch(p) {
  let facemesh;
  let video;
  let predictions = [];

  const lips = [
    409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291,
    76, 77, 90, 180, 85, 16, 315, 404, 320, 307, 306, 408, 304, 303, 302, 11, 72, 73, 74, 184
  ];

  const leftEye = [
    243, 190, 56, 28, 27, 29, 30, 247, 130, 25, 110, 24, 23, 22, 26, 112,
    133, 173, 157, 158, 159, 160, 161, 246, 33, 7, 163, 144, 145, 153, 154, 155
  ];

  const rightEye = [
    359, 467, 260, 259, 257, 258, 286, 444, 463, 341, 256, 252, 253, 254, 339, 255,
    263, 466, 388, 387, 386, 385, 384, 398, 362, 382, 381, 380, 374, 373, 390, 249
  ];

  p.setup = function () {
    p.createCanvas(640, 480);
    video = p.createCapture(p.VIDEO);
    video.size(640, 480);
    video.hide();

    facemesh = ml5.facemesh(video, () => {
      console.log("Facemesh model loaded!");
    });

    facemesh.on("predict", (results) => {
      predictions = results;
    });
  };

  p.draw = function () {
    p.image(video, 0, 0, p.width, p.height);

    p.stroke(255, 0, 0); // 紅色線條
    p.strokeWeight(5); // 線條粗細為 5
    p.noFill();

    if (predictions.length > 0) {
      const keypoints = predictions[0].scaledMesh;

      drawConnections(keypoints, lips);
      drawConnections(keypoints, leftEye);
      drawConnections(keypoints, rightEye);
    }
  };

  function drawConnections(keypoints, indices) {
    for (let i = 0; i < indices.length - 1; i++) {
      const start = keypoints[indices[i]];
      const end = keypoints[indices[i + 1]];
      p.line(start[0], start[1], end[0], end[1]);
    }
    // 將最後一個點連回第一個點，形成閉合圖形
    const start = keypoints[indices[indices.length - 1]];
    const end = keypoints[indices[0]];
    p.line(start[0], start[1], end[0], end[1]);
  }
}
