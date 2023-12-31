const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
const data = {
  content: [
    ["adana", 87, 13],
    ["adıyaman", 28, 72],
    ["afyonkarahisar", 6, 94],
    ["ağrı", 71, 29],
    ["amasya", 57, 43],
    ["ankara", 54, 46],
    ["antalya", 69, 31],
    ["artvin", 55, 45],
    ["aydın", 89, 11],
    ["balıkesir", 39, 61],
    ["bilecik", 84, 16],
    ["bingöl", 52, 48],
    ["bitlis", 56, 44],
    ["bolu", 75, 25],
    ["burdur", 66, 34],
    ["bursa", 76, 24],
    ["çanakkale", 30, 70],
    ["çankırı", 60, 40],
    ["çorum", 89, 11],
    ["denizli", 19, 81],
    ["diyarbakır", 98, 2],
    ["edirne", 14, 86],
    ["elazığ", 86, 14],
    ["erzincan", 45, 55],
    ["erzurum", 23, 77],
    ["eskişehir", 25, 75],
    ["gaziantep", 12, 88],
    ["giresun", 43, 57],
    ["gümüşhane", 38, 62],
    ["hakkari", 74, 26],
    ["hatay", 83, 17],
    ["ısparta", 36, 64],
    ["mersin", 39, 61],
    ["istanbul", 91, 9],
    ["izmir", 36, 64],
    ["kars", 92, 8],
    ["kastamonu", 14, 86],
    ["kayseri", 76, 24],
    ["kırklareli", 89, 11],
    ["kırşehir", 96, 4],
    ["kocaeli", 85, 15],
    ["konya", 15, 85],
    ["kütahya", 50, 50],
    ["malatya", 87, 13],
    ["manisa", 56, 44],
    ["kahramanmaraş", 2, 98],
    ["mardin", 76, 24],
    ["muğla", 12, 88],
    ["muş", 72, 28],
    ["nevşehir", 40, 60],
    ["niğde", 54, 46],
    ["ordu", 33, 67],
    ["rize", 94, 6],
    ["sakarya", 13, 87],
    ["samsun", 7, 93],
    ["siirt", 3, 97],
    ["sinop", 48, 52],
    ["sivas", 67, 33],
    ["tekirdağ", 54, 46],
    ["tokat", 41, 59],
    ["trabzon", 81, 19],
    ["tunceli", 68, 32],
    ["şanlıurfa", 19, 81],
    ["uşak", 57, 43],
    ["van", 66, 34],
    ["yozgat", 62, 38],
    ["zonguldak", 49, 51],
    ["aksaray", 68, 32],
    ["bayburt", 55, 45],
    ["karaman", 29, 71],
    ["kırıkkale", 30, 70],
    ["batman", 18, 82],
    ["şırnak", 88, 12],
    ["bartın", 16, 84],
    ["ardahan", 85, 15],
    ["ığdır", 31, 69],
    ["yalova", 73, 27],
    ["karabük", 59, 41],
    ["kilis", 84, 16],
    ["osmaniye", 18, 82],
    ["düzce", 37, 63],
  ],
};

app.get("/list", (req, res) => {
  res.status(200).json(data);
});

app.listen(3000, () => {
  console.log("App listening on port:3000");
});
