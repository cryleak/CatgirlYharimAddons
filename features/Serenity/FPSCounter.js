import Settings from "../../config"
import data from "../../utils/data"
import { fpsCounterGui } from "../../config"


let framesElapsed = 0
let timerStart = Date.now()
let fpsCounter = 0

register("renderWorld", () => {
    if (!Settings().fpsCounter) return
    framesElapsed++
    if (Date.now() - timerStart > Settings().fpsCounterUpdateInterval) {
        fpsCounter = framesElapsed / ((Date.now() - timerStart) / 1000)
        framesElapsed = 0
        timerStart = Date.now()
    }
})
register("renderOverlay", () => {
    if (!Settings().fpsCounter) return
    Renderer.scale(data.fpsCounter.scale)
    Renderer.drawStringWithShadow(`§f${fpsCounter.toFixed(0)} fps`, Renderer.screen.getWidth() * data.fpsCounter.x, Renderer.screen.getHeight() * data.fpsCounter.y)
})


register("dragged", (_0, _1, x, y, bn) => {
    if (!fpsCounterGui.isOpen()) return
    if (bn === 2) return
    data.fpsCounter.x = (x / data.fpsCounter.scale) / Renderer.screen.getWidth()
    data.fpsCounter.y = (y / data.fpsCounter.scale) / Renderer.screen.getHeight()
    data.save()
})

register("scrolled", (_0, _1, dir) => {
    if (!fpsCounterGui.isOpen()) return
    if (dir == 1) data.fpsCounter.scale += 0.01
    else data.fpsCounter.scale -= 0.01
    data.fpsCounter.scale = Math.round(data.fpsCounter.scale * 100) / 100
    ChatLib.clearChat(6949) // Prevent clogging chat by deleting the previous message
    new Message(`§0[§6Yharim§0] §7Current scale: ${data.fpsCounter.scale}`).setChatLineId(6949).chat()
    data.save()
})