let history = JSON.parse(localStorage.getItem("history")) || [];

history.push({
  name: studentName,
  class: studentClass,
  amount: amount,
  date: date,
  time: time,
  receiver: receiver
});

localStorage.setItem("history", JSON.stringify(history));
function openHistory() {
  let code = prompt("Enter Admin Code");

  if (code === "1234") {
    document.getElementById("historySection").style.display = "block";
    showHistory();
  } else {
    alert("Wrong Code");
  }
}
function showHistory() {
  let data = JSON.parse(localStorage.getItem("history")) || [];

  let output = "";

  data.forEach(item => {
    output += `
      <div style="border:1px solid #ccc; padding:10px; margin:10px;">
        <b>${item.name}</b> (${item.class})<br>
        ₹${item.amount}<br>
        ${item.date} ${item.time}<br>
        Received by: ${item.receiver}
      </div>
    `;
  });

  document.getElementById("historyBox").innerHTML = output;
}