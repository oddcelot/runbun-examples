import confetti from "canvas-confetti";

const res = await fetch("/api/hello/preview");
const { message, bun }: { message: string; bun: string } = await res.json();
document.querySelector("#msg")!.textContent = `${message} (Bun ${bun})`;

const party = () =>
  confetti({ particleCount: 150, spread: 70, origin: { y: 0.7 } });
document.querySelector<HTMLButtonElement>("#party")!.onclick = party;
party();
