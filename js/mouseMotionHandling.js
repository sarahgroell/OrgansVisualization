/*******************************************************************************
		Mouse motion handling
*******************************************************************************/

// get a reference to the webgl canvas
var myCanvas = document.getElementById("webgl-canvas");
myCanvas.onmousemove = handleMouseMove;
myCanvas.onmousedown = handleMouseDown;
myCanvas.onmouseup = handleMouseUp;


// this variable will tell if the mouse is being moved while pressing the button
var rotY = 0; //rotation on the Y-axis (in degrees)
var rotX = 0; //rotation on the X-axis (in degrees)
var dragging = false;
var oldMousePos = {x: 0, y: 0};
var mousePos;
var rotSpeed = 1.0; //rotation speed
var mouseButton;


function handleMouseMove(event) {
	  event = event || window.event; // IE-ism
	  mousePos = {
		  x: event.clientX,
		  y: event.clientY
	  };
	  if (dragging){


		dX = mousePos.x - oldMousePos.x;
		dY = mousePos.y - oldMousePos.y;

		//console.log((mousePos.x - oldMousePos.x) + ", " + (mousePos.y - oldMousePos.y)); //--- DEBUG LINE ---

		rotY += dX > 0 ? rotSpeed : dX < 0 ? -rotSpeed : 0;
		rotX += dY > 0 ? rotSpeed : dY < 0 ? -rotSpeed : 0;
		oldMousePos = mousePos;
	  }
}

function handleMouseDown(event){
	dragging = true;
	mouseButton = event.button;

	console.log((" x : "+ mousePos.x +",y : "+ mousePos.y));
	//vec4 worldCoordinates = inverseProjectionView * vec4(2.0 * clientX / clientWidth - 1.0, 2.0 * clientY / clientHeight - 1.0, near, 1.0)
	let inverse = mat4.invert(mat4.create(),pMatrix);
	let a = 2.0*mousePos.x/c_width-1.0;
	let b = 2.0*mousePos.y/c_height-1.0;
/*	console.log("a : "+a);
	console.log("b : "+b);
	let worldCoordinates = mat4.multiply(mat4.create(),inverse, vec4.fromValues(a,b,0.1,1.0));
	console.log(worldCoordinates);*/
	//console.log(get2dPoint(mousePos.x,mousePos.y,mvMatrix,pMatrix,c_width,c_height));

	oldMousePos.x = oldMousePos.y = 0;
}

function handleMouseUp(event){
	dragging = false;
}

// in the next function 'currentRy' is usefull for the exercice 8-9
var currentRy = 0; //keeps the current rotation on y, used to keep the billboards orientation


function rotateModelViewMatrixUsingQuaternion(stop) {

	stop = typeof stop !== 'undefined' ? stop : false;
	//use quaternion rotations for the rotation of the object with the mouse
	/*angle = degToRad(rotY);
	currentRy += angle;
	rotYQuat = quat.create([0, Math.sin(angle/2), 0, Math.cos(angle/2)]);

	angle = degToRad(rotX);
	rotXQuat = quat4.create([Math.sin(angle/2), 0, 0, Math.cos(angle/2)]);

	myQuaternion = quat4.multiply(rotYQuat, rotXQuat);
	mvMatrix = mat4.multiply(quat4.toMat4( myQuaternion ), mvMatrix);
*/
	rx = degToRad(rotX);
	ry = degToRad(rotY);

	rotXQuat = quat.create();
	quat.setAxisAngle(rotXQuat, [1, 0, 0], rx);

	rotYQuat = quat.create();
	quat.setAxisAngle(rotYQuat, [0, 1, 0], ry);

	myQuaternion = quat.create();
	quat.multiply(myQuaternion, rotYQuat, rotXQuat);

	rotationMatrix = mat4.create();
	mat4.identity(rotationMatrix);
	mat4.fromQuat(rotationMatrix, myQuaternion);
  mat4.multiply(mvMatrix, rotationMatrix, mvMatrix);

	//console.log(rotX + " " + rotY);
  //reset rotation values, otherwise rotation accumulates
	if(stop){
		rotX = 0.;
		rotY = 0.;
	}
}

/*
function impactOfSphereFrom(camPos, camFront, sphere){
			vec3.normalize(camFront,camFront);
			let spherePos = vec3.fromValues(sphere.x,sphere.y,sphere.z);
			let b = vec3.dot(vec3.scale(vec3.create(),camFront,2.0),vec3.sub(vec3.create(), camPos, spherePos));
			let c = Math.pow(vec3.len(
							vec3.sub(vec3.create(),camPos,spherePos)
					),2) - (sphere.radius * sphere.radius);

			let delta = b*b - 4*c;
			//document.getElementById("view-delta").innerHTML = delta;
			if(delta == 0){
					let t = -b / 2 ;
					//document.getElementById("view-t0").innerHTML = t;
					return vec3.scaleAndAdd(vec3.create(),camPos,camFront,t);
			}else if (delta < 0){
					return null;
			}else if (delta > 0){
					let t0 = (-b + Math.sqrt(delta))/2;
					let t1 = (-b - Math.sqrt(delta))/2;

					//document.getElementById("view-t0").innerHTML = t0;
					//document.getElementById("view-t1").innerHTML = t1;

					let t = t0;

					if(0 < t0 && t0 < t1){
							t = t1;
					}

					return vec3.scaleAndAdd(vec3.create(),camPos,camFront,t);

			}
	}


function get2dPoint(point3D_x,point3D_y, viewMatrix, projectionMatrix, width, height) {

	      viewProjectionMatrix = mat4.multiply(mat4.create(),projectionMatrix * viewMatrix);
	      //transform world to clipping coordinates
	      point3D = mat4.multiply(viewProjectionMatrix, point3D, viewProjectionMatrix);
	      winX = (point3D_x + 1)  / 2.0 *  width ;
	      winY = ( 1 - point3D_y ) / 2.0 * height ;
	      return vec2.create(winX, winY);
}*/
