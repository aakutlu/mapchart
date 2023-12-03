class Feature {
  #SETTINGS = {
    autoUpdate: true,
  };
  constructor(id, name, data, color = "gray", domElement, settings) {
    this.id = id;
    this.name = name;
    this.data = data;
    this.color = color;
    this.domElement = domElement;
    $(this.domElement).attr("fill", color);
  }
  setName = (name) => {
    this.name = name;
  };
  getName = () => {
    return this.name;
  };
  setData = (data) => {
    this.data = data;
  };
  getData = () => {
    return this.data;
  };
  setColor = (color) => {
    this.color = color;
    $(this.domElement).attr("fill", color);
  };
  getColor = () => {
    return this.color;
  };
  mark = () => {
    $(this.domElement).attr("stroke", "black");
  };
}
class SvgMap {
  #DEFAULT_STATE = {
    background_color: "radial-gradient(at left top, #FFFFFF, #C7C7C4)",
    border_color: "black", //stroke color
    feature_color: "gray", //fill color
    show_feature_names: true,
    show_feature_data: true,
  };

  constructor(svgurl, container, state) {
    this.svgUrl = svgurl;
    this.container = container;
    this.state = { ...this.#DEFAULT_STATE, ...state };
    this.svgText = undefined;
    this.features = []; // {}
  }
  init = async () => {
    this.svgText = await this.fetchSvg(this.svgUrl);
    $(this.container).empty();
    $(this.container).append(this.svgText);
    this.initFeatures();
  };

  initFeatures = () => {
    const FEATURES = this.features;
    $(this.container)
      .find("#features > g")
      .each(function (index) {
        const id = $(this).attr("id");
        const title = $(this).attr("title");
        FEATURES.push(new Feature(id, title, undefined, undefined, this, undefined));
      });
  };

  setFeatureColor = (ids, color) => {
    ids = ids instanceof Array ? ids : [ids];
    ids.forEach((id) => {
      this.getFeature(id)?.setColor(color);
    });
  };
  getFeature = (id) => {
    return this.features.find((elem) => {
      return elem.id == id;
    });
  };

  fetchSvg = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      const message = `An Error has occured: ${response.status}`;
      throw new Error(message);
    }
    const svg = response.text();
    return svg;
  };

  refresh = () => {
    if (this.svgText) {
      $(this.container).empty();
      $(this.container).append(this.svgText);
    }
  };

  /* MARK, UNMARK, CLEARMARKS */
  mark = (features) => {
    let root = document.querySelector(":root");
    var rootStyle = getComputedStyle(root);
    //rootStyle.getPropertyValue('--color1')
    //root.style.setProperty('--color1', 'lightblue');
    features.forEach((id) => {
      //$(this.container).find(`g#features #${id}`).css("fill", "url(#checked)");
      //$(this.container).find(`g#features #${id}`).css("fill-opacity", "1");
      let color = $(this.container).find(`g#features #${id}`).css("fill");
      root.style.setProperty("--color1", color);
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
    $(this.container).find("svg").css("background", this.state.background_color);
  };

  /*   _resetFillColorAll = (array) => {
    array.forEach((elemId) => {
      $(this.container).find(`g#${elemId}`).css("fill", "");
    });
  }; */

  injectFeatureLabels = () => {
    Object.keys(this.state.features).forEach((key) => {
      let feature = this.state.features[key];
      let gElem = $(this.container).find(`g#features #${key}`)[0];
      //console.log(gElem)
      if (gElem) {
        let svgRect = gElem.getBBox();
        let target = $("g#data-section")[0];
        target.insertAdjacentHTML(
          "beforeend",
          `<text class="feature-label" x="${svgRect.x + svgRect.width / 2}" y="${svgRect.y + svgRect.height / 2}" style="visibility:${
            feature.showLabel ? "visible" : "hidden"
          }">${feature.label}</text>`
        );
      }
    });
  };
  injectFeatureData = () => {
    Object.keys(this.state.features).forEach((key) => {
      let feature = this.state.features[key];
      let gElem = $(this.container).find(`g#features #${key}`)[0];
      if (gElem) {
        let svgRect = gElem.getBBox();
        let target = $("g#data-section")[0];
        target.insertAdjacentHTML(
          "beforeend",
          `<text class="feature-data" x="${svgRect.x + svgRect.width / 2}" y="${svgRect.y + svgRect.height / 2}" style="visibility:${
            feature.showData ? "visible" : "hidden"
          }">${feature.data}</text>`
        );
      }
    });
  };

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
    w *= 2;
    h *= 2;
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
