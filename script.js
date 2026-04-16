
const ADMIN='917077746797';
const SCHOOL='Saraswata Sikshya Kendra, Dihirakul';
// Authorised receiver codes — add/change as needed
const VALID_CODES=['5678','SSK01','SSK02','G1','ADMIN'];
let pm='Cash', cur=null;

document.querySelectorAll('.pm').forEach(el=>el.addEventListener('click',()=>{
  document.querySelectorAll('.pm').forEach(e=>e.classList.remove('on'));
  el.classList.add('on'); pm=el.dataset.pm;
}));

function genId(){
  const d=new Date();
  return 'SSK-'+d.getFullYear().toString().slice(2)+
    String(d.getMonth()+1).padStart(2,'0')+
    String(d.getDate()).padStart(2,'0')+'-'+
    Math.random().toString(36).slice(2,6).toUpperCase();
}

function genLink(id){
  // Creates a unique receipt reference link
  const base=window.location.href.split('?')[0].split('#')[0];
  const token=btoa(id+':'+Date.now()).replace(/=/g,'').slice(0,16);
  return base+'?receipt='+id+'&token='+token;
}

function validate(){
  const checks=[
    ['fi-student','student'],['fi-parent','parent'],['fi-class','class'],
    ['fi-amount','amount'],['fi-purpose','purpose'],
    ['fi-receiver','receiver'],['fi-code','rcode']
  ];
  let ok=true;
  checks.forEach(([fid,iid])=>{
    const f=document.getElementById(fid);
    const v=document.getElementById(iid).value.trim();
    const bad=!v||(iid==='amount'&&parseFloat(v)<=0);
    f.classList.toggle('invalid',bad);
    if(bad)ok=false;
  });

  // Validate receiver code
  const code=document.getElementById('rcode').value.trim().toUpperCase();
  const validSet=VALID_CODES.map(c=>c.toUpperCase());
  if(!validSet.includes(code)){
    document.getElementById('fi-code').classList.add('invalid');
    document.getElementById('fi-code').querySelector('.err').textContent='Invalid code — not authorised';
    ok=false;
  }
  return ok;
}

function submit(){
  if(!validate()){
    document.querySelector('.field.invalid input, .field.invalid select')?.scrollIntoView({behavior:'smooth',block:'center'});
    return;
  }
  const now=new Date();
  const id=genId();
  cur={
    id,
    link:genLink(id),
    date:now.toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'}),
    time:now.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}),
    student:document.getElementById('student').value.trim(),
    parent:document.getElementById('parent').value.trim(),
    class:document.getElementById('class').value,
    phone:document.getElementById('phone').value.trim(),
    amount:parseFloat(document.getElementById('amount').value),
    purpose:document.getElementById('purpose').value,
    month:document.getElementById('month').value.trim()||'—',
    pm,
    receiver:document.getElementById('receiver').value.trim(),
    code:document.getElementById('rcode').value.trim().toUpperCase()
  };
saveData({
  name: cur.student,
  parent: cur.parent,
  class: cur.class,
  amount: cur.amount,
  phone: cur.phone,
  receiver: cur.receiver,
  date: cur.date + " " + cur.time
});
  // Fill receipt
  document.getElementById('r-id').textContent=cur.id;
  document.getElementById('r-dt').textContent=cur.date+' · '+cur.time;
  document.getElementById('r-amt').textContent='₹'+cur.amount.toLocaleString('en-IN');
  document.getElementById('r-student').textContent=cur.student;
  document.getElementById('r-parent').textContent=cur.parent;
  document.getElementById('r-class').textContent=cur.class;
  document.getElementById('r-purpose').textContent=cur.purpose;
  document.getElementById('r-month').textContent=cur.month;
  document.getElementById('r-pm').textContent=cur.pm;
  document.getElementById('r-receiver').textContent=cur.receiver+' [#'+cur.code+']';
  document.getElementById('r-link').textContent=cur.link;
  document.getElementById('r-link2').textContent=cur.link;

  const ph=cur.phone.replace(/\D/g,'');
  document.getElementById('wa-parent-btn').style.display=ph.length>=10?'block':'none';

  document.getElementById('fv').style.display='none';
  document.getElementById('rv').style.display='block';
  window.scrollTo(0,0);
  setTimeout(()=>autoSendAdmin(),900);
}

