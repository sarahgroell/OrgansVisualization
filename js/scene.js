//Déclaration des pointeurs permettant de transmettre au Shader la géométrie de la scène
var vertexBuffer = null;
var indexBuffer = null;
var colorBuffer = null;

var organs = [];

var selectBox = document.getElementById('selectOrgan');
var texteInformation = document.getElementById('informations');

//Tableau correspondant aux buffer
var indices = [];
var vertices = [];
var colors = [];

var vertexBuffersArray = [];
var indexBuffersArray = [];
var textureBuffersArray = [];
var normalBuffersArray = [];
var indicesArray = [];
var texColorTab = new Array();

//Déclaration des matrices de transformations
var mvMatrix = mat4.create(); //ModelViewMatrix
var pMatrix = mat4.create(); //Projection Matrix
var nMatrix = mat4.create(); //Normals Matrix


var tx = 0.0;
var ty = -14.0;
var tz = -32.0;

var rx = 2;



window.onkeydown = checkKey;
//window.onkeyup = checkKeyUp;

var movingStep = 1.0;

function checkKey(ev){

	switch(ev.keyCode){
		case 87: tz+=movingStep; break;
		case 83: tz-=movingStep; break;
		case 37: tx-=movingStep; break;
		case 39: tx+=movingStep; break;
		case 38: ty+=movingStep; break;
		case 40: ty-=movingStep; break;
		case 68: turnR();break;
		case 65: turnL();break;
		default:
			console.log(ev.keyCode);
		break;
	}
	console.log(tx,ty,tz);
}


function initShaderParameters(prg){
		//Géométrie et couleurs associées
		prg.vertexPositionAttribute 	= glContext.getAttribLocation(prg, "aVertexPosition");
			glContext.enableVertexAttribArray(prg.vertexPositionAttribute);

			prg.vertexNormalAttribute 		= glContext.getAttribLocation(prg, "aVertexNormal");
			glContext.enableVertexAttribArray(prg.vertexNormalAttribute);

			prg.textureCoordsAttribute 		= glContext.getAttribLocation(prg, "aTextureCoord");
			glContext.enableVertexAttribArray(prg.textureCoordsAttribute);

			prg.colorTextureUniform 		= glContext.getUniformLocation(prg, "uColorTexture");

			prg.pMatrixUniform             	= glContext.getUniformLocation(prg, 'uPMatrix');
			prg.mvMatrixUniform            	= glContext.getUniformLocation(prg, 'uMVMatrix');
			prg.nMatrixUniform             	= glContext.getUniformLocation(prg, 'uNMatrix');
			prg.lightPositionUniform       	= glContext.getUniformLocation(prg, 'uLightPosition');
}

//code pour créer la géométrie
function initBuffers(){
	vertexBuffer = getVertexBufferWithVertices(vertices);
	colorBuffer  = getVertexBufferWithVertices(colors);
	indexBuffer  = getIndexBufferWithIndices(indices);
}


function turnL(){
for (var i = 0; i < organs.length; i++) {
		organs[i].rotateObjOnYAxis(-10);
	}
}


function turnR(){
	for (var i = 0; i < organs.length; i++) {
			organs[i].rotateObjOnYAxis(10);
		}
}
function getInformations(){
	var strOrgane = selectOrgan.options[selectOrgan.selectedIndex].value;
	if(strOrgane != 0){
		document.getElementById('informations').innerHTML = "<p>Here are the informations about the "+strOrgane+":</p>";
		for (var i = 0; i < organs.length; i++) {
			if(strOrgane == organs[i].name){
				document.getElementById('informations').innerHTML += "<p>"+organs[i].infos+"</br><small>&copyWikipedia</small></p>";
			}
		}
	}
}
function isolate(){
	var strOrgane = selectOrgan.options[selectOrgan.selectedIndex].value;
	if(strOrgane != 0){
		console.info("isoler "+strOrgane);
		for (var i = 0; i < organs.length; i++) {
			if(strOrgane != organs[i].name){
				organs[i].printed = false;
			}
		}
		selectOrgan.disabled = true;
	}
}

