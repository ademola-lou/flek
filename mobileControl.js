var mobileControls = function(player, camera, guiEngine, scene){
  var isMobile = ( function () {

  var ua = navigator.userAgent,
      apple_phone      = /iPhone/i,
      apple_ipod       = /iPod/i,
      apple_tablet     = /iPad/i,
      android_phone    = /(?=.*\bAndroid\b)(?=.*\bMobile\b)/i, // Match 'Android' AND 'Mobile'
      android_tablet   = /Android/i,
      windows_phone    = /IEMobile/i,
      windows_tablet   = /(?=.*\bWindows\b)(?=.*\bARM\b)/i, // Match 'Windows' AND 'ARM'
      other_blackberry = /BlackBerry/i,
      other_opera      = /Opera Mini/i,
      other_firefox    = /(?=.*\bFirefox\b)(?=.*\bMobile\b)/i; // Match 'Firefox' AND 'Mobile'

  if (
    apple_phone.test( ua )      ||
    apple_phone.test( ua )      ||
    apple_ipod.test( ua )       ||
    apple_tablet.test( ua )     ||
    android_phone.test( ua )    ||
    android_tablet.test( ua )   ||
    windows_phone.test( ua )    ||
    windows_tablet.test( ua )   ||
    other_blackberry.test( ua ) ||
    other_opera.test( ua )      ||
    other_firefox.test( ua )
  ) {

    return true;

  } else {

    return false;

  }

} )();

    let adt = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    let xAddPos = 0;
    let yAddPos = 0;
    let xAddRot = 0;
    let yAddRot = 0;
    let translateTransform;

    let leftThumbContainer = makeThumbArea("leftThumb", 2, "blue", null);
        leftThumbContainer.height = "160px";
        leftThumbContainer.width = "160px";
        leftThumbContainer.isPointerBlocker = true;
        leftThumbContainer.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        leftThumbContainer.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        leftThumbContainer.alpha = 0.4;

    let leftInnerThumbContainer = makeThumbArea("leftInnterThumb", 4, "blue", null);
        leftInnerThumbContainer.height = "80px";
        leftInnerThumbContainer.width = "80px";
        leftInnerThumbContainer.isPointerBlocker = true;
        leftInnerThumbContainer.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        leftInnerThumbContainer.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;


    let leftPuck = makeThumbArea("leftPuck",0, "blue", "blue");
            leftPuck.height = "60px";
            leftPuck.width = "60px";
            leftPuck.isPointerBlocker = true;
            leftPuck.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
            leftPuck.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;


        leftThumbContainer.onPointerDownObservable.add(function(coordinates) {
            leftPuck.isVisible = true;
            leftPuck.floatLeft = coordinates.x-(leftThumbContainer._currentMeasure.width*.5);
            leftPuck.left = leftPuck.floatLeft;
            leftPuck.floatTop = adt._canvas.height - coordinates.y-(leftThumbContainer._currentMeasure.height*.5);
            leftPuck.top = leftPuck.floatTop*-1;
            leftPuck.isDown = true;
            leftThumbContainer.alpha = 0.9;
        });

        leftThumbContainer.onPointerUpObservable.add(function(coordinates) {
            xAddPos = 0;
            yAddPos = 0;
            leftPuck.isDown = false;
            leftPuck.isVisible = false;
            leftThumbContainer.alpha = 0.4;
        });


        leftThumbContainer.onPointerMoveObservable.add(function(coordinates) {
            if (leftPuck.isDown) {
                xAddPos = coordinates.x-(leftThumbContainer._currentMeasure.width*.5);
                yAddPos = adt._canvas.height - coordinates.y-(leftThumbContainer._currentMeasure.height*.5);
                leftPuck.floatLeft = xAddPos;
                leftPuck.floatTop = yAddPos*-1;
                leftPuck.left = leftPuck.floatLeft;
                leftPuck.top = leftPuck.floatTop;
                }
        });

    // adt.addControl(leftThumbContainer);
   //  leftThumbContainer.addControl(leftInnerThumbContainer);
   //  leftThumbContainer.addControl(leftPuck);
  //   leftPuck.isVisible = false;

     let rightThumbContainer = makeThumbArea("rightThumb", 2, "red", null);
         rightThumbContainer.height = "160px";
         rightThumbContainer.width = "160px";
         rightThumbContainer.isPointerBlocker = true;
         rightThumbContainer.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
         rightThumbContainer.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
         rightThumbContainer.alpha = 0.4;

     let rightInnerThumbContainer = makeThumbArea("rightInnterThumb", 4, "red", null);
         rightInnerThumbContainer.height = "80px";
         rightInnerThumbContainer.width = "80px";
         rightInnerThumbContainer.isPointerBlocker = true;
         rightInnerThumbContainer.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
         rightInnerThumbContainer.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;


     let rightPuck = makeThumbArea("rightPuck",0, "red", "red");
             rightPuck.height = "60px";
             rightPuck.width = "60px";
             rightPuck.isPointerBlocker = true;
             rightPuck.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
             rightPuck.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;


         rightThumbContainer.onPointerDownObservable.add(function(coordinates) {
             rightPuck.isVisible = true;
             rightPuck.floatLeft = adt._canvas.width - coordinates.x-(rightThumbContainer._currentMeasure.width*.5);
             rightPuck.left = rightPuck.floatLeft*-1;
             rightPuck.floatTop = adt._canvas.height - coordinates.y-(rightThumbContainer._currentMeasure.height*.5);
             rightPuck.top = rightPuck.floatTop*-1;
             rightPuck.isDown = true;
             rightThumbContainer.alpha = 0.9;
         });

         rightThumbContainer.onPointerUpObservable.add(function(coordinates) {
             xAddRot = 0;
             yAddRot = 0;
             rightPuck.isDown = false;
             rightPuck.isVisible = false;
             rightThumbContainer.alpha = 0.4;
         });


         rightThumbContainer.onPointerMoveObservable.add(function(coordinates) {
             if (rightPuck.isDown) {
                 xAddRot = adt._canvas.width - coordinates.x-(rightThumbContainer._currentMeasure.width*.5);
                 yAddRot = adt._canvas.height - coordinates.y-(rightThumbContainer._currentMeasure.height*.5);
                 rightPuck.floatLeft = xAddRot*-1;
                 rightPuck.floatTop = yAddRot*-1;
                 rightPuck.left = rightPuck.floatLeft;
                 rightPuck.top = rightPuck.floatTop;
                 }
         });

      adt.addControl(rightThumbContainer);
      rightThumbContainer.addControl(rightInnerThumbContainer);
      rightThumbContainer.addControl(rightPuck);
      rightPuck.isVisible = false;

  
    scene.registerBeforeRender(function(){ 
             // player.velocity = yAddPos*.2
              camera.alpha -= xAddRot/1500*-1;
              camera.beta += yAddRot/1500*-1;

        }); 

function makeThumbArea(name, thickness, color, background, curves){
   let rect = new BABYLON.GUI.Ellipse();
       rect.name = name;
       rect.thickness = thickness;
       rect.color = color;
       rect.background = background;
       rect.paddingLeft = "0px";
       rect.paddingRight = "0px";
       rect.paddingTop = "0px";
       rect.paddingBottom = "0px";




   return rect;
}
}