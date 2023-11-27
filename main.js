let SAMPLE_BACKGROUNDS = [
  "radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)",
  "radial-gradient(circle, rgba(174,238,233,1) 0%, rgba(148,187,233,1) 100%)",
  "linear-gradient(147deg, rgba(180,154,58,1) 0%, rgba(255,255,255,1) 11%, rgba(255,222,175,1) 100%)",
  "linear-gradient(147deg, rgba(153,43,6,0.8295693277310925) 0%, rgba(1,77,78,1) 100%)",
  "radial-gradient(circle, #cedaec, #bad2db, #b0c8c6, #adbcb2, #acafa3)",
  "radial-gradient(circle, #f0f3f8, #ebf3f6, #e8f2f1, #e9f0eb, #eceee6)",
  "radial-gradient(at left top, #5DA8CF, #09422B)",
  "radial-gradient(at center, #a19eae, #c3d77f)",
  "radial-gradient(at left top, #FFFFFF, #C7C7C4)",
];

let PALETTES = {
  RED: ["#eaa8a8", "#e28080", "#e56b6b", "#e95555", "#ec4040", "#ef2b2b", "#de1616", "#cd0000", "#bb0000", "#aa0000"],
  GREEN: ["#b7efc5", "#92e6a7", "#6ede8a", "#4ad66d", "#2dc653", "#25a244", "#208b3a", "#1a7431", "#155d27", "#10451d"],
  BLUE: ["#caf0f8", "#ade8f4", "#90e0ef", "#48cae4", "#00b4d8", "#0096c7", "#0077b6", "#023e8a", "#303397", "#03045e"],
  YELLOW: ["#ffea00", "#ffdd00", "#ffd000", "#ffc300", "#ffb700", "#ffaa00", "#ffa200", "#ff9500", "#ff8800", "#ff7b00"],
  VIOLET: ["#ffceff", "#ffc9ff", "#ffc4ff", "#ffb7ff", "#f2a8ff", "#e498ff", "#d689ff", "#c879ff", "#b66ee8", "#a564d3"],
  GRAY: ["#f5efe8", "#dfd9d3", "#cbc5c0", "#b9b3af", "#a8a39f", "#999491", "#8b8784", "#7e7b78", "#73706d", "#696663"],
  ORANGE: ["#ffb600", "#ffaa00", "#ff9e00", "#ff9100", "#ff8500", "#ff7900", "#ff6d00", "#ff6000", "#ff5400", "#ff4800"],
  BRAWN: ["#e5d4c3", "#e5c9ae", "#debea2", "#d6ab7d", "#b3895d", "#9b744a", "#81583a", "#734f38", "#553725", "#482919"],
  YELLOW_TO_RED: ["#ffba08", "#faa307", "#f48c06", "#e85d04", "#dc2f02", "#d00000", "#9d0208", "#6a040f", "#370617", "#03071e"],
  YELLOW_TO_GREEN: ["#ffff3f", "#eeef20", "#dddf00", "#d4d700", "#bfd200", "#aacc00", "#80b918", "#55a630", "#2b9348", "#007f5f"],
  RAINBOW: ["#ff0000", "#ff8700", "#ffd300", "#deff0a", "#a1ff0a", "#0aff99", "#0aefff", "#147df5", "#580aff", "#be0aff"],
  PALETTE1: ["#ff8700", "#0096c7", "#ff0000", "#6a040f", "#a1ff0a", "#10451d", "#0aefff", "#147df5", "#580aff", "#be0aff"],
  PALETTE2: ["#e95555", "#4ad66d", "#00b4d8", "#ffb700", "#f2a8ff", "#a8a39f", "#ff8500", "#147df5", "#580aff", "#be0aff"],

  /*   STD_DEV_8: ["#ffee9d", "#ffe14e", "#ffd300", "#ff7900", "#ff4800", "#e5383b", "#ba181b", "#660708"],
  HOT_COLORS: ["#d7263d", "#f46036", "#2e294e", "#1b998b", "#c5d86d", "#CDB7B7", "#4ba3c3", "#fbba72", "#ef798a", "#7d82b8"],
  FAVORITE: ["#CDB7B7"], */
};

