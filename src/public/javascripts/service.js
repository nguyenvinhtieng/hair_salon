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
    current_services = current_services.filter(service => service.quantity > 0);
    service_print_receipt = current_services;

    let totalQuantity = 0;
    current_services.forEach(s => {
      totalQuantity += s.quantity;
    })
    if(totalQuantity == 0)  {
      const Toast = Swal.mixin({
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      
      Toast.fire({
        icon: 'error',
        title: 'Không có dịch vụ nào được chọn!'
      })

      return;
    }

    current_state = STATE.BOOKING;
    updateLayerActive();
    renderToReceipt();
  }, false);

}
function onChangeBaberFee() {
  let barderFee = document.querySelector(".js-barber-fee")
  barderFee.addEventListener('change', function (e) {
    updateBaberFee()
  }, false);
  
}


function updateBaberFee() {
  let barderFee = document.querySelector(".js-barber-fee")
  let fee = barderFee.value;
  let total = 0
  service_print_receipt.forEach(s=> {
    total += s.price * s.quantity
  })
  let cal = total * fee / 100;
  let bbFee = document.querySelector(".js-fee-bb")
  bbFee.innerHTML = formatMoney(cal);
}
// function 
function eventForReceiptArea() {
  let btnPayment = document.querySelector(".js-btn-payment");
  btnPayment.addEventListener('click', function () {
    let customerName = document.querySelector(".js-customer-name").value;
    let customerPhone = document.querySelector(".js-customer-phone").value;

    if(customerName == '' || customerPhone == '') {
      const Toast = Swal.mixin({
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      
      Toast.fire({
        icon: 'error',
        title: 'Vui lòng điền đủ thông tin tên và số điện thoại!'
      })
      return;

    }
    Swal.fire({
      title: 'Xác nhận!',
      text: 'Các thông tin đã chính xác? Nhấn đồng ý để hoàn tất hóa đơn!',
      // icon: 'success',
      showDenyButton: false,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Đồng Ý',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if(result.isConfirmed){
        bookingService();
      }
    })
  }, false);

  let btnCancel = document.querySelector(".js-btn-cancel");
  btnCancel.addEventListener('click', function () {
    Swal.fire({
      title: 'Xác nhận!',
      text: 'Bạn có chắc muốn xóa các dịch vụ đã chọn?',
      icon: 'warning',
      showDenyButton: true,
      showCancelButton: true,
      showConfirmButton: false,
      confirmButtonText: 'Hủy chọn',
      denyButtonText: `Xóa tất cả`,
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isDenied) {
        service_print_receipt = [];
        renderToReceipt();
        updateBaberFee();
        current_state = STATE.SERVICE;
        updateLayerActive();
      }
    })

  }, false);


  let btnBack = document.querySelector(".js-btn-back");
  btnBack.addEventListener('click', function () {
    current_state = STATE.SERVICE;
    updateLayerActive();
  });

}


function updateLayerActive() {
  let layer01 = document.querySelector(".js-layer-01")
  let layer02 = document.querySelector(".js-layer-02")

  if(current_state == STATE.SERVICE) {
    layer01.classList.remove("is-active");
    layer02.classList.add("is-active");
  }else {
    layer01.classList.add("is-active");
    layer02.classList.remove("is-active");
  }
}

function bookingService() {
  let customerName = document.querySelector(".js-customer-name").value;
  let customerPhone = document.querySelector(".js-customer-phone").value;
  let barberId = document.querySelector(".js-barber-list").value;
  let barberFree = document.querySelector(".js-barber-fee").value;
  let note = document.querySelector(".js-note").value;
  let anotherFee = document.querySelector(".js-another-fee").value;


  let total = 0;
  service_print_receipt.forEach(s => {
    total += s.price * s.quantity;
  });
  total += Number(anotherFee);
  let data = {
    customer_name: customerName,
    customer_phone: customerPhone,
    barber_id: barberId,
    barber_fee: Number(barberFree),
    services: service_print_receipt,
    note: note,
    another_fee: Number(anotherFee),
    total: total
  }

  $.ajax({
    url: "/booking",
    type: "POST",
    data: JSON.stringify(data),
    contentType: "application/json",
    success: function (data) {
      if(data.status) {
        current_services = [];
        service_print_receipt = [];
        renderToReceipt();
        updateBaberFee();
        current_state = STATE.SERVICE;
        updateLayerActive();
        renderDataServices();
        Swal.fire({
          title: 'Thành công!',
          text: 'Đã đặt thành công!',
          icon: 'success'
        })
      }
    },
    error: function (err) {
      console.log(err);
    }
  });
}

function onChangeAnotherFee(){
  let inputAnotherFee = document.querySelector(".js-another-fee");
  let jsTotalMoney = document.querySelector(".js-total-money");
  let barberFee = document.querySelector(".js-fee-bb");
  let bbF = document.querySelector(".js-barber-fee");
  inputAnotherFee.addEventListener('keyup', function (e) {
    let val = e.target.value;
    if(val == '') {
      val = 0;
    }
    let totalMoney = 0;
    service_print_receipt.forEach(s => {
      totalMoney += s.price * s.quantity;
    });
    // if(val == 0) {
    let valBB = bbF.value;
    if(valBB == '') {
      valBB = 0;
    }
    jsTotalMoney.innerHTML = formatMoney(Number(val) + totalMoney);
    barberFee.innerHTML = formatMoney((Number(val) + totalMoney) * valBB / 100);


  }, false);
}

window.addEventListener('load', function () {
  fetchData();
  eventForBtn();
  onChangeBaberFee();
  eventForReceiptArea();
  onChangeAnotherFee();
  document.querySelectorAll(".l-header__item")[1].classList.add("is-active")
}, false);


