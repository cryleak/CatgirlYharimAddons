import Settings from "../../config"
import { stormTickTimerGui } from "../../config"
import data from "../../utils/data"


const timePerTick = 20
let ticks = null
let enabled = 0

const tickListener = register("packetReceived", () => {
    if (ticks <= 0) ticks = timePerTick
    ticks--
}).setFilteredClass(net.minecraft.network.play.server.S32PacketConfirmTransaction).unregister()

register("renderOverlay", () => {
    if (stormTickTimerGui.isOpen()) {
        Renderer.scale(data.stormTickTimer.scale)
        Renderer.drawStringWithShadow("§a1.00s", data.stormTickTimer.x, data.stormTickTimer.y)
        return
    }
    if (!ticks && ticks != 0) return
    Renderer.scale(data.stormTickTimer.scale)
    Renderer.drawStringWithShadow((ticks > 3 ? "§a" : "§c") + (ticks / 20).toFixed(2) + "s", data.stormTickTimer.x, data.stormTickTimer.y)
})


register("chat", (message) => {
    if (!Settings().stormTickTimerEnabled) return
    if (message === "[BOSS] Storm: Pathetic Maxor, just like expected.") {
        ticks = timePerTick
        tickListener.register()
    } else if (message === "[BOSS] Storm: I should have known that I stood no chance." || message === "[BOSS] Storm: Bahahaha! Not a single intact pillar remains!") {
        tickListener.unregister()
        ticks = null
    }
    // You can't sync the ticks this way because the dialogue is sometimes delayed if he is saying another line of dialogue right as he is getting crushed.
    // else if (message.includes("[BOSS] Storm: Oof") || message.includes("[BOSS] Storm: Ouch, that hurt!")) {
    // ticks = timePerTick
    // }
}).setChatCriteria("${message}")

register("command", () => {
    if (!Settings().stormTickTimerEnabled) return
    enabled = !enabled
    if (enabled) {
        ticks = timePerTick
        tickListener.register()
    } else {
        tickListener.unregister()
        ticks = null
    }
}).setName("stormtick")

register("worldUnload", () => {
    tickListener.unregister()
    ticks = null
})

register("dragged", (_0, _1, x, y, bn) => {
    if (!stormTickTimerGui.isOpen()) return
    if (bn === 2) return
    data.stormTickTimer.x = x / data.stormTickTimer.scale
    data.stormTickTimer.y = y / data.stormTickTimer.scale
    data.save()
})

register("scrolled", (_0, _1, dir) => {
    if (!stormTickTimerGui.isOpen()) return
    if (dir == 1) data.stormTickTimer.scale += 0.01
    else data.stormTickTimer.scale -= 0.01
    data.stormTickTimer.scale = Math.round(data.stormTickTimer.scale * 100) / 100
    ChatLib.clearChat(69420) // Prevent clogging chat by deleting the previous message
    new Message(`§0[§6Yharim§0] §7Current scale: ${data.stormTickTimer.scale}`).setChatLineId(69420).chat()
    data.save()
})