function reload(){
	selectOrgan.disabled = false;
	for (var i = 0; i < organs.length; i++) {
		organs[i].printed = true;
	}
	//reset de la scène
	mat4.identity(mvMatrix);
	tx = 0.0;
	ty = -14.0;
	tz = -32.0;
	rotX = 0;
	rotY = 0;
}

function allOrgans(x,y,z){
	organs.push(new Organ(vec3.fromValues(x,y,z), "../model/OBJ/oesophage.obj", "model/OBJ/EsophagusC.JPG", "Esophagus"));
	organs.push(new Organ(vec3.fromValues(x,y,z), "../model/OBJ/gallBlader.obj", "model/OBJ/GallBladderC.JPG","Gall Bladder"));
	organs.push(new Organ(vec3.fromValues(x,y,z), "../model/OBJ/Heart.obj", "model/OBJ/Heart_C.JPG","Heart"))
	organs.push(new Organ(vec3.fromValues(x,y,z), "../model/OBJ/kidney.obj", "model/OBJ/KidneyC.JPG", "Kidney"));
	organs.push(new Organ(vec3.fromValues(x,y,z), "../model/OBJ/largeIntestine.obj", "model/OBJ/IntestinesC.JPG", "Large Intestine"));
	organs.push(new Organ(vec3.fromValues(x,y,z), "../model/OBJ/liver.obj", "model/OBJ/LiverC.JPG", "Liver"));
	organs.push(new Organ(vec3.fromValues(x,y,z), "../model/OBJ/lungs.obj", "model/OBJ/LungsC.JPG", "Lungs"));
	organs.push(new Organ(vec3.fromValues(x,y,z), "../model/OBJ/pancreas.obj", "model/OBJ/Pancreas.JPG", "Pancreas"));
	organs.push(new Organ(vec3.fromValues(x,y,z), "../model/OBJ/smallIntestines.obj", "model/OBJ/IntestinesC.JPG", "Small Intestines"));
	organs.push(new Organ(vec3.fromValues(x,y,z), "../model/OBJ/stomach.obj", "model/OBJ/Stomach_CE.JPG", "Stomach"));
	organs.push(new Organ(vec3.fromValues(x,y,z), "../model/OBJ/spleen.obj", "model/OBJ/SpleenC.JPG", "Spleen"));

	this.setInfos();
}

