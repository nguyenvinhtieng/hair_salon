let allServices = [];
let allBarbers = [];
let allOrders = [];
let currentOrder = {}
let renderOrders = []
function fetchDataService() {
  $.ajax({
    url: '/get-data',
    type: 'GET',
    success: function (data) {
      if(data.status) {
        allServices = data.data.services;
        allBarbers = data.data.babers
      }
    }
  })
}


function formatMoney(money) {
  return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function formatTime(time) {
  let date = new Date(time)
  return `${date.getHours()}:${date.getMinutes()} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}
function formatDate(time) {
  let date = new Date(time)
  return `${date.getFullYear()}-${(date.getMonth() + 1) > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`}-${(date.getDate()) > 9 ? date.getDate() : `0${date.getDate()}`}`
}
function fetchData() {
  $.ajax({
    url: "/get-orders",
    type: "GET",
    success: function (data) {
      allOrders = data.data
      renderOrders = data.data
      renderTableOrder()
    }
  })
}

function renderTableOrder() {
  let orderTable = document.querySelector(".js-table-orders tbody");
  let countEl = document.querySelector(".js-count")
  let totalMoeny = document.querySelector(".js-tt-money")
  orderTable.innerHTML = "";
  let t = 0
  let html = ``
  renderOrders.forEach((order, index) => {
    let barber = allBarbers.find(barber => barber.id == order.barber_id)

    html += `<tr id="${order._id}" class="js-row-data">
                <td>${order._id}</td>
                <td>${barber.name}</td>
                <td>${formatTime(order.created_at)}</td>
                <td>${formatMoney(order.total * order.barber_fee / 100)}</td>
              </tr>`
    t += order.total * order.barber_fee / 100
  });
  orderTable.innerHTML = html;
  countEl.innerHTML = renderOrders.length
  totalMoeny.innerHTML = formatMoney(t)
  addEventClickRow()
}

function addEventClickRow() {
  let rows = document.querySelectorAll(".js-row-data");
  rows.forEach(row => {
    row.addEventListener("click", function () {
      let id = this.id;
      currentOrder = allOrders.find(order => order._id == id)
      renderOrderDetail()
    })
  })
}


function renderOrderDetail() {
  let orderDate = document.querySelector(".js-order-date")
  let customerName = document.querySelector(".js-customer-name")
  let customerPhone = document.querySelector(".js-customer-phone")
  let tableDetail = document.querySelector(".js-table-orders-detail tbody")
  let note = document.querySelector(".js-note")
  let anotherFee = document.querySelector(".js-another-fee")
  let barberName = document.querySelector(".js-barber-name")
  let barberFee = document.querySelector(".js-barber-fee")
  let totalEl = document.querySelector(".js-total-money")
  let bbFeeMoney = document.querySelector(".js-bb-fee-money")

  orderDate.innerHTML = formatTime(currentOrder.created_at)
  customerName.value = currentOrder.customer_name
  customerPhone.value = currentOrder.customer_phone
  note.value = currentOrder.note
  anotherFee.value = currentOrder.another_fee
  let barber = allBarbers.find(barber => barber.id == currentOrder.barber_id)
  barberName.innerHTML = barber.name
  barberFee.innerHTML = formatMoney(currentOrder.barber_fee) || 0
  totalEl.innerHTML = formatMoney(currentOrder.total)
  bbFeeMoney.innerHTML = formatMoney(currentOrder.total / 100 * currentOrder.barber_fee) || 0


  tableDetail.innerHTML = "";
  let html = ``
  currentOrder.services.forEach(service => {
    html += `<tr>
              <td>${service.title}</td>
              <td>${formatMoney(service.price)}</td>
              <td>${service.quantity}</td>
              <td>${formatMoney(service.price * service.quantity)}</td>
            </tr>`
  })
  tableDetail.innerHTML = html;

}

function filterEvent() {
  let barberName = document.querySelector(".js-filter-barber")
  let fromDate = document.querySelector(".js-filter-from-date")
  let toDate = document.querySelector(".js-filter-to-date")

  let btnFilter = document.querySelector(".js-filter")
  let btnReset = document.querySelector(".js-clear-filter")

  btnFilter.addEventListener("click", function () {
    let ordersAfterFilter = []
    if(barberName.value != "" && fromDate.value != "" && toDate.value != "") {
      return
    }
    allOrders.forEach(order => {
      let barber = allBarbers.find(barber => barber.id == order.barber_id)

      if(barberName.value != "") {
        if(!barber.name.toLowerCase().includes(barberName.value.toLowerCase())) {
          return
        }
      }
      if(fromDate.value != "" && toDate.value != "") {
        let from = new Date(fromDate.value).setHours(0,0,0,0)
        let to = new Date(toDate.value).setHours(0,0,0,0)
        let orderDate = new Date(order.created_at).setHours(0,0,0,0)
        if(orderDate < from || orderDate > to) {
          return
        }
      }else if(fromDate.value != "" && toDate.value == "") {
        let from = new Date(fromDate.value).setHours(0,0,0,0)
        let orderDate = new Date(order.created_at).setHours(0,0,0,0)
        if(orderDate < from) {
          return;
        }
      } else if(fromDate.value == "" && toDate.value != "") {
        let to = new Date(toDate.value).setHours(0,0,0,0)
        let orderDate = new Date(order.created_at).setHours(0,0,0,0)
        console.log(orderDate > to);
        if(orderDate > to) {
          return;
        }
      }
      console.log("ordersAfterFilter", ordersAfterFilter);
      console.log("order", order);
      ordersAfterFilter.push(order)
      console.log("ordersAfterFilter", ordersAfterFilter);
      console.log("--------------------")
    })
    // remove duplicate order
    ordersAfterFilter = ordersAfterFilter.filter((order, index, self) => {
      return self.findIndex(o => o._id === order._id) === index
    })
    renderOrders = ordersAfterFilter
    renderTableOrder()
  })

  btnReset.addEventListener("click", function () {

    barberName.value = ""
    fromDate.value = ""
    toDate.value = ""
    renderOrders = allOrders
    renderTableOrder()
  })
}


window.addEventListener('load', function () {
  fetchData()
  fetchDataService()
  filterEvent()
  document.querySelectorAll(".l-header__item")[3].classList.add("is-active")
});