function buildMsg(e,forAdmin){
  return [
    '*'+SCHOOL+'*',
    forAdmin?'*🔔 NEW FEE RECEIPT GENERATED*':'*✅ Fee Receipt — '+SCHOOL+'*',
    '*Receipt No:* '+e.id,
    '*Date:* '+e.date+' at '+e.time,
    '*Student:* '+e.student,
    '*Parent:* '+e.parent,
    '*Class:* '+e.class,
    forAdmin?'*Parent WhatsApp:* '+e.phone:'',
    '*Amount Paid:* ₹'+e.amount.toLocaleString('en-IN'),
    '*Purpose:* '+e.purpose,
    '*Period:* '+e.month,
    '*Payment:* '+e.pm,
    '*Received By:* '+e.receiver+' []',
    
    forAdmin?'_Auto-sent by SSK Receipt System_':'_Thank you! Keep this receipt for your records._'
  ].filter(Boolean).join('\n');
}

function autoSendAdmin(){
  window.open('https://wa.me/'+ADMIN+'?text='+encodeURIComponent(buildMsg(cur,true)),'_blank');
}

function sendToAdmin(){
  window.open('https://wa.me/'+ADMIN+'?text='+encodeURIComponent(buildMsg(cur,true)),'_blank');
}

function sendToParent(){
  let ph=cur.phone.replace(/\D/g,'');
  if(ph.length===10)ph='91'+ph;
  if(ph.startsWith('0'))ph='91'+ph.slice(1);
  window.open('https://wa.me/'+ph+'?text='+encodeURIComponent(buildMsg(cur,false)),'_blank');
}

function copyLink(){
  navigator.clipboard.writeText(cur.link).then(()=>{
    const b=document.querySelector('.act.outline:nth-child(2)');
    b.textContent='✓ Copied!';
    setTimeout(()=>b.textContent='🔗 Copy Link',2000);
  });
}

function reset(){
  document.getElementById('fv').style.display='block';
  document.getElementById('rv').style.display='none';
  document.querySelectorAll('input,select').forEach(el=>el.value='');
  document.querySelectorAll('.pm').forEach(e=>e.classList.remove('on'));
  document.querySelector('[data-pm="Cash"]').classList.add('on');
  pm='Cash';
  document.querySelectorAll('.field').forEach(f=>f.classList.remove('invalid'));
  window.scrollTo(0,0);
}

// 🔐 ADMIN CODE (yahi change karna)
const ADMIN_CODE = "1234";

document.getElementById("adminBtn").onclick = function(){
  let code = prompt("Enter Admin Code");

  if(code === ADMIN_CODE){
    document.getElementById("adminPanel").style.display = "flex";
    loadHistory();
  }else{
    alert("Wrong Code ❌");
  }
};

// 📦 Save data function (jab payment ho tab call karo)
function saveData(data){
  let old = JSON.parse(localStorage.getItem("payments")) || [];
  old.push(data);
  localStorage.setItem("payments", JSON.stringify(old));
}

// 📊 Load history
function loadHistory(){
  let data = JSON.parse(localStorage.getItem("payments")) || [];

  let html = `
    <table border="1" cellpadding="8" style="width:100%; border-collapse:collapse;">
      <tr>
        <th>Guardian</th>
        <th>Student</th>
        <th>Class</th>
        <th>Amount</th>
        <th>Phone</th>
        <th>Receiver</th>
        <th>Date</th>
        <th>Action</th>
      </tr>
  `;

  data.forEach((d,i)=>{
    html += `
      <tr>
        <td>${d.parent || '-'}</td>
        <td>${d.name}</td>
        <td>${d.class}</td>
        <td>₹${d.amount}</td>
        <td>${d.phone}</td>
        <td>${d.receiver || '-'}</td>
        <td>${d.date}</td>
        <td><button onclick="deleteOne(${i})">Delete</button></td>
      </tr>
    `;
  });

  html += `</table>`;

  document.getElementById("history").innerHTML = html;
}

// ❌ delete one
function deleteOne(i){
  let data = JSON.parse(localStorage.getItem("payments")) || [];
  data.splice(i,1);
  localStorage.setItem("payments", JSON.stringify(data));
  loadHistory();
}

// ❌ delete all
function clearData(){
  localStorage.removeItem("payments");
  loadHistory();
}

function closeAdmin(){
  document.getElementById("adminPanel").style.display = "none";
  window.scrollTo(0,0);
}

// 🖨 print
function printPage(){
  window.print();
}
function printAdminLandscape(){
  let content = document.getElementById("history").innerHTML;

  let newWin = window.open("", "", "width=1000,height=700");

  newWin.document.write(`
    <html>
      <head>
        <title>Admin History</title>
        <style>
          @page {
            size: landscape;
          }
          body {
            font-family: Arial;
            padding: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid black;
            padding: 8px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <h2>Admin Payment History</h2>
        ${content}
      </body>
    </html>
  `);

  newwin.document.close();

newwin.onload = function () {
  newwin.print();
};
}
window.addEventListener("load", function(){

  document.getElementById("printBtn").addEventListener("click", printAdminLandscape);

});