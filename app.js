document.addEventListener("DOMContentLoaded", () => {

  const API_URL = "PASTE_YOUR_GOOGLE_SCRIPT_URL";

  const countries = {

    Afghanistan:{
      provinces:["کابل","هرات","بلخ"],
      bank:{
        title:"عزیزی بانک افغانستان",
        number:"909090090009",
        owner:"فرهاد احسان"
      }
    },

    Iran:{
      provinces:["تهران","مشهد","اصفهان"],
      bank:{
        title:"بانک ملت ایران",
        number:"6037990000000000",
        owner:"ذین العابدین"
      }
    },

    Turkey:{
      provinces:["استانبول","انقره"],
      bank:{
        title:"Ziraat Bank",
        number:"90809099",
        owner:"علی رضا"
      }
    }

  };

  const fromCountry = document.getElementById("fromCountry");
  const toCountry = document.getElementById("toCountry");
  const province = document.getElementById("province");
  const bankCard = document.getElementById("bankCard");

  function loadCountries(){

    fromCountry.innerHTML = `<option value="">کشور مبدا</option>`;
    toCountry.innerHTML = `<option value="">کشور مقصد</option>`;

    Object.keys(countries).forEach(country => {

      fromCountry.innerHTML += `<option value="${country}">${country}</option>`;
      toCountry.innerHTML += `<option value="${country}">${country}</option>`;

    });

  }

  loadCountries();

  // نمایش کارت مطابق کشور مبدا
  fromCountry.addEventListener("change", () => {

    const c = countries[fromCountry.value];

    if(!c) return;

    bankCard.innerHTML = `

      <div class="bank-real-card">

        <div class="bank-name">
          ${c.bank.title}
        </div>

        <div class="bank-number">
          ${c.bank.number}
        </div>

        <div class="bank-owner">
          ${c.bank.owner}
        </div>

        <div class="bank-country">
          ${fromCountry.value}
        </div>

      </div>

    `;

  });

  // ولایت مقصد
  toCountry.addEventListener("change", () => {

    province.innerHTML = "";

    const c = countries[toCountry.value];

    if(!c) return;

    c.provinces.forEach(p => {
      province.innerHTML += `<option>${p}</option>`;
    });

  });

  // فعال شدن آپلود
  confirmPayment.addEventListener("change", () => {

    const uploadBox = document.getElementById("uploadBox");
    const submitBtn = document.getElementById("submitBtn");

    if(confirmPayment.checked){
      uploadBox.classList.remove("d-none");
      submitBtn.disabled = false;
    } else {
      uploadBox.classList.add("d-none");
      submitBtn.disabled = true;
    }

  });

  // ثبت فرم
  document.getElementById("submitBtn").addEventListener("click", async () => {

    const senderName = document.getElementById("senderName").value;
    const receiverName = document.getElementById("receiverName").value;
    const phone = document.getElementById("phone").value;

    const receipt = document.getElementById("receipt").files[0];

    if(!receipt){
      alert("رسید را انتخاب کنید");
      return;
    }

    const reader = new FileReader();

    reader.onload = async function(){

      const base64 = reader.result.split(",")[1];

      const payload = {

        senderName,
        receiverName,
        fromCountry:fromCountry.value,
        toCountry:toCountry.value,
        province:province.value,
        phone,

        file:base64,
        fileName:receipt.name,
        fileType:receipt.type

      };

      const res = await fetch(API_URL,{
        method:"POST",
        body:JSON.stringify(payload)
      });

      const data = await res.json();

      document.getElementById("successBox").classList.remove("d-none");

      document.getElementById("successBox").innerHTML = `
        حواله موفقانه ثبت شد<br>
        کد پیگیری:
        <b>${data.trackingCode}</b>
      `;

    };

    reader.readAsDataURL(receipt);

  });

});
