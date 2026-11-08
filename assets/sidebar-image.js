document.addEventListener("DOMContentLoaded", () => {

  const data = [
    { 
      url: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhJqiN__nZ2YlnK5k719tGAokvB9T_bAoQ1xu9NxhVcCpnoAfpGpgqyY4TB9R53IXu89Ytmlu3ie03zfypHn_UAx-cmCcMXrufuCibcN7ZfHZqReM6Y7yHySRdvl5J9LsOxGshoj3ezjAzkji0vxGcuGtRqIDlrD4UQSqk9sN8e2PEt2Dx6ZthJG0y0p2PC/s270-rw-e99/thumbnail.png", 
      link: "https://www.beishiryoku.org/p/hydroelectric.html"
    },
    { 
      url: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgbjlmgtOaeyAeTjMdQCoF986UREzTf9C-f6ws6BCl2vhGE8rpK2J2NAjjLtH1FeXjgbv4Ueh6rgDrQSrLTEUR7gBX8g1lTvBG9Z6ecRD1uEnQscFr5Z8pytS2dWpMYLDmz3DWYZpjtQyjXVhfjPAN_EzI1NqYBEiEfgdkJw0Ffp1GXwId0_4poDL4HOjfy/s270-rw-e99/thumbnail.png", 
      link: "https://www.beishiryoku.org/p/ruins.html"
    },
    { 
      url: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgOE6kwz2wY-r7alszoBNOYKgVEl-fPgsg8yvMiwyLPYzLgfUA9WB1O31uA77n5Kw_LDiD-Z-7GhYE2M68h5DpFW77JAOqaZGqtqpQHbsyvYx2mMQGqEsGgxKkkFU_QX05xve12etQ2SLt_6otVi_gsZ5wjiMBAAz3Wa8xA4uX2YzN7rDos-kaqMyA4VVQ2/s270-rw-e99/thumbnail.png", 
      link: "https://www.beishiryoku.org/p/sainokami.html"
    },
    { 
      url: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEifBQhTSl3QQL-x_SZEAD5Vshu0j5IWCsknGBgxrOw6CYSy1YrLP_BOmPCaeqI0sS4Z48Cqu9IhdCuLY0AwtWmK_NexwQMWC1WamDk3P3gXlalr1ICYbLwU5J6cCqdSBV8jPs9LE-wJ1Yzj-pCqS96kpowWLSCWhqldSC9TcpNRpcE4vEYzIyCahnc7Iy9K/s270-e99-rw/thumbnail.png", 
      link: "https://www.beishiryoku.org/p/hayagriva.html"
    },
    { 
      url: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEinGwwvW01HvJBS2YUbO055HP1ChAmVGDRncWmk7RWcjqwYwOexv4rJF99Hs30kMOyE-PUqUjB_7oXLMh0uzUw8oegOxTNvR-Q7viiyrkOWUIgVJByniN9lFpq9uNCngh01hPQE6-oyCdUKhO-g0Nv0lR2NkyXK2zrCNXFyo-JUzAd53072WzMHfdWo/s270-e99-rw/image%20-%202023-05-16T232754.424.webp", 
      link: "https://www.beishiryoku.org/p/hinogunshi.html"
    },
    { 
      url: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiCrYFC64d9txbjOMzNS8dgHl_YMxMySPHmoT68IYxv407qOAYsxZmq-0D1rxB2Ss80cQrch2UloFraMB7SDEcBkCbFnykwY9xJdmHH4zSfMlliEIx4dQ1UevFn8TgeWYd7kWSeIL4dzo4kBcPpIK6FeJMvimFFUnCMlK_McaVAl5pRwG6UcI8yEybM2zc/s270-rw-e99/thumbnail.png", 
      link: "https://www.beishiryoku.org/p/sabou.html"
    },
    { 
      url: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgWBVGkvfPE7kxrF_WGypBj4erSPhhAyZ5kFz5qlIS-jY_5pd0RHtuL4_sCfs7v8F0smafwvVPS4xI9hqk3tb57HRyAzPULLClP1luYfg6dZn5dGWSmMdn5x2yE-pvXOrg5mD2LwzobYLYQ3t8W-n7Dqc0W5rq4fcN-yriWSkJhWlgMvfXAypcPSjh7ijbE/s270-e99-rw/thum.png", 
      link: "https://www.beishiryoku.org/p/blogger.html"
    },
    { 
      url: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh-Ha2zQeMwUG9urZIbtjxbC-J_ArmTjKvkYiHmjTZESff-qj6G_3t0hIhY32E834FfmeUtzfn4qnNryVGsHdDcYCQtN2Ba6R-fmTxFar6aA83ZikuZ-wIodPJ3HNWZ32t_Yz73KKYQl5MM1wibPPhpy9lVgFO0bTverzqTrEGY7ky5wh1IlPBFnNAw4gSD/s270-rw-e99/thumbnail2.png", 
      link: "https://www.beishiryoku.org/p/garage.html"
    },
    { 
      url: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgjUuiiHlVGkMWgRCauD4pNtosKr5hm1tr9yMEqLI1YRqIAx3KicLb0rdHYG0X4EuUHxOPJo5DpPxC6USHyJR6BmXIIxO_V2PDwohb2AdUbWxA0YiQvWf7x9Jg7zh0ZPWbQJ8DplBFxH5jWp0-g_28AQhQtdWopojpA97cajBlqOtEXMAFhQlaU19AQSUgw/s270-e99-rw/title.png", 
      link: "https://www.beishiryoku.org/p/column.html"
    }
  ];

  const item = data[Math.floor(Math.random() * data.length)];

  const container = document.getElementById('mokuji-image');

  const a = document.createElement('a');
  a.href = item.link;

  const img = document.createElement('img');
  img.src = item.url;
  img.alt = "サイドバー画像";

  a.appendChild(img);
  container.appendChild(a);

});