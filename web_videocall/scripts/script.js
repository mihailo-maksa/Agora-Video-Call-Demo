// Basic Boilerplate
let handleFail = err => {
  console.log("Error: ", err)
};

let remoteContainer = document.getElementById("remote-container");

let addVideoStream = elementId => {
  let streamDiv = document.createElement("div");
  streamDiv.id = elementId;
  streamDiv.style.transform = "rotateY(180deg)";
  remoteContainer.appendChild(streamDiv);
}

let removeVideoStream = elementId => {
  let remDiv = document.getElementById(elementId);
  if (remDiv) remDiv.parentNode.removeChild(remDiv)
}


// Agora.io Setup
let client = AgoraRTC.createClient({
  mode: "rtc",
  codec: "vp8"
});

client.init("51240a69f2a449c582b8ca1e2a416587"); // agoraAppId

client.join(
  null, // token; null if tokens are not implemented
  "test1", // channelName
  null, // user uid; asigned randomly by Agora if left null
  uid => {
    let localStream = AgoraRTC.createStream({
      audio: true,
      video: true
    });

    localStream.init(() => {
      localStream.play("me");
      client.publish(localStream, handleFail);
    }, handleFail);
  }, handleFail 
);

client.on("stream-added", e => {
  client.subscribe(e.stream, handleFail)
});

client.on("stream-subscribed", e => {
  let stream = e.stream;
  let streamId = String(stream.getId());
  addVideoStream(streamId);
  stream.play(streamId);
});

client.on("stream-removed", e => {
  let stream = e.stream;
  let streamId = String(stream.getId());
  stream.close();
  removeVideoStream(streamId);
});

client.on("peer-leave", e => {
  let stream = e.stream;
  let streamId = String(stream.getId());
  stream.close();
  removeVideoStream(streamId);
});
