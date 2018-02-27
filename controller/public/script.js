
//============================================================================
// Initiate the progress circles
$('.kid-1.circle').circleProgress({
	animation: false,
	background: {
		image: "kid_a.jpg",
		inset: true
	},
	fill: {
		color: "rgba(0, 0, 0, .3)",
		image: "color.png"
	},
	startAngle: Math.PI + Math.PI/2
});

$('.kid-2.circle').circleProgress({
	animation: false,
	background: {
		image: "kid_b.jpg",
		inset: true
	},
	fill: {
		color: "rgba(0, 0, 0, .3)",
		image: "color.png"
	},
	startAngle: Math.PI + Math.PI/2
});

$('.kid-3.circle').circleProgress({
	animation: false,
	background: {
		image: "kid_c.jpg",
		inset: true

	},
	fill: {
		color: "rgba(0, 0, 0, .3)",
		image: "color.png"
	},
	startAngle: Math.PI + Math.PI/2
});

//============================================================================
// A bunch of initial variable values

// The categories of our scoring sliders
var scoreCategories = [
	'social interactions', // 0
	'school achievements', // 1
	'chores', // 2
	'eating healthy', // 3
	'taking care of pet(s)', // 4
];

var catMultipliers = [
	1.0, // 0
	1.0, // 1
	1.0, // 2
	1.0, // 3
	1.0, // 4
];

// start with initial scores between 4 and 8
var kids_sum_scores = [
	Math.round(Math.random() * (8 - 4) + 4),
	Math.round(Math.random() * (8 - 4) + 4),
	Math.round(Math.random() * (8 - 4) + 4),
];

//============================================================================
// Fill <kids_scores> with values so we have a full graph to draw when the
// page has loaded

// how many kids?
var numKids = 3;
// The score on the left of the chart
var beginScores = [
	//Math.round(Math.random() * (8 - 4) + 4),
	7.0,
	4.0,
	6.0
];

// score on the right of the chart and in the top left corner
var endScores = [
	0.0,
	0.0,
	0.0
];
// how much does the score change per event
var scoreStep = 0.1;
 // how many scores to save
var numScores = 300;
// scores is an 2d array with [[score, category], ...], this way we can
// still change the previous scores when we change the weights using the sliders
var scores = [];

//============================================================================
// Stuff we use for the canvas where we draw the history graph
var scoreCanvas = document.getElementById('score-canvas');
var scoreCtx = scoreCanvas.getContext('2d'); // drawing context
var w = scoreCanvas.width;
var h = 100; // height of the graph part, excluding the axis labels
var xstep = (w-10) / (numScores-1); // calculate how wide each measurement is
var ystep = 10; // how many steps per score point on the y-axis
var colors = ["#00aaff", "#3cff3b", "#fc5630"]; // colors to use for our lines


// For each kid, generate <numScores> random scores with categories and
// add them to an array (per kid)
function setInitialScores(){
	for(var k=0; k<numKids; k++){
	// for(var k=0; k<1; k++){
		scores[k] = new Array(numScores);
		for(var i=0; i<numScores; i++){
			// Get a random category ID (0-4)
			var category = Math.round(Math.random() * 4);
			// Determine of this event is + or -
			if(Math.round(Math.random() * 1) == 0){ // fake positive event
				scores[k][i] = [scoreStep, category];
			}else{
				scores[k][i] = [-scoreStep, category]; // fake negative event
			}
			// update the end score
			endScores[k] += parseFloat(scores[k][i]);
		}
	}
}

