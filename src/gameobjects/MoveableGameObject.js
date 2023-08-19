import Phaser from 'phaser';

class MoveableGameObject extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, key) {
      super(scene.matter.world, x, y, key);
      //Add to the display list of the scene, otherwise the texture won't be displayed
      scene.sys.displayList.add(this);
      scene.sys.updateList.add(this);
      //Set a fixed rotation so if critters/monsters run into either other, they don't end up constantly spinning
      this.setFixedRotation();
      this.xVelo = 0;
      this.yVelo = 0;
    }
  
    getXVelo() {
      return this.xVelo;
    }
  
    setXVelo(xVelo) {
      this.xVelo = xVelo;
    }
  
    getYVelo() {
      return this.yVelo;
    }
  
    setYVelo(yVelo) {
      this.yVelo = yVelo;
    }
  
    //Move this object towards the provided oject, at the provided speed.
    moveToObj(spriteToMoveTo, speed) {
      const angleToMoveTo = this.getAngle(this.x, this.y, spriteToMoveTo.x, spriteToMoveTo.y);
      super.setAngle(angleToMoveTo);
      const vectorToMoveTo = this.getUnitVector(this.x, this.y, spriteToMoveTo.x, spriteToMoveTo.y);
      this.setXVelo((vectorToMoveTo.x * speed));
      this.setYVelo((vectorToMoveTo.y * speed));
    }
  
    targetEaten() {
      this.xVelo = 0;
      this.yVelo = 0;
    }

    /* Find the angle from one object (normally the critter) and another (normally the food), so we can point one at the
      other. */
    getAngle(x1, y1, x2, y2) {
      //console.log("obj1=(" + x1 + "," + y1 + ") obj2=(" + x2 + "," + y2 + ")");
      return ((Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI) + 90);
    }
    
    /* Get the unit vector of one object to another. The result is used to set the correct X and Y velocity so that we
      can move one object to another. */
    getUnitVector(x1, y1, x2, y2) {
      //console.log("getUnitVector=(" + x1 + "," + y1 + ") obj2=(" + x2 + "," + y2 + ")");
      const distX = x2 - x1;
      const distY = y2 - y1;
      const hyp = Math.sqrt((distX * distX) + (distY * distY));
      const normalX = distX / hyp;
      const normalY = distY / hyp;
      //console.log("returning x=" + normalX + ", y=" + normalY);
      return {x: normalX, y: normalY};
    }
  }
  
export default MoveableGameObject;