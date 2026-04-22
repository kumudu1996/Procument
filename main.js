const agencyEl = document.getElementById('agency');
const inputSection = document.getElementById('calculator-inputs');
const dynamicFields = document.getElementById('dynamic-fields');
const calcBtn = document.getElementById('calcBtn');
const resultBox = document.getElementById('resultBox');
const resultBody = document.getElementById('resultBody');

agencyEl.addEventListener('change', () => {
  const val = agencyEl.value;
  inputSection.style.display = val ? 'block' : 'none';
  resultBox.style.display = 'none';

  if (val === 'SDC') {
    dynamicFields.innerHTML = `
      <div class="mb-3">
        <label class="form-label fw-bold">BOQ Amount (LKR)</label>
        <input type="number" id="boq" class="form-control form-control-lg" placeholder="0.00">
      </div>`;
  } else if (val === 'Other') {
    dynamicFields.innerHTML = `
      <div class="mb-3">
        <label class="form-label fw-bold">BOQ Amount (LKR)</label>
        <input type="number" id="boq" class="form-control" placeholder="0.00">
      </div>
      <div class="row g-3">
        <div class="col-md-4">
          <label class="form-label fw-bold">Without Prosum</label>
          <input type="number" id="w_pro" class="form-control" placeholder="0.00">
        </div>
        <div class="col-md-4">
          <label class="form-label fw-bold">Prosum</label>
          <input type="number" id="pro" class="form-control" placeholder="0.00">
        </div>
        <div class="col-md-4">
          <label class="form-label fw-bold">Profit %</label>
          <input type="number" id="rate" class="form-control" value="5">
        </div>
      </div>`;
  }
});

calcBtn.addEventListener('click', () => {
  const agency = agencyEl.value;
  const startStr = document.getElementById('startDate').value;
  const endStr = document.getElementById('endDate').value;

  if (!startStr || !endStr) {
    alert("කරුණාකර දිනයන් ඇතුළත් කරන්න.");
    return;
  }

  const start = new Date(startStr);
  const end = new Date(endStr);
  let contractAmt = 0;

  if (agency === 'SDC') {
    contractAmt = parseFloat(document.getElementById('boq').value) || 0;
  } else {
    const w = parseFloat(document.getElementById('w_pro').value) || 0;
    const p = parseFloat(document.getElementById('pro').value) || 0;
    const r = parseFloat(document.getElementById('rate').value) || 0;
    contractAmt = ((w * r / 100) + w + p);
  }

  // Calculation Logic
  const fmt = (num) => "Rs. " + num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const dt = (d) => d.toISOString().split('T')[0];
  const addM = (d, m) => { let res = new Date(d); res.setMonth(res.getMonth() + m); return res; };

  const data = [
    ["Contract Amount", fmt(contractAmt)],
    ["Start Date", dt(start)],
    ["End Date", dt(end)],
    ["Performance Security (5%)", fmt(contractAmt * 0.05)],
    ["Performance Security Valid Till", dt(addM(end, 1))],
    ["Security Submit On/Before", dt(start)],
    ["Insurance Submit On/Before", dt(start)],
    ["Contractor's All Risk Policy (150%)", fmt(contractAmt * 1.5)],
    ["All Risk Policy Valid Till", dt(addM(end, 13))],
    ["Third Party Insurance (150%)", fmt(contractAmt * 1.5)],
    ["Third Party Insurance Valid Till", dt(addM(end, 1))]
  ];

  resultBody.innerHTML = data.map(item => `
    <tr>
      <th>${item[0]}</th>
      <td>${item[1]}</td>
    </tr>
  `).join('');

  resultBox.style.display = 'block';
  resultBox.scrollIntoView({ behavior: 'smooth' });
});
