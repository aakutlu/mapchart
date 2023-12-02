class Svg {
  #DEFAULT_STATE = {
    background_color: "radial-gradient(at left top, #FFFFFF, #C7C7C4)",
    border_color: "black",
    feature_color: "gray",
    border_color: "red",
    show_borders: true,
    show_feature_labels: true,
    show_feature_data: true,
    title: {
      text: "Map Title Goes Here lower-UPPER",
      visibility: "visible",
      placement: "top-center",
      font: "sans-serif",
      color: "black",
      font_size: "2rem",
      font_weight: "700",
    },
    footer: {
      text: "@lowercase UPPERCASE",
      visibility: "visible",
      placement: "bottom-right",
      font: "Poppins",
      color: "black",
      font_size: "1rem",
      font_weight: "300",
    },
    footnote: {
      text: "*this map created by @ko all rights reserved. any usage from one to other exchance criminal lorem ipsum :)",
      visibility: "visible",
      placement: "bottom-center",
      font: "monospace",
      color: "gray",
      font_size: ".5rem",
      font_weight: "300",
    },
    legend: {
      type: "choropleth", //choropleth || rect || rectReversed || circle
      text: "Legend Text",
      visibility: "visible",
      placement: "bottom-left",
      font: "Poppins",
      color: "black",
      font_size: "1rem",
      font_weight: "500",
      labels: [
        /* { text: "galatasaray", color: "red" } */
      ],
    },
    features: {
      /* ankara: { label: "ankara", data: "9999999", color: "black", opacity: "1", showLabel: true, showData: true } */
    },
  };

  constructor(sourceSvg, container, state) {
    //merge state
    this.state = { ...this.#DEFAULT_STATE, ...state };
    this.state.title = { ...this.#DEFAULT_STATE.title, ...state.title };
    this.state.footer = { ...this.#DEFAULT_STATE.footer, ...state.footer };
    this.state.footnote = { ...this.#DEFAULT_STATE.footnote, ...state.footnote };
    this.state.legend = { ...this.#DEFAULT_STATE.legend, ...state.legend };

    this.sourceSvg = sourceSvg; //svg itself (text format)
    this.container = container; //container node which svg sits inside
  }

  /*   static getSvgSourceFile = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      const message = `An Error has occured: ${response.status}`;
      throw new Error(message);
    }
    const svg = response.text();
    return svg;
  }; */
  refresh = () => {
    $(this.container).empty();
    this.initialize()
  }

  initialize = () => {
    $(this.container).empty();
    this.container.insertAdjacentHTML("beforeend", this.sourceSvg);
    this.paintBackground(null)
    this.paintFeaturesAll();
    this.injectFeatureLabels();
    this.injectFeatureData();
    this.injectTitle(this.state.title.placement);
    this.injectFooter(this.state.footer.placement);
    this.injectFootnote(this.state.footnote.placement);
    if(this.state.legend.type === "rect")
      this.injectColorLegendRectangle(this.state.legend.placement)
    else if(this.state.legend.type === "rectReversed")
      this.injectColorLegendRectangleReversed(this.state.legend.placement)
    else if(this.state.legend.type === "circle")
      this.injectColorLegendCircle(this.state.legend.placement)
    else if(this.state.legend.type === "choropleth")
      this.injectChoroplethLegend(this.state.legend.placement)
    else {
      console.log('wrong legend placement', this.state.legend.placement)
      this.injectColorLegendCircle(this.state.legend.placement)
    }





    //this.injectColorLegendCircle('bottom-left');
    //this.injectColorLegendRectangle("bottom-left");
    //this.injectColorLegendRectangleReversed("bottom-right")
    //this.injectChoroplethLegend('bottom-center');
  };

  updateState = (state) => {
    let cloneState = structuredClone(this.state)
    this.state = { ...this.state, ...state };
    this.state.title = { ...cloneState.title, ...state.title };
    this.state.footer = { ...cloneState.footer, ...state.footer };
    this.state.footnote = { ...cloneState.footnote, ...state.footnote };
    this.state.legend = { ...cloneState.legend, ...state.legend };
      /* Object.keys(this.state.features).forEach(key => {
        console.log(state?.features?.key)
        if(!state.features?.key){
          this.state.features[key] = {...cloneState.features[key], ...state?.features?.key}
        }
      }) */
    

    console.log('this.state', this.state.features)
    this.refresh()
  }
  setTitle = (title) => {
    this.state.title.text = title;
  }
  setFooter = (footer) => {
    this.state.footer.text = footer;
  }
  setFootnote = (footnote) => {
    this.state.footnote.text = footnote;
  }

// SETTER-GETTERS SETTER-GETTERS SETTER-GETTERS SETTER-GETTERS SETTER-GETTERS SETTER-GETTERS
setFeature = (id, label, data, color, opacity, showLabel, showData) => {
  if(!this.state.features[id]){
    this.state.features[id] = {};
  }
  this.state.features[id].label ??= label;
  this.state.features[id].data ??= data;
  this.state.features[id].color ??= color;
  this.state.features[id].opacity ??= opacity;
  this.state.features[id].showLabel ??= showLabel;
  this.state.features[id].showData ??= showData;
}
setFeaturesLabelVisibility = (bool) => {
  console.log(bool)
  Object.keys(this.state.features).forEach(id => {
    this.state.features[id].showLabel = bool;
  })
  this.refresh();
}
setFeaturesDataVisibility = (bool) => {
  Object.keys(this.state.features).forEach(id => {
    this.state.features[id].showData = bool;
  })
  this.refresh();
}


  /* MARK, UNMARK, CLEARMARKS */
  mark = (features) => {
    let root = document.querySelector(':root');
    var rootStyle = getComputedStyle(root);
    //rootStyle.getPropertyValue('--color1')
    //root.style.setProperty('--color1', 'lightblue');
    features.forEach((id) => {
      //$(this.container).find(`g#features #${id}`).css("fill", "url(#checked)");
      //$(this.container).find(`g#features #${id}`).css("fill-opacity", "1");
      let color = $(this.container).find(`g#features #${id}`).css("fill");
      root.style.setProperty('--color1', color);
      console.log(rootStyle.getPropertyValue('--color1'));
      $(this.container).find(`g#features #${id}`).css("fill", "url(#striped-thin)");
    });
  };
  unmark = (features) => {
    features.forEach((id) => {
      $(this.container).find(`g#features #${id}`).css("fill", "");
    });
  };
  clearMarks = () => {
    $(this.container).find("g#features g").css("fill", "");
    //this.mapState();
  };

  /* PAINT */
  paintFeature = (id, color) => {
    this.state.features[id].color = color;
    $(this.container).find(`g#features #${id}`).css("fill", color);
  };
  paintFeatures = (arr, color) => {
    arr.forEach((id) => this.paintFeature(id, color));
  };
  paintFeaturesAll = () => {
    Object.keys(this.state.features).forEach((id) => {
      this.paintFeature(id, this.state.features[id].color);
    });
  };
  paintOpacity = (id, opacity) => {
    this.state.features[id].opacity = opacity;
    $(this.container).find(`g#features #${id}`).css("opacity", opacity);
  };
  paintBackground = (background) => {
    this.state.background_color ??= background;
    $(this.container).find('svg').css('background', this.state.background_color) 
  }

/*   _resetFillColorAll = (array) => {
    array.forEach((elemId) => {
      $(this.container).find(`g#${elemId}`).css("fill", "");
    });
  }; */

  injectFeatureLabels = () => {
    Object.keys(this.state.features).forEach((key) => {
      let feature = this.state.features[key];
      let gElem = $(this.container).find(`g#features #${key}`)[0];
      console.log(gElem)
      if(gElem){
        let svgRect = gElem.getBBox();
        let target = $("g#data-section")[0];
        target.insertAdjacentHTML(
          "beforeend",
          `<text class="feature-label" x="${svgRect.x + svgRect.width / 2}" y="${svgRect.y + svgRect.height / 2}" style="visibility:${feature.showLabel ? 'visible' : 'hidden'}">${feature.label}</text>`
        );
      }

    });
  };
  injectFeatureData = () => {
    Object.keys(this.state.features).forEach((key) => {
      let feature = this.state.features[key];
      let gElem = $(this.container).find(`g#features #${key}`)[0];
      if(gElem){
        let svgRect = gElem.getBBox();
        let target = $("g#data-section")[0];
        target.insertAdjacentHTML(
          "beforeend",
          `<text class="feature-data" x="${svgRect.x + svgRect.width / 2}" y="${svgRect.y + svgRect.height / 2}" style="visibility:${feature.showData ? 'visible' : 'hidden'}">${feature.data}</text>`
        );
      }
    });
  };
  injectTitle = (position) => {
    let titleContainer = $(this.container).find("g#title")[0];
    let x = 0;
    let y = 0;
    titleContainer.insertAdjacentHTML("beforeend", `<text class="title" x="${x}" y="${y}" visibility="hidden">${this.state.title.text}</text>`);
    let coor = calcPosition($(this.container).find("svg").attr("viewBox"), position, titleContainer.getBBox());
    $(titleContainer).attr("transform", `translate(${coor.posX},${coor.posY})`)[0];
    let titleText = $(titleContainer).find('text')[0]
    $(titleText).text(this.state.title.text)
    $(titleText).css('visibility', this.state.title.visibility)
    //$(titleText).css('font-size',this.state.title.font_size)
    //$(titleText).css('fill',this.state.title.color)
    //$(titleText).css('font-family',this.state.title.font)
    //$(titleText).css('font-weight',this.state.title.font_weight)
  };
/*   updateTitle = () => {
    let titleContainer = $(this.container).find("g#title")[0]
    let titleText = $(titleContainer).find('text')[0]
    $(titleText).text(this.state.title.text)
    $(titleText).attr('visibility',this.state.title.visibility)
    $(titleText).attr('font-size',this.state.title.font_size)
    $(titleText).attr('fill',this.state.title.color)
    $(titleText).attr('font-family',this.state.title.font)
    $(titleText).attr('font-weight',this.state.title.font_weight)
    let coor = calcPosition($(this.container).find("svg").attr("viewBox"), position, titleContainer.getBBox());
    $(titleContainer).attr("transform", `translate(${coor.posX},${coor.posY})`)[0];
  } */

  injectFooter = (position) => {
    let footerContainer = $(this.container).find("g#footer")[0];
    let x = 0;
    let y = 0;
    footerContainer.insertAdjacentHTML("beforeend", `<text class="footer" x="${x}" y="${y}">${this.state.footer.text}</text>`);
    let coor = calcPosition($(this.container).find("svg").attr("viewBox"), position, footerContainer.getBBox());
    $(footerContainer).attr("transform", `translate(${coor.posX},${coor.posY})`)[0];
    $(footerContainer).find('text').css('visibility', this.state.footer.visibility)
  };
  injectFootnote = (position) => {
    let footnoteContainer = $(this.container).find("g#footnote")[0];
    let x = 0;
    let y = 0;
    footnoteContainer.insertAdjacentHTML("beforeend", `<text class="footnote" x="${x}" y="${y}">${this.state.footnote.text}</text>`);
    let coor = calcPosition($(this.container).find("svg").attr("viewBox"), position, footnoteContainer.getBBox());
    $(footnoteContainer).attr("transform", `translate(${coor.posX},${coor.posY})`)[0];
    $(footnoteContainer).find('text').css('visibility', this.state.footnote.visibility)
  };
  injectColorLegendRectangle = (position) => {
    let legendContainer = $("g#legend")[0];
    let x = 0;
    let y = 0;
    legendContainer.insertAdjacentHTML("beforeend", `<text class="" x="${x}" y="${y}">${this.state.legend.text}</text>`);
    this.state.legend.labels.forEach((elem) => {
      y += 20;
      legendContainer.insertAdjacentHTML("beforeend",`<rect class="" x="${x}"  y="${y}" width="30" height="20" rx="2" fill="${elem.color}"></rect>`);
      legendContainer.insertAdjacentHTML("beforeend", `<text class="" x="${x + 34}" y="${y + 10}">${elem.text}</text>`);
    });
    let coor = calcPosition($(this.container).find("svg").attr("viewBox"), position, legendContainer.getBBox());
    $(legendContainer).attr("transform", `translate(${coor.posX},${coor.posY})`)[0];
  };

  injectColorLegendRectangleReversed = (position) => {
    let legendContainer = $(this.container).find("g#legend")[0];
    let x = 0;
    let y = 0;
    legendContainer.insertAdjacentHTML("beforeend",`<text class="" x="${x}" y="${y}" style="text-anchor: middle;">${this.state.legend.text}</text>`);
    this.state.legend.labels.forEach((elem) => {
      y += 20;
      legendContainer.insertAdjacentHTML("beforeend",`<rect class=" box" x="${x}"  y="${y}" width="30" height="20" rx="2" fill="${elem.color}"></rect>`);
      legendContainer.insertAdjacentHTML("beforeend",`<text class="" x="${x - 4}" y="${y + 10}" style="text-anchor: end;">${elem.text}</text>`);
    });
    let coor = calcPosition($(this.container).find("svg").attr("viewBox"), position, legendContainer.getBBox());
    $(legendContainer).attr("transform", `translate(${coor.posX},${coor.posY})`)[0];
  };
  injectColorLegendCircle = (position) => {
    let legendContainer = $(this.container).find("g#legend")[0];
    let x = 0;
    let y = 0;
    legendContainer.insertAdjacentHTML("beforeend", `<text class="" x="${x}" y="${y}">${this.state.legend.text}</text>`);
    this.state.legend.labels.forEach((elem) => {
      y += 24;
      legendContainer.insertAdjacentHTML("beforeend", `<circle cx="${x}" cy="${y}" r="10" stroke="black" stroke-width="1" fill="${elem.color}" />`);
      legendContainer.insertAdjacentHTML("beforeend", `<text class="" x="${x + 14}" y="${y}">${elem.text}</text>`);
    });
    let coor = calcPosition($(this.container).find("svg").attr("viewBox"), position, legendContainer.getBBox());
    $(legendContainer).attr("transform", `translate(${coor.posX},${coor.posY})`)[0];
  };
  injectChoroplethLegend = (position) => {
    let legendContainer = $(this.container).find("g#legend")[0];
    let x = 0;
    let y = 0;
    let width = 80;
    let counter = 0;
    this.state.legend.labels.forEach((label) => {
      counter += width;
      legendContainer.insertAdjacentHTML("beforeend",`<rect class="" x="${x + counter}"  y="${y}" width="${width}" height="20" rx="0" fill="${label.color}"></rect>`);
    });
    counter = 0;
    this.state.legend.labels.forEach((label) => {
      counter += width;
      legendContainer.insertAdjacentHTML("beforeend", `<text class="" x="${x + counter + width / 2}" y="${y - 10}">${label.text}</text>`);
    });

      //PLOT GRAPHS
    let features = this.state.features
    let plotArr = []
    Object.entries(features).forEach(arr => {
      let [key,obj] = arr;
      let num = parseInt(obj.data)
      if(plotArr[num] == undefined)
        plotArr[num] = 1;
      else if(plotArr[num] >= 0)
        plotArr[num]++;
      else{
        //do nothing
      }
    })
    for (let i = 0; i < plotArr.length; i++) {
      plotArr[i] ??= 0; 
    }
    console.log(plotArr)
    let interval = this.state.legend.labels.length;
    console.log({interval})
    plotArr.forEach((elem,i,arr) => {
      let px = parseInt((x + width + i/(arr.length-1)*interval*width))
      console.log({px,width, i,arr, interval, width})
      if(elem){
        legendContainer.insertAdjacentHTML("beforeend", `<path d="M ${px} ${y+20} L ${px} ${20+elem*6}" stroke="red" stroke-width="6"/>`);
      }
    })


    let coor = calcPosition($(this.container).find("svg").attr("viewBox"), position, legendContainer.getBBox(), 100);
    $(legendContainer).attr("transform", `translate(${coor.posX},${coor.posY})`)[0];
    $(legendContainer).addClass('choropleth')
  };


/*   showDatas = () => {
    $("g#data-section .data").css("visibility", "visible");
  };
  hideDatas = () => {
    $("g#data-section .data").css("visibility", "hidden");
  };
  showNames = () => {
    $("g#data-section .name").css("visibility", "visible");
  };
  hideNames = () => {
    $("g#data-section .name").css("visibility", "hidden");
  }; */

  downloadSVGAsPNG = (e, dimensions) => {
    dimensions = undefined;
    const canvas = document.createElement("canvas");
    //const svg = document.querySelector("svg");
    const svg = $(this.container).find("svg")[0];
    const base64doc = btoa(unescape(encodeURIComponent(svg.outerHTML)));
    const viewBoxArr = svg
      .getAttribute("viewBox")
      .split(" ")
      .map((num) => parseInt(num));
    let w = dimensions?.width || viewBoxArr[2] || 1920;
    let h = dimensions?.height || viewBoxArr[3] || 1080;
    w*=2
    h*=2
    const img_to_download = document.createElement("img");
    img_to_download.src = "data:image/svg+xml;base64," + base64doc;
    console.log(w, h);
    img_to_download.onload = function () {
      console.log("img loaded");
      canvas.setAttribute("width", w);
      canvas.setAttribute("height", h);
      const context = canvas.getContext("2d");
      //context.clearRect(0, 0, w, h);
      context.drawImage(img_to_download, 0, 0, w, h);
      const dataURL = canvas.toDataURL("image/png");
      if (window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(canvas.msToBlob(), "download.png");
        //e.preventDefault();
      } else {
        const a = document.createElement("a");
        const my_evt = new MouseEvent("click");
        a.download = "download.png";
        a.href = dataURL;
        a.dispatchEvent(my_evt);
      }
      //canvas.parentNode.removeChild(canvas);
    };
  };

}


function calcPosition(viewPort, positionString, bbox, margin) {
  margin ??= 20;
  let viewPortArr = viewPort.trim().split(/\s{1,}/);
  viewPortArr = viewPortArr.map((str) => parseInt(str));
  let vp = { x: viewPortArr[0], y: viewPortArr[1], width: viewPortArr[2], height: viewPortArr[3] };
  if (positionString === "top-left" || positionString === "left-top") 
    return { posX: vp.x - bbox.x + margin, posY: vp.y - bbox.y + margin };
  else if (positionString === "top-center" || positionString === "center-top")
    return { posX: vp.x + vp.width / 2 - bbox.x - bbox.width / 2, posY: vp.y - bbox.y + margin };
  else if (positionString === "top-right" || positionString === "right-top") 
    return { posX: vp.x + vp.width - bbox.x - bbox.width - margin, posY: vp.y - bbox.y + margin};

  else if (positionString === "bottom-left" || positionString === "left-bottom")
    return { posX: vp.x - bbox.x + margin, posY: vp.y + vp.height - bbox.y - bbox.height - margin};
  else if (positionString === "bottom-center" || positionString === "center-bottom") 
    return { posX: vp.x + vp.width / 2 - bbox.x - bbox.width / 2, posY: vp.y + vp.height - bbox.y - bbox.height - margin };
  else if (positionString === "bottom-right" || positionString === "right-bottom") 
    return { posX: vp.x + vp.width - bbox.x - bbox.width - margin, posY: vp.y + vp.height - bbox.y - bbox.height - margin};


  else if (positionString === "left-center" || positionString === "center-left") 
    return { posX: vp.x - bbox.x + margin, posY: vp.y + vp.height / 2 - bbox.y - bbox.height / 2 };
  else if (positionString === "right-center" || positionString === "center-right") 
    return { posX: vp.x + vp.width - bbox.x - bbox.width - margin, posY: vp.y + vp.height / 2 - bbox.y - bbox.height / 2};
  else {
    console.log(`Wrong position String: ${positionString} returning center by default`);
    return { posX: vp.x + vp.width / 2, posY: vp.y + vp.height / 2};
  }
}
