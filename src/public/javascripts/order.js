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
  // it
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
  orderTable.innerHTML = "";
  let html = ``
  renderOrders.forEach((order, index) => {
    html += `<tr id="${order._id}" class="js-row-data">
                <td><input type="checkbox" /></td>
                <td>${order._id}</td>
                <td>${order.customer_name}</td>
                <td>${formatTime(order.created_at)}</td>
                <td>${formatMoney(order.total)}</td>
              </tr>`
  });
  orderTable.innerHTML = html;
  countEl.innerHTML = renderOrders.length
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


function eventDel() {
  let btnDel = document.querySelector(".js-btn-delete")
  btnDel.addEventListener("click", function () {
    // get all checked
    let checked = document.querySelectorAll(".js-table-orders tbody input:checked")
    // console.log("checked::", checked)
    let ids = []
    checked.forEach(check => {
      ids.push(check.parentElement.parentElement.id)
    })
    if(ids.length == 0) {
      Swal.fire(
        'Thông báo!',
        'Vui lòng chọn đơn hàng cần xóa.',
        'warning'
      )
      return
    }

    Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa?',
      text: "Bạn sẽ không thể khôi phục lại dữ liệu này!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        $.ajax({
          url: "/delete-order",
          type: "POST",
          data: {
            ids: ids
          },
          success: function (data) {
            if (data.status) {
              Swal.fire(
                'Đã xóa!',
                'Dữ liệu đã được xóa.',
                'success'
              )
              fetchData()
              renderOrderDetail(true)
            }
          }
        })
      }
    })
  })
}



function renderOrderDetail(is_clear = false) {
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

  if(is_clear) {
    orderDate.innerHTML = ""
    customerName.value = ""
    customerPhone.value = ""
    note.value = ""
    anotherFee.value = ""
    barberName.innerHTML = ""
    barberFee.innerHTML = ""
    totalEl.innerHTML = ""
    bbFeeMoney.innerHTML = ""
    tableDetail.innerHTML = ""
    return
  }

  orderDate.innerHTML = formatTime(currentOrder.created_at)
  customerName.value = currentOrder.customer_name
  customerPhone.value = currentOrder.customer_phone
  note.value = currentOrder.note
  anotherFee.value = currentOrder.another_fee
  let barber = allBarbers.find(barber => barber.id == currentOrder.barber_id)
  barberName.innerHTML = barber.name
  barberFee.innerHTML = ( formatMoney(currentOrder.barber_fee) || 0 ) + "%"
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
  let customerName = document.querySelector(".js-filter-customer-name")
  let date = document.querySelector(".js-filter-date")
  let phoneNumber = document.querySelector(".js-filter-phone")
  let btnFilter = document.querySelector(".js-filter")
  let btnReset = document.querySelector(".js-clear-filter")

  btnFilter.addEventListener("click", function () {
    let ordersAfterFilter = []
    if(customerName.value == "" && date.value == "" && phoneNumber.value == "") {
      return
    }


    allOrders.forEach(order => {
      if(customerName.value != "") {
        if(!order.customer_name.toLowerCase().includes(customerName.value.toLowerCase())) {
          return
        }
      }

      if(date.value != "") {
        if(date.value != formatDate(order.created_at)) {
          return
        }
      }

      if(phoneNumber.value != "") {
        if(!order.customer_phone.includes(phoneNumber.value)) {
          return
        }
      }

      ordersAfterFilter.push(order)
    })

    renderOrders = ordersAfterFilter
    renderTableOrder()
  })

  btnReset.addEventListener("click", function () {
    customerName.value = ""
    date.value = ""
    phoneNumber.value = ""
    renderOrders = allOrders
    renderTableOrder()
  })
}


window.addEventListener('load', function () {
  fetchData()
  fetchDataService()
  eventDel()
  filterEvent()
  document.querySelectorAll(".l-header__item")[2].classList.add("is-active")
});