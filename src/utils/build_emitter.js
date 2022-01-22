
import * as PIXI from "pixi.js";
import * as particles from '@pixi/particle-emitter'

function preBuildEmitter(container) {
  return function buildEmitter(color) {
    return new particles.Emitter(container, )
  }
}

export default preBuildEmitter