//============================================================================
// Draw a line on the given canvas
function drawLine(context, x1, y1, x2, y2, color, thickness){
	context.beginPath();
	context.moveTo(x1, y1);
	context.lineTo(x2, y2);
	context.strokeStyle = color;
	context.lineWidth = thickness;
	context.stroke();

}
//============================================================================
// Plot our history graoh
function drawOnCanvas(){
	// Draw a white box to clear the canvas
	scoreCtx.fillStyle = "#ffffff";
	scoreCtx.beginPath();
	scoreCtx.rect(0, 0, w, 100);
	scoreCtx.fill();
	scoreCtx.lineWidth = 1;

	// draw minute labels
	scoreCtx.fillStyle = "#000000";
	scoreCtx.fillText("-3 uur", 10, 100);
	drawLine(scoreCtx, 10, h-10, 10, 5, "#000000", 1);
	scoreCtx.fillText("-2 uur", 100, 100);
	drawLine(scoreCtx, 100, h-10, 100, 5, "#aaaaaa", 1);
	scoreCtx.fillText("-1 uur", 200, 100);
	drawLine(scoreCtx, 200, h-10, 200, 5, "#aaaaaa", 1);
	drawLine(scoreCtx, 300, h-10, 300, 5, "#aaaaaa", 1);

	// draw the axis grid
	for(var i=1.0;i<10.0;i+=0.5){
		if(i%1 == 0){
			if(i != 1.0){
				drawLine(scoreCtx, 10, h-i*ystep, w, h-i*ystep, "#aaaaaa", 1);
			}else{
				drawLine(scoreCtx, 10, h-i*ystep, w, h-i*ystep, "#000000", 1);
			}
			if(i!=0){
				scoreCtx.fillStyle = "#000000";
				scoreCtx.fillText(i, 0, 100-i*ystep+3);
			}
		}else{
			drawLine(scoreCtx, 10, h-i*ystep, w, h-i*ystep, "#cccccc", 1);
		}
	}

	// draw a red line at 5.0 points
	drawLine(scoreCtx, 10, h/2, w, h/2, "#ff0000", 1);

	// plot the kids' scores
	var avgMultiplier = getAverageMultiplier();
	for(var k=0; k<numKids; k++){
	// for(var k=0; k<1; k++){
	// for(var k=0; k<1; k++){
		var score_1 = beginScores[k];
		var score_2;
		// console.log("first y: score: ", score_1);
		// console.log("first y: pos: ", h-score_1*ystep);
		// console.log("first x pos: ", 10 + (1-1)*xstep)
		for(var i=0; i<numScores; i++){
			if(scores[k][i][1] == -1){ // bonus event
				score_2 = score_1 + (avgMultiplier * scores[k][i][0]);
			}else if(scores[k][i][1] == -2){ // this one is used to keep them within bounds
				score_2 = score_1 + scores[k][i][0];
			}else{// regular event, not bonus
				score_2 = score_1 + (catMultipliers[scores[k][i][1]] * scores[k][i][0]);
			}

			// console.log(draw_score_1);
			var draw_score_1 = Math.min(Math.max(3.0, score_1), 9.0);
			var draw_score_2 = Math.min(Math.max(3.0, score_2), 9.0);
			// console.log(draw_score_1);
			drawLine(scoreCtx,
				10 + (i-1)*xstep, h-draw_score_1*ystep,
				10 + i*xstep,  h-draw_score_2*ystep,
				colors[k], 2);
			score_1 = score_2;
		}
	}
}

drawLine(scoreCtx,
	10, h-0.9*ystep,
	300,  h-0.9*ystep,
"#0000ff", 4);

//============================================================================
// The names of the kids (for easy reference in the functions)
var names = ['Sem', 'Lucas', 'Sophie'];
// Keep track of the amount of positive and negative events in a row
var shorttermScores = [0, 0, 0];

//============================================================================
// our list of events the kids can trigger
// [+ or -, event text, event category]
var events = [
	['+', 'hond uitgelaten', 4],
	['-', 'hond niet uitgelaten', 4],

	['+', 'hond gevoerd', 4],
	['-', 'hond niet gevoerd', 4],

	['+', 'kat gevoerd', 4],
	['-', 'kat niet gevoerd', 4],

	['+', 'hamster gevoerd', 4],
	['-', 'hamster niet gevoerd', 4],

	['+', 'met de hond gespeeld', 4],
	['-', 'niet met de hond gespeeld', 4],

	['+', 'met de kat gespeeld', 4],
	['-', 'niet met de kat gespeeld', 4],

	['+', 'hamsterkooi schoongemaakt', 4],
	['-', 'hamsterkooi niet schoongemaakt', 4],

	['+', 'huiswerk op tijd af', 1],
	['-', 'huiswerk niet gedaan', 1],

	['+', 'goed report', 1],
	['-', 'slecht raport', 1],

	['+', 'proefwerk goed gemaakt', 1],
	['-', 'proefwerk slecht gemaakt', 1],

	['+', 'met opa gebeld', 0],
	['-', 'opa vergeten te bellen', 0],

	['+', 'kamer gestofzuigd', 2],
	['-', 'rommel gemaakt', 2],

	['+', 'kamer opgeruimd', 2],
	['-', 'speelgoed laten slingeren', 2],

	['+', 'alle taakjes gedaan', 2],
	['-', 'niet alle taakjes gedaan', 2],

	['+', 'extra taken gedaan', 2],
	['-', 'geen taakjes gedaan', 2],

	['+', 'geholpen met koken', 0],
	['-', 'niet geholpen met koken', 0],

	['+', 'geholpen met boodschappen', 2],
	['-', 'niet geholpen met boodschappen', 2],

	['+', 'met broertje gespeeld', 0],
	['-', 'niet met broertje gespeeld', 0],

	['+', 'goed geluisterd', 0],
	['-', 'niet goed geluisterd', 0],

	['+', 'met iemand gedeeld', 0],
	['-', 'niet gedeeld met ander', 0],

	['+', 'afwas gedaan', 2],
	['-', 'afwas niet gedaan', 2],

	['+', 'aan computertijd gehouden', 0],
	['-', 'niet aan computertijd gehouden', 0],

	['+', 'buiten gespeeld', 3],
	['-', 'hele dat binnen gezeten', 3],

	['+', 'genoeg fruit gegeten', 3],
	['-', 'geen fruit gegeten', 3],

	['+', 'gezond gegeten', 3],
	['-', 'ongezond gegeten', 3],

	['+', 'iemand geholpen', 0],
	['-', 'wou niet helpen', 0],

	['+', 'planten water gegeven', 2],
	['-', 'planten geen water gegeven', 2],

	['+', 'leerkracht geholpen', 0],
	['-', 'wou leerkracht niet helpen', 0],

	['+', 'geholpen op school', 0],
	['-', 'niet geholpen op school', 0],

	['+', 'hard gewerkt op school', 1],
	['-', 'niet goed gewerkt op school', 0],

	['+', 'een vriend geholpen', 0],
	['-', 'wou vriend niet helpen', 0],

	['+', 'mama geholpen', 0],
	['-', 'ruzie gemaakt met mama', 0],

	['+', 'papa geholpen', 0],
	['-', 'ruzie gemaakt met papa', 0],

];