/* let USER_SETTINGS = {
  USER_COLORS: ["red", "green", "blue"],
}; */
let MAP_SETTINGS = {
  STRATEGY: "choropleth_percentage",
  INTERVAL: undefined,
  COLOR_PALETTE: [...PALETTES.GRAY],
  USERCOLOR_PALETTE: [],
  //BORDER_COLOR: "white",
  //BACKGROUND_COLOR: "#FCF8F8",
  //SHOW_MAP_BORDERS: true,
  //SHOW_MAP_CITYNAMES: true,
  HEADER: "***",
  FOOTER: "***",
  FOOTNOTE: "***",
  TITLE: "***",
};
let mySheet, mySvg;

async function load() {
  mySheet = new Sheet("data/armenia.json", document.querySelector("#spreadsheet"), null, null, null);
  await mySheet.initialize();

  const response = await fetch("maps/_armenia.svg");
  if (!response.ok) {
    const message = `An Error has occured: ${response.status}`;
    throw new Error(message);
  }
  const svg = await response.text();

  //convert BAD INPUT to number
  let data = mySheet.getData();
  data = data.map((arr) =>
    arr.map((elem, i, arr) => {
      if (i == 0) return elem;
      return parseFloat(elem) || 0;
    })
  );
  let state = calcMapState(data);
  myMap = new Svg(svg, $("#map-section")[0], state);
  myMap.initialize();

  chainListeners();
}

function updateSvg() {
  //convert BAD INPUT to number
  let data = mySheet.getData();
  data = data.map((arr) =>
    arr.map((elem, i, arr) => {
      if (i == 0) return elem;
      return parseFloat(elem) || 0;
    })
  );
  console.log(data);
  let state = calcMapState(data);
  myMap.updateState(state);
  myMap.refresh();
}

function calcMapState(data) {
  console.log(MAP_SETTINGS.STRATEGY);
  if (MAP_SETTINGS.STRATEGY === "findmax") {
    let state = calcMapStateFindMax(data);
    state.legend.type = "rect";
    state.legend.placement = "bottom-left";
    return state;
  } else if (MAP_SETTINGS.STRATEGY === "choropleth_percentage") {
    let state = calcMapStateChoroplethPercentage(data); //do not divide dataset to subsets assume data is all pecentages
    state.legend.type = "choropleth";
    state.legend.placement = "bottom-center";
    return state;
  } else if (MAP_SETTINGS.STRATEGY === "choropleth_equal_interval") {
    let state = calcMapStateChoroplethEqualInterval(data, MAP_SETTINGS.INTERVAL); //divide data to equal intervals
    state.legend.type = "choropleth"; //"rectReversed";
    state.legend.placement = "bottom-center"; //"bottom-right";
    return state;
  } else if (MAP_SETTINGS.STRATEGY === "choropleth_standard_dev") {
    let state = calcMapStateChoroplethStandardDeviation(data); // divide data to 1 stdev from the mean
    state.legend.type = "choropleth";
    state.legend.placement = "bottom-center";
    return state;
  } else if (MAP_SETTINGS.STRATEGY === "choropleth_pretty_breaks") {
    let state = calcMapStateChoroplethPrettyBreaks(data, MAP_SETTINGS.INTERVAL); // divide data when a significant break cut the data continuity
    state.legend.type = "circle";
    state.legend.placement = "top-right";
    return state;
  } else {
    console.log("unknown strategy", MAP_SETTINGS.STRATEGY);
    let state = calcMapStateChoroplethEqualInterval(data); //divide data to equal intervals
    state.legend.type = "rect";
    state.legend.placement = "top-left";
    return state;
  }
}

calcMapStateFindMax = (sheetData) => {
  let resultState = {};
  resultState.legend = { labels: [] };
  resultState.features = {};
  console.log(sheetData);
  console.log({ sheetData });
  // set feature data
  sheetData.forEach((arr) => {
    let key = arr[0];
    let value = getMaxIndexAndValue(arr.slice(1)).value;
    resultState.features[key] = {
      label: key,
      data: bigNumberFormatter(value.toString()), //value,
      color: MAP_SETTINGS.COLOR_PALETTE[getMaxIndexAndValue(arr.slice(1)).index],
      opacity: 1,
    };
  });
  //find how many meaningfull data colums exist
  let dataColumnCount = 0;
  sheetData.forEach((arr) => {
    arr.forEach((elem, i) => {
      if (elem > 0 && i > dataColumnCount) dataColumnCount = i;
    });
    /* if (arr.length - 1 > dataColumnCount) dataColumnCount = arr.length - 1; */
  });
  // set legend labels
  for (let index = 0; index < dataColumnCount; index++) {
    resultState.legend.labels.push({ text: `Label-${index + 1}`, color: MAP_SETTINGS.COLOR_PALETTE[index] });
  }

  //get user specified Legend labels
  //myMap.updateState({ legend: { labels: [{ text: "qqq", color: "red" }] } });

  return resultState;
};

