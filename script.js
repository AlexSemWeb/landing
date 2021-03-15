Vue.directive("scroll", {
  inserted: function (el, binding) {
    let f = function (evt) {
      if (binding.value(evt, el)) {
        window.removeEventListener("scroll", f);
      }
    };
    window.addEventListener("scroll", f);
  },
});

let app = new Vue({
  el: "#app",
  data: {
    page: 1,
    age: 0,
    percent: {
      width: "0%",
    },
    audioInterval: {},
    person: {},
  },
  computed: {
    currentDate() {
      return {
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      };
    },
    dayArr() {
      let days = 31;
      let daysArr = [];
      for (let i = 1; i <= days; i++) {
        daysArr.push(i);
      }
      return daysArr;
    },
    yearArr() {
      let currentYear = this.currentDate.year;
      let lowerYear = 1930;
      let years = [];
      for (let i = currentYear; i >= lowerYear; i--) {
        years.push(i);
      }
      return years;
    },
  },
  methods: {
    get_current_age(date) {
      var d = date.split(".");
      if (typeof d[2] !== "undefined") {
        date = d[2] + "." + d[1] + "." + d[0];
        return (
          ((new Date().getTime() - new Date(date)) /
            (24 * 3600 * 365.25 * 1000)) |
          0
        );
      }
      return 0;
    },
    checkSelect() {
      let selectArr = [
        this.$refs.select1,
        this.$refs.select2,
        this.$refs.select3,
      ];
      selectArr.forEach((item) => item.classList.remove("active"));
      let checkIndex = [];
      selectArr.map((item, index) => {
        if (Number(item.value) == 0) {
          checkIndex.push(index);
        }
      });
      if (checkIndex.length > 0) {
        checkIndex.forEach((item) => {
          selectArr[item].classList.add("active");
        });
      } else {
        this.age = this.get_current_age(
          selectArr[0].value +
            "." +
            selectArr[1].value -
            1 +
            "." +
            selectArr[2].value
        );
        this.page += 1;
      }
    },
    audioSelfMade() {
      let vm = this;
      function text() {
        let audio = vm.$refs.audio;
        if (audio) {
          let audioLength = audio.duration;
          let audioPercent =
            (
              (Number(audio.currentTime.toFixed()) / audioLength.toFixed()) *
              100
            ).toFixed() + "%";
          vm.percent.width = audioPercent;
        }
      }
      return text;
    },
    opacity() {
      let mainHelp = document.querySelector(".js-main-help");
      let mainApprove = document.querySelector(".js-main-approve");
      let mainQuestion = document.querySelector(".js-main-question");
      let mainFooter = document.querySelector(".js-main-footer");
      let windowOffset = window.pageYOffset;
      if (mainHelp) {
        if (windowOffset >= mainFooter.offsetTop / 2) {
          mainFooter.classList.add("opacity");
        }
        if (windowOffset >= mainQuestion.offsetTop / 2) {
          mainQuestion.classList.add("opacity");
        }
        if (windowOffset >= mainApprove.offsetTop / 2) {
          mainApprove.classList.add("opacity");
        }
        if (windowOffset >= mainHelp.offsetTop / 2) {
          mainHelp.classList.add("opacity");
        }
      }
    },
    fetchData() {
      fetch("https://swapi.dev/api/people/1/")
        .then((response) => response.json())
        .then((data) => (this.person = data))
        .catch((error) => console.error(errot));
      this.page += 1;
    },
    toMainPage() {
      this.page = 1;
    },
    toNextPage() {
      let vm = this;
      let currentPage = this.page;
      this.page = 0;
      setTimeout(function () {
        vm.page += currentPage + 1;
      }, 2000);
    },
    customSelect() {
      setTimeout(function () {
        let x, i, j, l, ll, selElmnt, a, b, c;
        x = document.querySelectorAll(".custom-select");
        l = x.length;
        for (i = 0; i < l; i++) {
          x[i].classList.add("hide");
          selElmnt = x[i].getElementsByTagName("select")[0];
          ll = selElmnt.length;
          a = document.createElement("DIV");
          a.setAttribute("class", "select-selected");
          a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
          x[i].appendChild(a);
          b = document.createElement("DIV");
          b.setAttribute("class", "select-items select-hide");
          bottom = document.createElement("DIV");
          bottom.setAttribute("class", "select-bottom select-hide");
          for (j = 1; j < ll; j++) {
            c = document.createElement("DIV");
            c.innerHTML = selElmnt.options[j].innerHTML;
            c.addEventListener("click", function (e) {
              var y, i, k, s, h, sl, yl;
              s = this.parentNode.parentNode.getElementsByTagName("select")[0];
              sl = s.length;
              h = this.parentNode.previousSibling;
              for (i = 0; i < sl; i++) {
                if (s.options[i].innerHTML == this.innerHTML) {
                  s.selectedIndex = i;
                  h.innerHTML = this.innerHTML;
                  y = this.parentNode.getElementsByClassName(
                    "same-as-selected"
                  );
                  yl = y.length;
                  for (k = 0; k < yl; k++) {
                    y[k].removeAttribute("class");
                  }
                  this.setAttribute("class", "same-as-selected");
                  break;
                }
              }
              h.click();
            });
            b.appendChild(c);
          }
          x[i].appendChild(b);
          x[i].appendChild(bottom);
          a.addEventListener("click", function (e) {
            e.stopPropagation();
            closeAllSelect(this);
            this.nextSibling.classList.toggle("select-hide");
            this.nextSibling.nextSibling.classList.toggle("select-hide");
            this.parentElement.classList.toggle("select-arrow-active");
          });
        }
      }, 1000);

      function closeAllSelect(elmnt) {
        var x,
          y,
          i,
          xl,
          yl,
          arrNo = [];
        x = document.getElementsByClassName("select-items");
        let z = document.getElementsByClassName("select-bottom");
        y = document.getElementsByClassName("select-selected");
        xl = x.length;
        yl = y.length;
        for (i = 0; i < yl; i++) {
          if (elmnt == y[i]) {
            arrNo.push(i);
          } else {
            y[i].parentElement.classList.remove("select-arrow-active");
          }
        }
        for (i = 0; i < xl; i++) {
          if (arrNo.indexOf(i)) {
            x[i].classList.add("select-hide");
          }
        }
        for (i = 0; i < z.length; i++) {
          if (arrNo.indexOf(i)) {
            z[i].classList.add("select-hide");
          }
        }
      }
      document.addEventListener("click", closeAllSelect);
    },
  },
  mounted: function () {
    if (this.page == 1) {
      this.opacity();
    }
    if (this.page == 3 && document.documentElement.clientWidth > 768) {
      this.customSelect();
    }
    if (this.page == 6) {
      let audioInterval = setInterval(this.audioSelfMade(), 1000);
      if (this.percent.width == "100%") {
        clearInterval(audioInterval);
        return (this.page += 1);
      }
      return this.audioInterval;
    }
  },
  updated() {
    if (this.page == 3 && document.documentElement.clientWidth > 768) {
      this.customSelect();
    }
    if (this.page == 6) {
      let audioInterval = setInterval(this.audioSelfMade(), 1000);
      if (this.percent.width == "100%") {
        clearInterval(audioInterval);
        return (this.page += 1);
      }
      return this.audioInterval;
    }
  },
});