//============================================================================
// Bonus events to trigger after 3 positive events
var good_bonus_events = [
	'twee dagen geen taakjes',
	'een week geen taakjes',
	'extra computertijd',
	'mag dit weekend laat opblijven',
	'krijgt een cadeautje',
	'mag langer buitenspelen',
	'mag avondeten kiezen',

];

//============================================================================
// Bonus events to trigger after 3 negative events
var bad_bonus_events = [
	'twee dagen extra taakjes',
	'een week lang extra taakjes',
	'geen computer vandaag',
	'extra vroeg naar bed',
	'moet telefoon inleveren ',
];


//============================================================================
// Trigger an event for one of the kids
function triggerEvent(){
	// pick a random kid to trigger an event for
	var k = Math.floor(Math.random() * numKids);
	// var k = Math.floor(Math.random() * 3);
	// var k = Math.floor(Math.random() * 1);
	// console.log("event for: ", k);
	var name = names[k]; // kid's name

	// select a random event to trigger
	var event = events[Math.floor(Math.random() * events.length)];
	var category = event[2]; // category of the event

	var addScore = [0.0, -1]; // placeholder for the new score
	if(event[0] == '+'){ // positive event, increase score
		//scores[k][numScores-1] = [scoreStep, category];
		addScore = [scoreStep, category];
		shorttermScores[k]++;
		$(".event-log").prepend('<li><i class="fa fa-plus-circle good"></i> <b>'+name+'</b> '+event[1]+'</li>');
	}else if(event[0] == '-'){ // negative event, decrease score
		addScore = [-scoreStep, category];
		// scores[k][numScores-1] = [-scoreStep, category];
		shorttermScores[k]--;
		$(".event-log").prepend('<li><i class="fa fa-minus-circle bad"></i> <b>'+name+'</b> '+event[1]+'</li>');
	}
	// of we hit 3 positive or 3 negative events in a row for this kid, trigger a special bonus event
	if(shorttermScores[k] > 2 || shorttermScores[k] < -2){

		// check if the bonus event is positive or negative and pick random fitting event
		if(shorttermScores[k] < -2){
			addScore = [-scoreStep, -1];
			event = bad_bonus_events[Math.floor(Math.random() * bad_bonus_events.length)];
		}else{
			addScore = [scoreStep, -1];
			event = good_bonus_events[Math.floor(Math.random() * good_bonus_events.length)];
		}
		$(".event-log").prepend('<li><i class="fa fa-info-circle message"></i> <b>'+names[k]+'</b> '+event+'</li>');

		shorttermScores[k] = 0; // reset the shorttermScore
	}

	// console.log("begin: ", beginScores[k])
	// console.log("add: ", (catMultipliers[scores[k][0][1]] * scores[k][0][0]))
	if(scores[k][0][1] == -1){
		beginScores[k] = beginScores[k] + (getAverageMultiplier() * scores[k][0][0]);
	}else if (scores[k][0][1] == -2){
		beginScores[k] = beginScores[k] + scores[k][0][0];
	}else{
		beginScores[k] = beginScores[k] + (catMultipliers[scores[k][0][1]] * scores[k][0][0]);
	}
	// console.log("new: ", beginScores[k]);
	scores[k].shift();
	scores[k][numScores-1] = addScore; //addScore can be a regular score, or been overruled by a bonus event

	// add dummy scores to the scores of the other kids so they always have the same amount of measurements
	for(var n=0;n<numKids;n++){
		var useScore = [0.0, -2];
		if(n == k){
			useScore = addScore;
		}
		if(scores[n][0][1] == -1){
			beginScores[n] = beginScores[n] + (getAverageMultiplier() * scores[n][0][0]);
		}else if (scores[n][0][1] == -2){
			beginScores[n] = beginScores[n] + scores[n][0][0];
		}else{
			beginScores[n] = beginScores[n] + (catMultipliers[scores[n][0][1]] * scores[n][0][0]);
		}
		// console.log("new: ", beginScores[k]);
		scores[n].shift();
		scores[n][numScores-1] = useScore; //addScore can be a regular score, or been overruled by a bonus event
	}

	// Update the scores for all kids
	// seperate function so we can also call it before each drawOnCanvas
	updateEndScores();

	// Ugly way to remove old messages to prevent log buildup
	var numLogs = 0;
	$('.event-log li').each(function(){
		numLogs++;
		if(numLogs > 12){
			$(this).remove();
		}
	});
}
function getAverageMultiplier(){
	var avgMultiplier = 0.0;
	for(var i=0;i<catMultipliers.length;i++){
		avgMultiplier += catMultipliers[i];
	}
	avgMultiplier /= 5.0;
	avgMultiplier *= 3.0; // make three times as large as the average multiplier
	return avgMultiplier;
}
//============================================================================
// Combines all of the seperate scores into a final grade
function updateEndScores(){
	var avgMultiplier = getAverageMultiplier();
	for(var k=0; k<numKids; k++){
	// for(var k=0; k<1; k++){
		var score = beginScores[k];
		for(var i=0;i<numScores;i++){
			if(scores[k][i][1] == -1){
				score += scores[k][i][0] * avgMultiplier;
			}else if(scores[k][i][1] == -2){
				score += scores[k][i][0];
			} else{
				score += scores[k][i][0] * catMultipliers[scores[k][i][1]];
			}
		}
		if(isNaN(score)){
			console.log("score is error: ", score);
		}
		endScores[k] = score;
		if(endScores[k] < 3.0){
			scores[k][numScores-1] = [1.0, -2];//3.0 - endScores[k];
			endScores[k] = 3.0;
		}else if(endScores[k] > 9.0){
			scores[k][numScores-1] = [-1.0, -2];//9.0 - endScores[k];
			endScores[k] = 9.0;
		}
		var useEndscore = Math.min(Math.max(3.0, endScores[k]), 9.0);
		$('.kid-'+(k+1)+'.circle').circleProgress('value', useEndscore/10.0);
		$('.kid-'+(k+1)+'.kid-score').html(useEndscore.toFixed(1));
	}
}

