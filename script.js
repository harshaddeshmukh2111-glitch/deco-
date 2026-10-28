const componentInfo = {
  cu: { title: "Control Unit (CU)", symbol: "⌘", description: "Coordinates CPU activity by interpreting instructions and directing the movement of data between components.", role: "Directs and coordinates" },
  alu: { title: "Arithmetic Logic Unit (ALU)", symbol: "∑", description: "Performs arithmetic operations such as addition and subtraction, plus logical comparisons such as AND and greater-than.", role: "Calculations and logic" },
  registers: { title: "Registers", symbol: "▤", description: "Registers are very small, fast storage locations inside the CPU that hold values, instructions, or addresses currently in use.", role: "Holds immediate working data" }
};

const nodes = document.querySelectorAll(".diagram-node");
function selectComponent(node) {
  const data = componentInfo[node.dataset.component];
  if (!data) return;
  nodes.forEach(item => item.classList.toggle("selected", item === node));
  document.getElementById("componentSymbol").textContent = data.symbol;
  document.getElementById("componentTitle").textContent = data.title;
  document.getElementById("componentDescription").textContent = data.description;
  document.getElementById("componentRole").textContent = data.role;
}
nodes.forEach(node => {
  node.addEventListener("click", () => selectComponent(node));
  node.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectComponent(node);
    }
  });
});

const cycleSteps = [
  "Fetch: the CPU gets the instruction that tells it to add two values.",
  "Decode: the control logic identifies the instruction as an addition operation.",
  "Execute: the ALU adds the two values, 2 + 3, to produce 5.",
  "Store / continue: the result 5 can be kept in a register or written to memory. The CPU continues with the next instruction."
];
let cycleIndex = 0;
const cycleButton = document.getElementById("cycleButton");
cycleButton.addEventListener("click", () => {
  document.getElementById("cycleExplanation").textContent = cycleSteps[cycleIndex];
  document.querySelectorAll(".progress-dot").forEach((dot, index) => dot.classList.toggle("active", index <= cycleIndex));
  cycleIndex++;
  if (cycleIndex === cycleSteps.length) {
    cycleButton.innerHTML = "Run again ↻";
    cycleIndex = 0;
  } else {
    cycleButton.innerHTML = "Next step →";
  }
  if (cycleIndex === 0) {
    cycleButton.addEventListener("click", () => {
      document.getElementById("cycleExplanation").textContent = "Press the button to step through a simplified instruction cycle.";
    }, { once: true });
  }
});

const questions = [
  { q: "What is the main role of the CPU?", options: ["Permanently store every file", "Execute program instructions", "Display images on the monitor by itself", "Provide internet access"], answer: 1, explain: "The CPU executes program instructions and coordinates processing." },
  { q: "Which CPU component performs arithmetic and logical operations?", options: ["Control Unit", "SSD controller only", "Arithmetic Logic Unit (ALU)", "Power supply"], answer: 2, explain: "The ALU handles arithmetic and logical operations." },
  { q: "What does the Control Unit mainly do?", options: ["Directs and coordinates instruction processing", "Stores files after shutdown", "Cools the processor", "Supplies electricity to the whole PC"], answer: 0, explain: "The Control Unit interprets instructions and coordinates CPU activity." },
  { q: "Which statement about CPU clock speed is most accurate?", options: ["It alone determines all performance", "It is measured in gigabytes", "A higher number always means a faster CPU in every task", "It indicates clock cycles per second, but is not the only performance factor"], answer: 3, explain: "Clock speed is measured in hertz; architecture, cores, power, and workload also matter." },
  { q: "What is the usual order of the simplified instruction cycle?", options: ["Decode → Store → Fetch → Print", "Fetch → Decode → Execute → Store/continue", "Execute → Fetch → Delete → Decode", "Store → Execute → Fetch → Decode"], answer: 1, explain: "A simplified cycle fetches an instruction, decodes it, executes it, then stores a result or continues." }
];
let questionIndex = 0;
let score = 0;
let locked = false;
const questionText = document.getElementById("questionText");
const answersEl = document.getElementById("answers");
const nextButton = document.getElementById("nextQuestion");
const feedbackEl = document.getElementById("quizFeedback");

function renderQuestion() {
  const item = questions[questionIndex];
  locked = false;
  document.getElementById("questionCount").textContent = `QUESTION ${String(questionIndex + 1).padStart(2, "0")} / ${String(questions.length).padStart(2, "0")}`;
  document.getElementById("quizProgress").style.width = `${(questionIndex / questions.length) * 100}%`;
  questionText.textContent = item.q;
  answersEl.innerHTML = "";
  feedbackEl.textContent = "Choose one answer to continue.";
  nextButton.disabled = true;
  nextButton.textContent = questionIndex === questions.length - 1 ? "See results →" : "Next question →";
  item.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-option";
    button.innerHTML = `<span class="letter">${String.fromCharCode(65 + index)}</span><span></span>`;
    button.querySelector("span:last-child").textContent = option;
    button.addEventListener("click", () => chooseAnswer(index));
    answersEl.appendChild(button);
  });
}
function chooseAnswer(index) {
  if (locked) return;
  locked = true;
  const item = questions[questionIndex];
  const buttons = [...answersEl.querySelectorAll("button")];
  buttons.forEach((button, i) => {
    button.disabled = true;
    if (i === item.answer) button.classList.add("correct");
    else if (i === index) button.classList.add("wrong");
  });
  if (index === item.answer) {
    score++;
    feedbackEl.textContent = `Correct! ${item.explain}`;
  } else {
    feedbackEl.textContent = `Not quite. ${item.explain}`;
  }
  document.getElementById("quizProgress").style.width = `${((questionIndex + 1) / questions.length) * 100}%`;
  nextButton.disabled = false;
}
nextButton.addEventListener("click", () => {
  if (!locked) return;
  if (questionIndex < questions.length - 1) {
    questionIndex++;
    renderQuestion();
  } else {
    document.getElementById("questionCount").textContent = "QUIZ COMPLETE";
    document.getElementById("quizProgress").style.width = "100%";
    questionText.textContent = `You scored ${score} out of ${questions.length}!`;
    answersEl.innerHTML = `<p class="result-message">${score === questions.length ? "Excellent work — you have a strong grasp of the basics." : score >= 3 ? "Good effort! Review the sections above to strengthen your understanding." : "Keep learning! Revisit the architecture and instruction-cycle sections, then try again."}</p>`;
    feedbackEl.textContent = "Your score is shown above.";
    nextButton.disabled = false;
    nextButton.textContent = "Try again ↻";
    nextButton.onclick = () => {
      questionIndex = 0; score = 0; locked = false;
      nextButton.onclick = null;
      renderQuestion();
    };
  }
});
renderQuestion();

const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));