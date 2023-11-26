function chainListeners() {
  $("#features > g").on("click", (event) => {
    $(event.target.parentNode).css("fill", MAP_SETTINGS.CURR_FILL_COLOR);
  });

  $("#selected-fill-color").on("change", (event) => {
    MAP_SETTINGS.CURR_FILL_COLOR = event.target.value;
    MAP_SETTINGS.USERCOLOR_PALETTE.push(event.target.value);
    $("#selected-fill-color-palette").empty();
    MAP_SETTINGS.USERCOLOR_PALETTE.forEach((color_code) => {
      let object = $.parseHTML(`<div class="color-btn" style="background-color:${color_code}" title=""></div>`);
      $(object).on("click", (event) => {
        //event.preventDefault();
        MAP_SETTINGS.CURR_FILL_COLOR = color_code;
      });
      $("#selected-fill-color-palette").append(object);
    });
  });

  $("#selected-border-color").on("change", (event) => {
    MAP_SETTINGS.SELECTED_BORDER_COLOR = event.target.value;
    let object = $.parseHTML(`<div class="color-btn" style="background-color:${event.target.value}" title=""></div>`);
    $("#selected-border-color-palette").empty().append(object);
  });
  $("#selected-background-color").on("change", (event) => {
    MAP_SETTINGS.SELECTED_BACKGROUND_COLOR = event.target.value;
    let object = $.parseHTML(`<div class="color-btn" style="background-color:${event.target.value}" title=""></div>`);
    $("#selected-background-color-palette").empty().append(object);
  });

  $("#color-palette-container .xcard").on("click", (event) => {
    //if (this !== event.target) return;
    let name = $(event.target).parent().attr("name");
    console.log(event.target, PALETTES, name);
    MAP_SETTINGS.COLOR_PALETTE = [...PALETTES[name]];
    updateSvg();
  });
  $("#input-title").on("input", (event) => {
    MAP_SETTINGS.TITLE = event.target.value;
    myMap.setTitle(event.target.value);
    updateSvg();
  });
  $("#input-footer").on("input", (event) => {
    MAP_SETTINGS.FOOTER = event.target.value;
    myMap.setFooter(event.target.value);
    updateSvg();
  });
  $("#input-footnote").on("input", (event) => {
    MAP_SETTINGS.FOOTNOTE = event.target.value;
    myMap.setFootnote(event.target.value);
    updateSvg();
  });

  $("#border-color").on("change", (event) => {
    MAP_SETTINGS.BORDER_COLOR = event.target.value;
    myMap.setMapBorderColor(MAP_SETTINGS.BORDER_COLOR);
  });
  $("#background-color").on("change", (event) => {
    MAP_SETTINGS.BACKGROUND_COLOR = event.target.value;
    myMap.setMapBackgroundColor(MAP_SETTINGS.BACKGROUND_COLOR);
  });
  $("#map-borders").on("change", (event) => {
    console.log("clicked");
    MAP_SETTINGS.SHOW_MAP_BORDERS = event.target.checked;
    console.log(MAP_SETTINGS.SHOW_MAP_BORDERS);
    if (MAP_SETTINGS.SHOW_MAP_BORDERS) myMap.showMapBorders();
    else myMap.hideMapBorders();
  });
  $("#map-citynames").on("change", (event) => {
    MAP_SETTINGS.SHOW_MAP_CITYNAMES = event.target.checked;
    if (MAP_SETTINGS.SHOW_MAP_CITYNAMES) myMap.showNames();
    else myMap.hideNames();
  });

  const downloadBtn = $("#downloadBtn")[0];
  downloadBtn.addEventListener("click", (event) => {
    console.log("download");
    myMap.downloadSVGAsPNG(event, {});
  });

  /*   const mapBtn = document.querySelector("#map-btn");
  mapBtn.addEventListener("click", () => {
    myMap.mapState();
  }); */

  /*   const pullBtn = document.querySelector("#pull-btn");
  pullBtn.addEventListener("click", () => {
    //do something
  }); */

  $("#data-json").on("change", function () {
    this.files[0]
      .text()
      .then((text) => {
        let obj = JSON.parse(text);
        console.log(obj);
        mySheet.setData(obj);
        console.log(mySheet.getData());
        updateSvg();
      })
      .catch((err) => {
        throw new Error(err);
      });
  });
  $("#strategy").on("change", (event) => {
    console.log(event.target.value);
    MAP_SETTINGS.STRATEGY = event.target.value;
    updateSvg();
  });
  $("#interval").on("input", (event) => {
    $("#interval-value").text(event.target.value);
    MAP_SETTINGS.INTERVAL = parseInt(event.target.value);
    updateSvg();
  });
  /*   document.getElementById("layout1Btn").addEventListener("click", (event) => {
    setLayout1();
  });
  document.getElementById("layout2Btn").addEventListener("click", (event) => {
    setLayout2();
  });
  document.getElementById("layout3Btn").addEventListener("click", (event) => {
    setLayout3();
  }); */

  document.querySelectorAll(".ninesides-item").forEach((elem) => {
    elem.addEventListener("click", (event) => {
      let data_num = event.target.getAttribute("data-num");
      let data_for = event.target.parentNode.getAttribute("data-for");
      //log.textContent = `data_num: ${data_num}, data_for: ${data_for}`;
      let sideArr = ["top-left", "top-center", "top-right", "left-center", "center", "right-center", "left-bottom", "bottom-center", "bottom-right"];
      if (data_for === "title") myMap.updateState({ title: { placement: sideArr[parseInt(data_num) - 1] } });
      else if (data_for === "footer") myMap.updateState({ footer: { placement: sideArr[parseInt(data_num) - 1] } });
      else if (data_for === "footnote") myMap.updateState({ footnote: { placement: sideArr[parseInt(data_num) - 1] } });
      else if (data_for === "legend") myMap.updateState({ legend: { placement: sideArr[parseInt(data_num) - 1] } });
      else {
        console.log("wrong placement data_for", `${data_for}`);
      }
    });
  });
  document.getElementById("input-title-show").addEventListener("change", (event) => {
    if (event.target.checked == true) myMap.updateState({ title: { visibility: "visible" } });
    else myMap.updateState({ title: { visibility: "hidden" } });
  });
  document.getElementById("input-footer-show").addEventListener("change", (event) => {
    if (event.target.checked == true) myMap.updateState({ footer: { visibility: "visible" } });
    else myMap.updateState({ footer: { visibility: "hidden" } });
  });
  document.getElementById("input-footnote-show").addEventListener("change", (event) => {
    if (event.target.checked == true) myMap.updateState({ footnote: { visibility: "visible" } });
    else myMap.updateState({ footnote: { visibility: "hidden" } });
  });
  document.getElementById("input-show-names").addEventListener("change", (event) => {
    if (event.target.checked === true) myMap.setFeaturesLabelVisibility(true);
    else if (event.target.checked === false) myMap.setFeaturesLabelVisibility(false);
    else {
      console.log("3rd state");
    }
  });
  document.getElementById("input-show-data").addEventListener("change", (event) => {
    if (event.target.checked === true) myMap.setFeaturesDataVisibility(true);
    else if (event.target.checked === false) myMap.setFeaturesDataVisibility(false);
    else {
      console.log("3rd state");
    }
  });
}
/* END END END END END END END END END END END END END END END END END*/
