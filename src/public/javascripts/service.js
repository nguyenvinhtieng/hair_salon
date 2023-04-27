const STATE = {
  CHOOSE: "CHOOSE",
  BOOKING: "BOOKING"
}
let global_servies = [];
let current_services = [];
let service_print_receipt = [];
let current_state = STATE.CHOOSE
let barbers = []
/*
  {
    id: 1,
    title: "Cắt tóc",
    quantity: 0,
    price: 0,
    pakage: 0
  }
*/
function formatMoney(money) {
  return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function fetchData() {
  $.ajax({
    url: '/get-data',
    type: 'GET',
    success: function (data) {
      if(data.status) {
        global_servies = data.data.services;
        barbers = data.data.babers
        renderDataServices();
        renderBarber();
      }
    }
  })
}

function renderDataServices() {
  let tableServices = document.querySelector(".js-table-services tbody");
  let html = '';
  tableServices.innerHTML = '';
  global_servies.forEach(service => {
    html += `<tr id="${service.id}">`
    html += `<td>${service.title}</td>`
    html += `<td class="align-right">${formatMoney(service.price)}</td>`
    html += `<td>
              <div class="l-table-quantity js-quantity">
                <button class="js-quantity-sub">-</button>
                <span>0</span>
                <button class="js-quantity-plus">+</button>
              </div>
            </td>`
    html += `<td class="js-money align-right">0</td>`
    html += `</tr>`
  });
  tableServices.innerHTML += html;


  initEventForTable();
}

function renderBarber() {
  let listBaber = document.querySelector(".js-barber-list")
  listBaber.innerHTML = '';
  barbers.forEach(b => {
    listBaber.innerHTML += `<option value="${b.id}">${b.name}</option>`
  })
}
function initEventForTable() {
  let tableServices = document.querySelector(".js-table-services");
  let serviceTr = tableServices.querySelectorAll("tr");
  serviceTr.forEach(service => {
    let serviceId = service.getAttribute("id");
    let btnPlus = service.querySelector(".js-quantity-plus");
    let btnSub = service.querySelector(".js-quantity-sub");
    let quantity = service.querySelector(".js-quantity span");
    let money = service.querySelector(".js-money");
    if(btnPlus == null || btnSub == null || quantity == null || money == null) return;
    if(btnPlus == undefined || btnSub == undefined || quantity == undefined || money == undefined) return;
    btnPlus.addEventListener('click', function () {
      let service = current_services.find(s => s.id == serviceId);
      let serviceInGlobal = global_servies.find(s => s.id == serviceId);
      if(service) {
        current_services.forEach(s => {
          if(s.id == serviceId) {
            s.quantity += 1;
            quantity.textContent = s.quantity;
            money.textContent = formatMoney(s.quantity * s.price);
          }
        })
      } else {
        let newService = {
          id: serviceInGlobal.id,
          title: serviceInGlobal.title,
          quantity: 1,
          price: serviceInGlobal.price,
          pakage: null
        }
        current_services.push(newService);
        quantity.textContent = 1;
        money.textContent = formatMoney(serviceInGlobal.price);
      }
    }, false);


    btnSub.addEventListener('click', function () {
      let service = current_services.find(s => s.id == serviceId);
      if(service) {
        current_services.forEach(s => {
          if(s.id == serviceId) {
            if(s.quantity > 0) {
              s.quantity -= 1;
              quantity.textContent = s.quantity;
              money.textContent = formatMoney(s.quantity * s.price);
            }
          }
        })
      }
    }, false);

  });
}

function renderToReceipt() {
  let receiptDate = document.querySelector(".js-receipt-date")
  let today = new Date()
  receiptDate.innerHTML = `${today.getDate()} / ${today.getMonth() + 1} / ${today.getFullYear()}`
  current_services = current_services.filter(service => service.quantity > 0);
  service_print_receipt = current_services;
  let tableReceipt = document.querySelector(".js-table-receipt tbody");
  tableReceipt.innerHTML = '';
  let html = ``
  service_print_receipt.forEach(service => {
    html += `<tr>
              <td>${service.title}</td>
              <td>${formatMoney(service.price)}</td>
              <td>${service.quantity}</td>
              <td>${formatMoney(service.price * service.quantity)}</td>
            </tr>`
  })

  tableReceipt.innerHTML += html;
  calcTotal()
}

function calcTotal() {
  let totalMoney = document.querySelector(".js-total-money")
  let total = 0 ;
  service_print_receipt.forEach(s => {
    total += s.price * s.quantity;
  })
  totalMoney.innerHTML = formatMoney(total)
}

function eventForBtn() {
  let btnClearData = document.querySelector(".js-clear-data");
  btnClearData.addEventListener('click', function () {
    current_services = [];
    renderDataServices();
  }, false);


  let btnBook = document.querySelector(".js-btn-book");
  btnBook.addEventListener('click', function () {
    current_state = STATE.BOOKING;
    renderToReceipt();
  }, false);

}
function onChangeBaberFee() {
  let barderFee = document.querySelector(".js-barber-fee")
  barderFee.addEventListener('change', function (e) {
    let fee = e.target.value;
    let total = 0
    service_print_receipt.forEach(s=> {
      total += s.price * s.quantity
    })
    let cal = total * fee / 100;
    let bbFee = document.querySelector(".js-fee-bb")
    bbFee.innerHTML = formatMoney(cal);
  }, false);
  
}
// function 

window.addEventListener('load', function () {
  fetchData();
  eventForBtn();
  onChangeBaberFee();
}, false);