# 3D-Transformations-Viewing

In this assignment you will practice 3D Transformations, camera control and perspective projection. There are mainly 4 parts.

  1. Update the shapes: We have a 2D windmill from Assignment 2. Make it 3D.The body can be a cone for instance. Also draw a square surface which
     won’t be affected from transformations and color changes.
  2. 3D transformations: Update transformations so you will have 3D ones instead of 2D.
  3. Camera control: Camera position and target (where camera looks at) will be controlled as well as field of view of the camera.
  4. Perspective projection: Implement perspective projection

# How to Do
  1) Draw a 2 by 2 square below the windmill. (At height -1, one corner should be at (-1, -1, -1) and the opposite corner 
     needs to be at (1, -1, 1).This square shouldn’t be affected when you transform the mill, or when you change the color. (Fixed color, fixed position) 
  2) Update The Windmill Shape: Now you need 3D coordinates so instead of
     vec2 use vec3
  3) Camera control and perspective projection: As you would remember from the lecture, you need to have modelMatrix, viewMatrix, and projectionMatrix. 
     modelMatrix is used to transform the objects and you already have it from assignment 2.viewMatrix defines external camera parameters. You need to control the 
     camera with camera position, and camera target (where camera looks at).For that you can use the lookAt(eye,target,up) function from MV.js.
     projectionMatrix determines the internal camera parameters (FOVY,
     aspect ratio etc.). In order to generate perspective projection matrix you
     can use the perspective method from MV.js (perspective(fovy,
     aspect, near, far);). FOVY can be controlled from GUI and initially
     you may set it to 45 degrees. Set aspect ratio to 1 and give suitable values
     for near and far (range of visible depth).
  4) Vertex shader: Your vertex shader (in HTML file) needs to get
     modelMatrix, viewMatrix, and projectionMatrix as uniform variables and
     use them appropriately. Update the vertex shader so that it makes
     perspective projection. Check the examples from Ed Angel’s website to get
     help.
  5) Transformations in 3D. Make translation and rotation in x, y, and z. It is
     straightforward. Scale needs to be uniform (single control for x, y, and z).
  6) Insert gl.enable(gl.DEPTH_TEST); into init method for correct
     handling of occlusions.
     
     ![HOSTAPHOBIA1](https://user-images.githubusercontent.com/45897290/145682457-964fceb4-ddf0-44b5-851f-c7b507d97400.gif)