//============================================================================
// Set the initial scores for the history window, then set an interval for
// updating the scores and drawing them to the canvas
setInitialScores();

// trigger a couple of event to fill the event log
for(var i=0;i<10;i++){
	triggerEvent();
}
drawOnCanvas();

setInterval(function(){
	triggerEvent();
	drawOnCanvas();
}, 20000);

//============================================================================
// Respond to the sliders being moved
var i=0;
$( ".slider" ).slider({
	step: 0.15,
	min: -0.1,
	max: 1.5,
	change: function( event, ui ) {
		catMultipliers[parseInt($(this).data('cat'))] = $(this).slider("option", "value");
		updateEndScores();
		drawOnCanvas();
	}
}).each(function(){
	catMultipliers[i] = Math.random();
	$(this).slider('value', catMultipliers[i]);
	i++;
});
//============================================================================
// Set the clock to the current time
function setClock(){
	var dateObj = new Date();
	var hours = dateObj.getHours();
	var minutes = dateObj.getMinutes();
	$('.clock').html(hours+":"+minutes);
}

//============================================================================
// Set the date to the current day
// Format is: mo 07 june 2016 (but days and months in Dutch)
var days = ["zo", "ma", "di", "wo", "do", "vr", "za"];
var months = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sept", "okt", "nov", "dec"];
function setDate(){
	var dateObj = new Date();
	var month = months[dateObj.getUTCMonth()]; //months from 1-12
	var dayName = days[dateObj.getDay];
	var day = dateObj.getUTCDate();
	if(day < 10){
		day = "0"+day;
	}
	var year = dateObj.getUTCFullYear();
	$('.date').html(day + " " + month + " " + year);
}

//============================================================================
// Set the clock and date once at load
setClock();
setDate();
//============================================================================
// Set clock every 2 seconds, date every hour
setInterval(function(){setClock();}, 2000);
setInterval(function(){setDate();}, 60000);