function setInfos(){
	organs[0].setInformations("The esophagus commonly known as the food pipe or gullet, is an organ in vertebrates through which food passes, aided by peristaltic contractions, from the pharynx to the stomach.");
	organs[1].setInformations("In vertebrates the gallbladder (also gall bladder, biliary vesicle or cholecyst) is a small organ where bile (a fluid produced by the liver) is stored and concentrated before it is released into the small intestine.</br> Humans can live without a gallbladder.");
	organs[2].setInformations("The heart is a muscular organ in humans and other animals, which pumps blood through the blood vessels of the circulatory system.</br> Blood provides the body with oxygen and nutrients, as well as assists in the removal of metabolic wastes.</br> The heart is located between the lungs, in the middle compartment of the chest.");
	organs[3].setInformations("The kidneys are two bean-shaped organs found on the left and right sides of the body in vertebrates. They filter the blood in order to make urine, to release and retain water, and to remove waste. They also control the ion concentrations and acid-base balance of the blood. Each kidney feeds urine into the bladder by means of a tube known as the ureter.");
	organs[4].setInformations("The large intestine, or the large bowel, is the last part of the gastrointestinal tract and of the digestive system in vertebrates. Water is absorbed here and the remaining waste material is stored as feces before being removed by defecation.")
	organs[5].setInformations("The liver is a vital organ of vertebrates and some other animals. In the human, it is located in the upper right quadrant of the abdomen, below the diaphragm. The liver has a wide range of functions, including detoxification of various metabolites, protein synthesis, and the production of biochemicals necessary for digestion.")
	organs[6].setInformations("The lungs are the primary organs of respiration in humans and many other animals including a few fish and some snails. In mammals and most other vertebrates, two lungs are located near the backbone on either side of the heart. Their function in the respiratory system is to extract oxygen from the atmosphere and transfer it into the bloodstream, and to release carbon dioxide from the bloodstream into the atmosphere, in a process of gas exchange.")
	organs[7].setInformations("The pancreas is a glandular organ in the digestive system and endocrine system of vertebrates. In humans, it is located in the abdominal cavity behind the stomach. It is an endocrine gland producing several important hormones, including insulin, glucagon, somatostatin, and pancreatic polypeptide which circulate in the blood. The pancreas is also a digestive organ, secreting pancreatic juice containing digestive enzymes that assist digestion and absorption of nutrients in the small intestine.")
	organs[8].setInformations("The small intestine or small bowel is the part of the gastrointestinal tract between the stomach and the large intestine, and is where most of the end absorption of food takes place. The small intestine has three distinct regions – the duodenum, jejunum, and ileum. The duodenum receives bile and pancreatic juice through the pancreatic duct, controlled by the sphincter of Oddi. The primary function of the small intestine is the absorption of nutrients and minerals from food.")
	organs[9].setInformations("The stomach is a muscular, hollow, dilated part of the gastrointestinal tract that functions as an important organ in the digestive system. The stomach is present in many animals including vertebrates, echinoderms, insects (mid-gut), and molluscs. In humans and many other vertebrates it is involved in the second phase of digestion, following mastication (chewing).")
	organs[10].setInformations("The spleen is an organ found in virtually all vertebrates. Similar in structure to a large lymph node, it acts primarily as a blood filter.</br>The spleen plays important roles in regard to red blood cells (also referred to as erythrocytes) and the immune system. It removes old red blood cells and holds a reserve of blood, which can be valuable in case of hemorrhagic shock, and also recycles iron. As a part of the mononuclear phagocyte system, it metabolizes hemoglobin removed from senescent red blood cells (erythrocytes). The globin portion of hemoglobin is degraded to its constitutive amino acids, and the heme portion is metabolized to bilirubin, which is removed in the liver.")
}

function initScene(){

	document.getElementById("turnLeft").addEventListener("click", turnL);
	document.getElementById("turnRight").addEventListener("click", turnR);
	document.getElementById("isolate").addEventListener("click",isolate);
	document.getElementById("reload").addEventListener("click",reload);
	document.getElementById("infos").addEventListener("click",getInformations);

	var x = 0;
	var y = 0;
	var z = 0;
	allOrgans(x,y,z);

	organs.forEach(function(element, index){
		selectOrgan.innerHTML += "<option value='" + element.name + "'>"+element.name+"</option>";
	});



	//Enabling the depth test
	glContext.enable(glContext.DEPTH_TEST);
	glContext.clearColor(0.9, 0.9, 0.9, 1.0);

	//Setting the projection matrix as an identity matrix
	mat4.identity(pMatrix);

	//Defining the viewport as the size of the canvas
	glContext.viewport(0.0, 0.0, c_width, c_height);

	mat4.perspective(pMatrix, degToRad(45), c_width / c_height, 0.1, 1000.0);

	//Appel à la fonction rendu de la scène
	renderLoop();

}

function drawScene(){
		//Préparation de la scène
		glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
		glContext.uniformMatrix4fv(prg.pMatrixUniform, false, pMatrix);

		mat4.identity(mvMatrix);

		rotateModelViewMatrixUsingQuaternion();

		translationMat = mat4.create();
		mat4.identity(translationMat);
		mat4.translate(translationMat, translationMat,[tx, ty, tz]);
		mvMatrix = mat4.multiply(mat4.create(), translationMat, mvMatrix);

		organs.forEach(function(element, index){
				element.drawObject(mat4.create(),mvMatrix);
		});
}




//Cette fonction retourne un context de rendu graphique
function initWebGL(){

	glContext = getGLContext('webgl-canvas');

	//initialisation pour le programme Shaders (composé du vertex et fragment shader) et des buffers géométrie, couleurs, texture -> CG
	initProgram();
	initScene();
	initBuffers();

}
