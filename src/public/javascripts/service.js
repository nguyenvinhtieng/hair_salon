const STATE = {
  CHOOSE: "CHOOSE",
  BOOKING: "BOOKING"
}
let global_servies = [];
let current_services = [];
let current_state = STATE.CHOOSE
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

function loadService() {
  $.ajax({
    url: '/get-services',
    type: 'GET',
    success: function (data) {
      if(data.status) {
        global_servies = data.services.services;
        renderDataServices();
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
  // delete current_services have quantity = 0 
  current_services = current_services.filter(service => service.quantity > 0);
  let tableReceipt = document.querySelector(".js-table-receipt tbody");
  tableReceipt.innerHTML = '';
  let html = ``
  current_services.forEach(service => {
    html += `<tr>
              <td>${service.title}</td>
              <td>${formatMoney(service.price)}</td>
              <td>${service.quantity}</td>
              <td>${formatMoney(service.price * service.quantity)}</td>
            </tr>`
  })
  tableReceipt.innerHTML += html;

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

// function 

window.addEventListener('load', function () {
  loadService();
  eventForBtn();
}, false);