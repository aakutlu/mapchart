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
    let variance = sum_of_squares / (this.dataset.length - 1);
    return variance;
  };
  standartDeviation = () => {
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
    let sd = this.standartDeviation();
    return Math.ceil((num - mean) / sd);
  };
}
let set1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]; //all unique
let set2 = [46, 69, 32, 60, 52, 41];

let set0_1 = [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1];
let set0_5 = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5];
let set0_9 = [0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9];
let set0_X = [0.2, 0.3, 0.7, 0.8];

let set1_ = [1.1, 1.2, 1.2, 1.2, 1.3, 1.3, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9]; //13.5%
let set2_ = [2.2, 2.5, 2.8]; //2.35%
let set3_ = []; //0.15%

let positive_set = [...set0_1, ...set0_5, ...set0_9, ...set0_X, ...set1_, ...set2_, ...set3_];
let negative_set = positive_set.map((val) => -val);
//console.log(positive_set);
//console.log(negative_set);

let worker = new Statistics([...positive_set, ...negative_set]);
let all = [...positive_set, ...negative_set];
all = all.map((elem) => (elem + 2.8).toFixed(2));
console.log(all);

console.log("sum: ", worker.sum());
console.log("mean: ", worker.mean());
console.log("variance: ", worker.variance());
console.log("standartDeviation: ", worker.standartDeviation());
console.log("interval: ", worker.interval(-2.2));
