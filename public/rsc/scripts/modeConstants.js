let modeConstants

function defineModeConstants(){
  modeConstants = {
    "0":{ //cube, default values
      width: 1,
      height: 1,
      gravityStrength: 73.5,
      ceilingDeath: true,
      cameraLock: false,
      jumpStrength: 17.5,
      terminalVelocityActive: true,
      drawnWidth: 1,
      drawnHeight: 1,
      drawOffsetX: 0,
      drawOffsetY: 0,
      blockHitboxSize: 0.4,
      blockHitboxOffset: 0.3,
      image: icon
    },
    "1":{ //Ship
      gravityStrength: 27,
      ceilingDeath: false,
      cameraLock: true,
      terminalVelocityActive: false,
      drawnWidth: 1.295,
      drawOffsetX: -0.1475,
      image: ship
    },
    "2":{ //Ball
      gravityStrength: 45,
      cameraLock: true,
      terminalVelocityActive: false,
      drawnWidth: 1.1,
      drawnHeight: 1.1,
      drawOffsetX: -0.05,
      drawOffsetY: 0.05,
      image: ball
    },
    "3":{ //Ufo
      gravityStrength: 40,
      ceilingDeath: false,
      cameraLock: true,
      jumpStrength: 11,
      terminalVelocityActive: false,
      drawnWidth: 1.295,
      drawOffsetX: -0.1475,
      rotation: 0,
      image: ufo
    },
    "4":{ //Wave
      width:0.33,
      height: 0.33,
      blockHitboxSize: 0,
      gravityStrength: 0,
      ceilingDeath: false,
      cameraLock: true,
      drawnWidth: 0.75,
      drawnHeight: 0.455,
      drawOffsetX: -0.21,
      drawOffsetY: 0.0625,
      image: wave
    },
    "5":{ //Robot
      rotation: 0,
      drawnWidth: 1.1
    },
    "6":{ //Spider
      drawnWidth: 1.2,
      drawnHeight: 1.15,
      drawOffsetX: -0.2,
      drawOffsetY: 0.1,
      cameraLock: true,
      rotation: 0,
      terminalVelocityActive: false
    },
    "7":{ //Swing Copter
      gravityStrength: 40,
      ceilingDeath: false,
      cameraLock: true,
      terminalVelocityActive: false,
      image: swingCopter
    },
    "10":{ //mini cube
      width: 0.5,
      height: 0.5,
      drawnWidth: 0.5,
      drawnHeight: 0.5,
      blockHitboxSize: 0.2,
      blockHitboxOffset: 0.15,
      jumpStrength: 14,
    },
    "11":{ //mini Ship
      gravityStrength: 40,
      drawnWidth: 0.6475,
      drawOffsetX: -0.07375,
    },
    "12":{ //mini Ball
      gravityStrength: 50,
      drawnWidth: 0.6,
      drawnHeight: 0.6,
    },
    "13":{ //mini Ufo
      gravityStrength: 40,
      jumpStrength: 10,
      drawnWidth: 0.6475,
      drawOffsetX: -0.07375,
    },
    "14":{ //mini wave
      width:0.2,
      height: 0.2,
      blockHitboxSize: 0,
      drawnWidth: 0.5,
      drawnHeight: 0.3,
      drawOffsetX: -0.15,
      drawOffsetY: 0.05,
    },
    "15":{ //mini Robot
      jumpStrength: 8,
      drawnWidth: 0.6
    },
    "16":{ //mini spider
      drawnWidth: 0.6,
      drawnHeight: 0.55,
      drawOffsetX: -0.1,
    },
    "17":{ //mini Swing Copter
      gravityStrength: 50,
    }
  }
}