calcMapStateChoroplethPercentage = (sheetData, TOTAL_INTERVAL = 10) => {
  let resultState = {};
  resultState.legend = { labels: [] };
  resultState.features = {};

  // set feature data
  sheetData.forEach((arr) => {
    let key = arr[0];
    let value = arr[1]; //bigNumberFormatter(arr[1].toString());
    resultState.features[key] = {
      label: key,
      data: bigNumberFormatter(value.toString()), //value,
      color: MAP_SETTINGS.COLOR_PALETTE[colorIndex(value)],
      opacity: (value / 100) % 1,
    };
  });
  // set legend labels
  resultState.legend.labels = [
    { text: "< 10%", color: MAP_SETTINGS.COLOR_PALETTE[0] },
    { text: "< 20%", color: MAP_SETTINGS.COLOR_PALETTE[1] },
    { text: "< 30%", color: MAP_SETTINGS.COLOR_PALETTE[2] },
    { text: "< 40%", color: MAP_SETTINGS.COLOR_PALETTE[3] },
    { text: "< 50%", color: MAP_SETTINGS.COLOR_PALETTE[4] },
    { text: "< 60%", color: MAP_SETTINGS.COLOR_PALETTE[5] },
    { text: "< 70%", color: MAP_SETTINGS.COLOR_PALETTE[6] },
    { text: "< 80%", color: MAP_SETTINGS.COLOR_PALETTE[7] },
    { text: "< 90%", color: MAP_SETTINGS.COLOR_PALETTE[8] },
    { text: "< 100%", color: MAP_SETTINGS.COLOR_PALETTE[9] },
  ];
  return resultState;
};

calcMapStateChoroplethEqualInterval = (sheetData, TOTAL_INTERVAL = 10) => {
  let min = Math.min(...sheetData.map((elem) => elem[1]));
  let max = Math.max(...sheetData.map((elem) => elem[1]));
  let resultState = {};
  resultState.legend = { labels: [] };
  resultState.features = {};

  let intervalArr = [];
  if (2 >= TOTAL_INTERVAL <= 10) {
    let range = max - min;
    for (let index = 1; index < TOTAL_INTERVAL; index++) {
      intervalArr.push((range / TOTAL_INTERVAL) * index);
    }
  }
  console.log("interval arr", intervalArr, intervalArr.length);
  //normalize interval array
  intervalArr = intervalArr.map((elem, i, arr) => {
    if (i == arr.length - 1) return parseFloat(Math.ceil(elem));
    return parseInt(elem);
  });
  console.log("normalized", intervalArr, intervalArr.length);

  // set feature data
  sheetData.forEach((arr) => {
    let key = arr[0];
    let value = arr[1];
    resultState.features[key] = {
      label: key,
      data: bigNumberFormatter(value.toString()),
      color: MAP_SETTINGS.COLOR_PALETTE[getNormalizedColorPaletteIndex(getIntervalIndex(intervalArr, value), TOTAL_INTERVAL)],
      opacity: getNormalizedColorPaletteIndex(getIntervalIndex(intervalArr, value), TOTAL_INTERVAL) / 10,
    };
  });
  // set legend labels
  intervalArr.forEach((elem, i) => {
    resultState.legend.labels.push({
      text: `< ${elem}`,
      color: MAP_SETTINGS.COLOR_PALETTE[getNormalizedColorPaletteIndex(i, TOTAL_INTERVAL)],
    });
  });
  resultState.legend.labels.push({
    text: `< ${max.toFixed(2)}`,
    color: MAP_SETTINGS.COLOR_PALETTE[getNormalizedColorPaletteIndex(intervalArr.length, TOTAL_INTERVAL)],
  });

  return resultState;
};

