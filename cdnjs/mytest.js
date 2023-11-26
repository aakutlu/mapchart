
/* let headings = $('h1')
console.log(headings) */

/* $(document).ready(function() {
  document.write("Hello, World!");
  document.close()
}); */

/* $(document).ready(function() {
  $("div").click(function() {alert("Hello, world!");});
}); */

/* $(document).ready(function() {
  console.log(this)  // refers to window.document obj
}); */

/* $("div").click(function(event) {
  console.log(this)  //this refers to div.container1
  console.log(event.target) //refers to h1.foo
}); */

/* $("div").click((event) => {
  //console.log(this)  //refers to window obj
  console.log(event.target)  //refers to h1.foo obj (not div, the h1)
}) */

/* function scope() {
  console.log(this, arguments.length);

}

scope()                       //==> "window", 0
scope.call("foobar", [1,2,3]);  //==> "foobar", 1
scope.apply("foobar", [1,2,3]); //==> "foobar", 2 */


/* var myVar = "global var";     // ==> Declare a global variable
let myLet = "global let";     // ==> Declare a global variable

function testNormalFn() {
   var myVar = "local var ";   // ==> Declare a local variable
   let myLet = "local let ";   // ==> Declare a local variable
   document.writeln(myVar); // ==> local
   document.writeln(myLet); // ==> local
}

let testArrowFn = () =>  {
  var myVar = "local var ";   // ==> Declare a local variable
  let myLet = "local let ";   // ==> Declare a local variable
  document.writeln(myVar); // ==> local
  document.writeln(myLet); // ==> local
}

$(document).ready(function(){
  testNormalFn()
  testArrowFn()
  document.writeln(myVar); // ==> local
  document.writeln(myLet); // ==> local
  document.close()
}) */

/* $("body").click(function(event) {
  console.log("clicked: " + event.target);
}); */
/* $("body").click(function() {
  console.log("clicked: " + this);
}); */


/* $(document).ready(function() {
  //$("p").hide()

  $("h1").click(function(event){
    //console.log(event.target)
    //console.log($('h1'))
    //$('h1').hide()
    //event.target.style = 'display: none;'
    //$('h1:first-child').css('background-color', 'red')
    //$(this).css('background-color', 'red')
    //$(event.target).css('background-color', 'red')
    //$(this).blur() //lost focus
  })
}); */

/* JQUERY SELECTORS JQUERY SELECTORS JQUERY SELECTORS JQUERY SELECTORS*/
/* $(document).ready(function(){
  $(selector)
});
$("div").click(function(){
  // jQuery code goes here
});
$("div").bind('click', function(){
  // jQuery code goes here
}); */


$(document).ready(function() {
  $("button").click(function(){
    console.log( "Author = " + $("#home").data("name"));
    console.log( "Year = " + $("#home").data("year"));
    console.log( "Age = " + $("#home").data("age"));   //not work
    console.log( "Age = " + $("#home").attr("age")); // not work
  });
});