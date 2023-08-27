import Phaser from 'phaser';
import MoveableGameObject from './MoveableGameObject';

class Critter extends MoveableGameObject {
    constructor(scene, x, y, id, speed, gameConfig, gameState) {
      super(scene, x, y, 'critter');
      this.id = id;
      this.speed = speed;
      this.gameConfig = gameConfig;
      this.gameState = gameState;
      console.log("Critter created with speed=" + speed + " and id=" + id);
      this.lastTimeCheckingFood = 0;
      this.lastTimeSettingAngle = 0;
      this.currentlyEating = false;
      this.monster = null;
      this.amountOfFoodEaten = 0;
      this.critterNumber = scene.add.text(x, y, this.amountOfFoodEaten, {font: `${this.gameState.game.config.width / 40}px Arial`, fill: "#ffffff"}).setOrigin(0.5);
    }
  
    eatenByMonster(scene, monster, physicsWorld) {
      console.log("critter with id=" + this.id + " being eaten by monster!");
      this.monster = monster;
      this.setStatic(true);
      this.setTint(0xff0000);
      scene.tweens.add({
          targets: this,
          alpha: 0,
          duration: this.gameConfig.tweenSpeed * 2,
          yoyo: true,
          repeat: 3,
          callbackScope: this,
          onComplete: function(){
              monster.finishedEating();
              this.setVisible(false);
              physicsWorld.remove(this);
          }
      });
    }
  
    moveTowardsFood(food) {
      this.moveToObj(food, this.speed);
    }
  
    eatFood(scene, food) {
      this.targetEaten();
      this.currentlyEating = true;

      // For each piece of food eaten, update the text, then increase size and decrease speed
      this.amountOfFoodEaten++;
      this.critterNumber.setText(this.amountOfFoodEaten);
      this.displayHeight = this.displayHeight * this.gameConfig.foodEatSizeIncrease;
      this.displayWidth = this.displayWidth * this.gameConfig.foodEatSizeIncrease;
      this.speed = this.speed * this.gameConfig.foodEatSpeedDecrease;

      console.log("critter " + this.id + " eaten some food");
      scene.tweens.add({
          targets: this,
          scaleX: 1.02,
          scaleY: 1.02,
          duration: this.gameConfig.tweenSpeed,
          yoyo: true,
          repeat: 0,
          callbackScope: this,
          onComplete: function(){
              this.currentlyEating = false;
          }
      });
    }
  
    /* Handle a collision. Could be with food, another critter, or maybe a monster. Return true if we want to remove the
    collided object from the world, since we can't do it from this class. */
    collisionDetected(scene, gameObjectB) {
      //Check if the collided object was food
      for (var i = 0; i < this.gameState.allFood.length; i++) {
        var foodFromArray = this.gameState.allFood[i];
        if (foodFromArray == gameObjectB) {
          console.log("food eaten, removing object from food array at position=" + i);
          //TODO: should store the eaten food to reuse the resource when adding the next bit of new food
          this.gameState.allFood.splice(i, 1);
          this.eatFood(scene, gameObjectB);
          return true;
        }
      }
      return false;
    }
  
    update(scene) {
      // Update the score text (which is a separate component) to always be above the critter
      this.critterNumber.x = this.x;
      this.critterNumber.y = this.y;

      if (this.currentlyEating) {
          this.setXVelo(0);
          this.setYVelo(0);
      } else {
        var now = new Date().getTime();
        if (this.gameState.allFood.length > 0) {
          if (now > (this.lastTimeCheckingFood + this.gameConfig.objectTargetChangeInterval)) {
            //Select one of the possible algorithms for moving towards food
            this.moveTowardsClosestFood();
            //this.moveTowardsNewestFood();
            //this.moveTowardsOldestFood();
          }
          // if (this.getXVelo() !== 0 || this.getYVelo() !== 0) {
          //   this.anims.play('critter-moving', true);
          // }
        } else {
          this.setXVelo(0);
          this.setYVelo(0);
          // this.anims.stop(null, true);
          // this.setFrame(0);
          if (now > (this.lastTimeSettingAngle + this.gameConfig.critterIdleAngleChangeTime)) {
            var randomDegrees = Phaser.Math.Between(0, 360);
            this.setAngle(randomDegrees);
            this.lastTimeSettingAngle = now;
          }
        }
      }
      this.setVelocity(this.getXVelo(), this.getYVelo());
      //TODO: check which part of the board grid the critter is in
    }
  
    moveTowardsClosestFood() {
      const now = new Date().getTime();
      if (this.gameState.allFood.length == 1) {
        if (this.gameState.allFood[0].canCritterSmellYet(now, this)) {
          this.moveTowardsFood(this.gameState.allFood[0]);
        }
      } else {
        var closestDistance = -1;
        var closestFood = null;
        for (var i = 0; i < this.gameState.allFood.length; i++) {
          var food = this.gameState.allFood[i];
          if (food.canCritterSmellYet(now, this)) {
            const distance = Phaser.Math.Distance.Between(this.x, this.y, food.x, food.y);
            if (closestDistance == -1 || distance < closestDistance) {
              closestFood = food;
              closestDistance = distance;
            }
          }
        }
        if (closestFood !== null) {
          this.moveTowardsFood(closestFood);
        }
      }
    }
  
    moveTowardsOldestFood() {
      this.moveTowardsFood(this.gameState.allFood[0]);
    }
  
    moveTowardsNewestFood() {
      this.moveTowardsFood(this.gameState.allFood[this.gameState.allFood.length - 1]);
    }

    getAmountOfFoodEaten() {
      return this.amountOfFoodEaten;
    }
  }
  
export default Critter;