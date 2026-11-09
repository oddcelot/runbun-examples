const name = `guest-${Math.floor(Math.random() * 1000)}`;
const ws = new WebSocket(
  `${location.origin.replace(/^http/, "ws")}/chat?name=${name}`,
);
const log = document.querySelector<HTMLUListElement>("#log")!;
const form = document.querySelector<HTMLFormElement>("#form")!;
const text = document.querySelector<HTMLInputElement>("#text")!;

ws.onmessage = (e) => {
  const li = document.createElement("li");
  li.textContent = e.data;
  log.append(li);
};

form.onsubmit = (e) => {
  e.preventDefault();
  if (text.value) ws.send(text.value);
  text.value = "";
};
