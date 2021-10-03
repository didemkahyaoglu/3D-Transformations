"use strict";

var canvas;
var gl;

var trans= vec3(0,0,0);
var scale=vec3(1, 1, 1);

var rotationX= 0;
var rotationY= 1;
var rotationZ= 2;

var count = 36;

var rotation= 0;

var theta2 = 0.0;

var color= [0,0,0,1] ;
var colorLoc;
var speed= 0.5;




var FOVY=45,posX=0,posY=1,posZ=2,tarX=0,tarY=0,tarZ=0 ;

var bufferTri, bufferRect, triVertices, rectVertices,square, bufferSquare;
var vPosition;
var transformationMatrix, transformationMatrixLoc,modelView,modelViewMatrix,projectionMatrix, projection;


window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
	
	gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
	

    // Make the letters
	triVertices = [
       /* vec3(  -0.17,  -0.2 ),
        vec3(  0.17,  -0.2),
        vec3(  0.0, 0.2 )*/
		vec3(0,0.2,0)
    ];
	
	var fcolors = [vec4(1,1,1,1)];
	
	for (var i = 0; i < count; i++) {
        var angle = i*(360/count)*(Math.PI/180);
        var r = 0.18;
        triVertices.push(vec3(r*Math.cos(angle),-0.2,r*Math.sin(angle)));

    };
    triVertices.push(vec3(triVertices[1]));
	
	square = [
	    vec3(-1.0,    -1.0,    -1.0),
        vec3( 1.0,    -1.0,    -1.0),
        vec3(-1.0,    -1.0,     1.0),
        vec3( 1.0,    -1.0,     1.0)
	
	]

    rectVertices = [
        vec3(  0.0,  -0.05),
        vec3(  0.3,  -0.05),
        vec3(  0.0,  0.05),
        vec3(  0.3,  0.05)
    ];
	
	
    // Load the data into the GPU
    bufferTri = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferTri );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(triVertices), gl.STATIC_DRAW );

    // Load the data into the GPU
    bufferRect = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferRect );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(rectVertices), gl.STATIC_DRAW );
	
	bufferSquare= gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferSquare );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(square), gl.STATIC_DRAW );
	
	
    // Associate out shader variables with our data buffer
    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	
	modelView = gl.getUniformLocation( program, "modelView" );
    projection = gl.getUniformLocation( program, "projection" );

    transformationMatrixLoc = gl.getUniformLocation( program, "transformationMatrix" ); 
    colorLoc = gl.getUniformLocation( program, "color" );
	
	

    document.getElementById("FOVY").oninput = function(event) {
        FOVY = event.target.value ;
    };
	
	document.getElementById("posX").oninput = function(event) {
        posX = parseFloat(event.target.value);
    };
	document.getElementById("posY").oninput = function(event) {
        posY = parseFloat(event.target.value);
    };
	document.getElementById("posZ").oninput = function(event) {
        posZ = parseFloat(event.target.value);
    };
	
	document.getElementById("tarX").oninput = function(event) {
        tarX = parseFloat(event.target.value);
    };
	document.getElementById("tarY").oninput = function(event) {
        tarY = parseFloat(event.target.value);
    };
	document.getElementById("tarZ").oninput = function(event) {
        tarX = parseFloat(event.target.value);
    };
   
    document.getElementById("inp_objX").oninput = function(event) {
        trans[0] = event.target.value;
    };
    document.getElementById("inp_objY").oninput = function(event) {
        trans[1] = event.target.value;
    };
	document.getElementById("inp_objZ").oninput = function(event) {
        trans[2] = event.target.value;
    };
    document.getElementById("inp_obj_scale").oninput = function(event) {
        scale[0] = event.target.value;
        scale[1] = event.target.value;
    };
    document.getElementById("inp_speed").oninput = function(event) {
        speed = parseFloat(event.target.value);
    };
    document.getElementById("inp_rotationX").oninput = function(event) {
        rotationX = event.target.value;
    };
	document.getElementById("inp_rotationY").oninput = function(event) {
        rotationY = event.target.value;
    };
	document.getElementById("inp_rotationZ").oninput = function(event) {
        rotationZ = event.target.value;
    };
    document.getElementById("redSlider").oninput = function(event) {
        color[0] = event.target.value;
    };
    document.getElementById("greenSlider").oninput = function(event) {
        color[1] = event.target.value;
    };
    document.getElementById("blueSlider").oninput = function(event) {
        color[2] = event.target.value;
    };


    render();

};

var theta = 0;
var eye ;
var at ;
var up ;
var pMatrix ;
 var mvMatrix;

function render() {

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT  );

    theta += speed;
	theta2 = 0.01;
	
	 transformationMatrix = mat4();
    transformationMatrix = mult(transformationMatrix, translate(trans[0],trans[1],trans[2]));
    transformationMatrix = mult(transformationMatrix, rotate(rotationX, 1, 0, 0));
	transformationMatrix = mult(transformationMatrix, rotate(rotationY, 0, 1, 0));
	transformationMatrix = mult(transformationMatrix, rotate(rotationZ, 0, 0, 1));
    transformationMatrix = mult(transformationMatrix, scalem(scale[0],scale[1],1));
	
	
	
	
	 eye = vec3(posX,posY,posZ);
	 at = vec3(tarX,tarY,tarZ);
	 up = vec3(0.0,1.0,0.0);
   
	
	var aspect = 1.0;
	var near = 1.0;
	var far = 20.0;


    
	 pMatrix = perspective(FOVY, aspect, near, far);
	 mvMatrix = lookAt(eye, at , up)
	
	
	gl.uniformMatrix4fv( transformationMatrixLoc, false, flatten(transformationMatrix) );
    
	gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
    gl.uniformMatrix4fv( projection, false, flatten(pMatrix) );
	
	
    gl.uniform4fv( colorLoc,[179, 155, 70] );
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferSquare );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
	
	
	gl.uniform4fv( colorLoc, flatten(color) );
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferTri );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 360 );
	

	
	gl.uniform4fv( colorLoc, [0.0,1.0,0.0,1.0] );
	transformationMatrix = mult(transformationMatrix, translate(0,0.2,0));
    transformationMatrix = mult(transformationMatrix, rotateZ(theta));
 
    gl.uniformMatrix4fv( transformationMatrixLoc, false, flatten(transformationMatrix));
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferRect );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );

    gl.uniform4fv( colorLoc, [1.0,0.0,0.0,1.0] );
    transformationMatrix = mult(transformationMatrix, rotateZ(120));
    gl.uniformMatrix4fv( transformationMatrixLoc, false, flatten(transformationMatrix));
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
	
    gl.uniform4fv( colorLoc, [0.0,0.0,1.0,1.0] );
    transformationMatrix = mult(transformationMatrix, rotateZ(120));
    gl.uniformMatrix4fv( transformationMatrixLoc, false, flatten(transformationMatrix));
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
	
	

	

    window.requestAnimFrame(render);
}