calcMapStateChoroplethStandardDeviation = (sheetData) => {
  let dataset = sheetData.map((elem) => parseFloat(elem[1])); // get data Column 'B' values (Column 'A' is names of the rows)
  let resultState = {};
  resultState.legend = { labels: [] };
  resultState.features = {};

  let stats = new Statistics(dataset);
  console.log("statistics", stats.getStats());
  // set feature data
  sheetData.forEach((arr) => {
    let key = arr[0];
    let value = arr[1];
    resultState.features[key] = {
      label: key,
      data: bigNumberFormatter(value.toString()), //value,
      color: MAP_SETTINGS.COLOR_PALETTE[getStdDevIntervalIndex(stats.interval(value), MAP_SETTINGS.COLOR_PALETTE.length)],
      opacity: 0.5 + stats.interval(value) * 0.16,
    };
  });
  // set legend labels
  resultState.legend.labels = [
    { text: `${bigNumberFormatter((stats.mean() - 3 * stats.sd()).toFixed(0))}`, color: MAP_SETTINGS.COLOR_PALETTE[0] },
    { text: `${bigNumberFormatter((stats.mean() - 2 * stats.sd()).toFixed(0))}`, color: MAP_SETTINGS.COLOR_PALETTE[1] },
    { text: `${bigNumberFormatter((stats.mean() - 1 * stats.sd()).toFixed(0))}`, color: MAP_SETTINGS.COLOR_PALETTE[2] },
    { text: `${bigNumberFormatter((stats.mean() + 0 * stats.sd()).toFixed(0))}`, color: MAP_SETTINGS.COLOR_PALETTE[3] },
    { text: `${bigNumberFormatter((stats.mean() + 1 * stats.sd()).toFixed(0))}`, color: MAP_SETTINGS.COLOR_PALETTE[4] },
    { text: `${bigNumberFormatter((stats.mean() + 2 * stats.sd()).toFixed(0))}`, color: MAP_SETTINGS.COLOR_PALETTE[5] },
    { text: `${bigNumberFormatter((stats.mean() + 3 * stats.sd()).toFixed(0))}`, color: MAP_SETTINGS.COLOR_PALETTE[6] },
    { text: `${bigNumberFormatter((stats.mean() + 4 * stats.sd()).toFixed(0))}`, color: MAP_SETTINGS.COLOR_PALETTE[7] },
  ];
  return resultState;
};

calcMapStateChoroplethPrettyBreaks = (sheetData, TOTAL_INTERVAL = 10) => {
  let dataset = sheetData.map((elem) => parseFloat(elem[1])); // get data Column 'B' values (Column 'A' is names of the rows)
  let resultState = {};
  resultState.features = {};
  resultState.legend = { labels: [] };

  dataset.sort((a, b) => a - b);
  console.log("DATASET SORTED", dataset);
  let lookupTable = dataset.map((elem, i, arr) => {
    return {
      index: i,
      value: elem,
      deviation: elem - arr[i == 0 ? i : i - 1],
    };
  });
  console.log("LOOKUP TABLE", lookupTable);

  lookupTable.sort((a, b) => {
    return b.deviation - a.deviation;
  });
  console.log("SORTED LOOKUP TABLE", lookupTable);
  let intervalArr = lookupTable.slice(0, TOTAL_INTERVAL - 1);
  intervalArr = intervalArr.map((elem) => elem.value);
  intervalArr.sort((a, b) => a - b);
  console.log("intervalArr", intervalArr);

  // set feature data
  sheetData.forEach((arr) => {
    let key = arr[0];
    let value = arr[1];
    resultState.features[key] = {
      label: key,
      data: bigNumberFormatter(value.toString()),
      color: MAP_SETTINGS.COLOR_PALETTE[getNormalizedColorPaletteIndex(getIntervalIndex(intervalArr, value), TOTAL_INTERVAL)],
      opacity: (getNormalizedColorPaletteIndex(getIntervalIndex(intervalArr, value), TOTAL_INTERVAL) + 1) / 10,
    };
  });
  // set legend labels
  resultState.legend.labels = [];
  intervalArr.forEach((value, i) => {
    resultState.legend.labels.push({
      text: `< ${bigNumberFormatter(value)}`,
      color: MAP_SETTINGS.COLOR_PALETTE[getNormalizedColorPaletteIndex(i, TOTAL_INTERVAL)],
    });
  });
  resultState.legend.labels.push({
    text: `${bigNumberFormatter(intervalArr[intervalArr.length - 1])} & more`,
    color: MAP_SETTINGS.COLOR_PALETTE[getNormalizedColorPaletteIndex(intervalArr.length, TOTAL_INTERVAL)],
  });

  return resultState;
};

