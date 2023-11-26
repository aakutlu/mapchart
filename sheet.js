class Sheet {
  constructor(source, container, map, settings, data) {
    this.source = source;
    this.container = container; //html dom element which data sits inside
    this.map = map;
    this.settings = settings;
    this.data = data;
    this.sheet = undefined;
  }

  static getJsonSource = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      const message = `An Error has occured: ${response.status}`;
      throw new Error(message);
    }
    return response.json();
  };
  initialize = async () => {
    this.data = await Sheet.getJsonSource(this.source);
    this.sheet = jspreadsheet(this.container, {
      data: this.data,
      tableWidth: "700px",
      tableHeight: "300px",
      parseTableFirstRowAsHeader: false,
      //toolbar: true,
      columns: [
        { type: "text", width: "120" },
        { type: "number", width: "80" },
        { type: "number", width: "80" },
        { type: "number", width: "80" },
        { type: "number", width: "80" },
        { type: "number", width: "80" },
        { type: "number", width: "80" },
        { type: "number", width: "80" },
        { type: "number", width: "80" },
        { type: "number", width: "80" },
        { type: "number", width: "80" },
        { type: "number", width: "80" },
        { type: "number", width: "80" },
        { type: "number", width: "80" },
        { type: "number", width: "80" },
        { type: "number", width: "80" },
        { type: "number", width: "80" },
        { type: "number", width: "80" },
        { type: "number", width: "80" },
        { type: "number", width: "80" },
        { type: "number", width: "80" },
        { type: "number", width: "80" },
        { type: "number", width: "80" },
        { type: "number", width: "80" },
        { type: "number", width: "80" },
        { type: "number", width: "80" },
        { type: "number", width: "80" },
        { type: "number", width: "80" },
        { type: "number", width: "80" },
      ],
      //defaultRowHeight: "30",
      //defaultColumnWidth: "100",
      onchange: this.changed,
      onselection: this.selection,
      onblur: this.blur,
    });

    //this.sheet.goto(75);
  };
  getData = () => {
    return this.sheet.getData();
  };
  setData = (data) => {
    this.sheet.setData(data);
  };

  changed = function (instance, cell, x, y, value) {
    console.log("spreadsheetHandler.js -> changed listener");
    var cellName = jspreadsheet.getColumnNameFromId([x, y]);
    updateSvg();
  };
  selection = function (worksheet, px, py, ux, uy, origin) {
    let selectedRows = [...Array(uy - py + 1).keys()].map((x) => x + py);
    let selectedItems = selectedRows.map((index) => {
      return this.getValueFromCoords(0, index);
    });
    myMap.clearMarks();
    updateSvg();
    myMap.mark(selectedItems);
  };
  blur = () => {
    myMap.clearMarks();
    updateSvg();
  };
}
