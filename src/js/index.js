const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.lang = "en-US";

const start = document.querySelector("#start");
const stop = document.querySelector("#stop");
const status = document.querySelector("#status");
const preview = document.querySelector("#preview");
const command = document.querySelector("#command");

const styleTag = document.createElement("style");
styleTag.type = "text/css";
document.body.appendChild(styleTag);

const handleStart = () => {
  status.innerText = "Listening";
  recognition.start();
};
const handleStop = () => {
  status.innerText = "Not Listening";
  command.innerText = "";
  recognition.stop();
};

let htmlString = "";
const processResult = (result) => {
  let processed = result.trim().toLowerCase();
  if (processed.includes("html")) {
    if (processed.includes("content")) {
      const [_, content] = processed.split("html content ");
      console.log(content);
      htmlString += content;
    } else if (processed.includes("open")) {
      const [_, tag] = processed.split("html open ");
      console.log(`<${tag}>`);
      htmlString += `<${tag}>`;
    } else if (processed.includes("finish")) {
      const [_, tag] = processed.split("html finish ");
      console.log(`</${tag}>`);
      htmlString += `</${tag}>`;
      preview.innerHTML += htmlString;
      htmlString = "";
    }
  } else if (processed.includes("css")) {
    if (processed.includes("open")) {
      const [_, tag] = processed.split("css open ");
      console.log(tag);
      styleTag.innerHTML += `${tag} {`;
    } else if (processed.includes("finish")) {
      styleTag.innerHTML += "}";
    } else if (processed.includes("style")) {
      const [_, payload] = processed.split("css style ");
      if (payload) {
        const [prop, value] = payload
          .replaceAll(" pixels", "px")
          .replaceAll(" ", "-")
          .split("-is-");
        if (prop && value) {
          styleTag.innerHTML += `${prop}:${value};`;
        }
      }
    }
  }
};

const handleResults = (event) => {
  const { results, resultIndex } = event;
  const { transcript, confidence } = results[resultIndex][0];
  console.log(results[resultIndex][0]);
  if (confidence > 0.7) {
    command.innerHTML = `Command: ${transcript}`;
    processResult(transcript);
  }
};

start.addEventListener("click", handleStart);
stop.addEventListener("click", handleStop);
recognition.addEventListener("result", handleResults);
