let global_servies = [];
let current_services = [];
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
        renderDataServices(data.services.services);
        global_servies = data.services.services;
      }
    }
  })
}
function renderDataServices(services) {
  let tableServices = document.querySelector(".js-table-services");
  let html = '';
  services.forEach(service => {
    html += `<tr id="${service.id}">`
    html += `<td>${service.title}</td>`
    html += `<td>${formatMoney(service.price)}</td>`
    html += `<td>
              <div class="l-table-quantity js-quantity">
                <button class="js-quantity-sub">-</button>
                <span>0</span>
                <button class="js-quantity-plus">+</button>
              </div>
            </td>`
    html += `<td class="js-money">0</td>`
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
            money.textContent = s.quantity * s.price;
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
              money.textContent = s.quantity * s.price;
            }
          }
        })
      }
    }, false);

  });
}



window.addEventListener('load', function () {
  loadService();
}, false);