function getNormalizedColorPaletteIndex(index, interval) {
  if (index >= interval || index < 0 || interval < 2 || interval > 10) throw new Error("index or interval OUT of RANGE");

  let lookupTable = {
    10: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    9: [0, 2, 3, 4, 5, 6, 7, 8, 9],
    8: [0, 2, 3, 4, 6, 7, 8, 9],
    7: [0, 2, 3, 5, 6, 8, 9],
    6: [0, 2, 4, 5, 7, 9],
    5: [0, 3, 5, 7, 9],
    4: [0, 3, 6, 9],
    3: [0, 5, 9],
    2: [0, 9],
  };
  return lookupTable[interval][index];
}
function getIntervalIndex(arr, val) {
  let index = arr.findIndex((elem, i, arr) => val < elem);
  return index == -1 ? arr.length : index;
}
function getStdDevIntervalIndex(interval, len) {
  if (interval < -2) return 0;
  else if (interval > 4) return 7;
  else return interval + 3;
}
// HELPER FUNCTIONS - HELPER FUNCTIONS - HELPER FUNCTIONS - HELPER FUNCTIONS

function getMaxIndexAndValue(array) {
  // returns the max index
  let index = -1,
    value = -Infinity;
  for (const key in array) {
    if (array[key] > value) {
      index = parseInt(key);
      value = array[key];
    }
  }
  return { index, value };
}
function decToHex(dec) {
  return dec.toString(16);
}

function padToTwo(str) {
  return str.padStart(2, "0");
}

function rgbToHex(r, g, b) {
  const hexR = padToTwo(decToHex(r));
  const hexG = padToTwo(decToHex(g));
  const hexB = padToTwo(decToHex(b));

  return `#${hexR}${hexG}${hexB}`;
}

function random(max) {
  return Math.floor(Math.random() * (max + 1));
}
function randomColor() {
  return rgbToHex(random(0xff), random(0xff), random(0xff));
}
function colorIndex(value) {
  value = parseFloat(value);
  if (value < 10) return 0;
  else if (value < 20) return 1;
  else if (value < 30) return 2;
  else if (value < 40) return 3;
  else if (value < 50) return 4;
  else if (value < 60) return 5;
  else if (value < 70) return 6;
  else if (value < 80) return 7;
  else if (value < 90) return 8;
  else return 9;
}

function bigNumberFormatter(str) {
  let formatter = new Intl.NumberFormat("tr-TR", {
    //style: 'currency',
    //currency: 'TRY',
    minimumFractionDigits: 0,
  });
  return formatter.format(str);
}
function downloadObjectAsJson(object, settings) {
  let data, filename, link;

  let csv = "data:text/json;charset=utf-8," + JSON.stringify(object);

  filename = settings?.filename || "file.csv";

  data = encodeURI(csv);

  link = document.createElement("a");
  link.setAttribute("href", data);
  link.setAttribute("download", filename);
  link.click();
}

class Statistics {
  constructor(dataset) {
    this.dataset = dataset;
  }
  mean = () => {
    return this.sum() / this.dataset.length;
  };
  sum = () => {
    return this.dataset.reduce((accumulator, curr) => {
      return accumulator + curr;
    }, 0);
  };
  variance = () => {
    let mean = this.mean();
    let sum_of_squares = this.dataset.reduce((accumulator, curr) => {
      return accumulator + Math.pow(curr - mean, 2);
    }, 0);
    let variance = sum_of_squares / this.dataset.length;
    return variance;
  };
  standardDeviation = () => {
    return Math.sqrt(this.variance());
  };
  sd = () => {
    return Math.sqrt(this.variance());
  };

  /**
   *
   *                                                *
   *                                              * | *
   *                                            *   |   *
   *                                          *     |     *
   *                                       *        |        *
   *                                   *   |        |        |   *
   *                                *      |        |        |      *
   *                             *|        |        |        |        |*
   *                         *    |        |        |        |        |    *
   *                     *   -2   |   -1   |   -0   |    1   |    2   |   3    *
   *                *    |        |        |        |        |        |        |    *
   *     ______*_________|________|________|________|________|________|________|__________*___
   *                     -3       -2       -1       0        +1       +2       +3
   *
   */

  interval = (num) => {
    let mean = this.mean();
    let sd = this.standardDeviation();
    return Math.ceil((num - mean) / sd);
  };

  getStats = () => {
    return {
      sum: this.sum(),
      mean: this.mean(),
      variance: this.variance(),
      sd: this.sd(),
    };
  };
}
