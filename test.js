let arr = [
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
];
let cityArr = arr.map((elem) => elem[0]);

function xrand(num) {
  return Math.floor(Math.random() * num + 1);
}

let newData = arr.map((elem) => {
  let x1 = xrand(100);
  let x2 = xrand(100 - x1);
  let x3 = xrand(100 - x1 - x2);
  let x4 = xrand(100 - x1 - x2 - x3);
  return [elem[0], x1, x2, x3, x4];
});

console.log(JSON.stringify(newData));

let grades = [
  35.23, 16.79, 60.7, 43.8, 39.58, 65.48, 54.73, 75.3, 63.56, 22.17, 29.74, 58.65, 62.73, 18.98, 51.67, 38.73, 56.63, 29.86, 39.78, 49.84, 19.72,
  63.71, 35.54, 24.75, 30.79, 27.84, 32.67, 51.06, 57.77, 48.49, 49.82, 43.22, 59.64, 61.21, 28.6, 49.32, 28, 33.13, 55.47, 65.94, 47.12, 56.91,
  63.38, 39.62, 56.02, 57.22, 56.44, 51.19, 25.01, 62.21, 46.33, 23.66, 53.59, 40.5, 39.3, 69.12, 82.55, 66.16, 70.83, 52.83, 38.6, 65.72, 44.89,
  50.57, 55.44, 27.24, 48.22, 32.08, 38.61, 49.35, 53.13, 56.54, 61.72, 76.03, 29.49, 59.1, 81.24, 86.57, 53.19, 57.63, 50.53,
];

console.log(
  grades.map((elem, i, arr) => {
    return [cityArr[i], parseInt(elem)];
  })
);
