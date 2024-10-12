import RenderLibV2 from "../../../RenderLibV2"
import { block, chat } from "../../utils/utils"
import Settings from "../../config"

let toggled = false
let toggleCooldown = false

register("Tick", () => {
    if (Client.isInGui()) return
    if (!Keyboard.isKeyDown(Settings().witherAimbot)) return
    if (toggleCooldown) return
    toggleCooldown = true
    Client.scheduleTask(4, () => toggleCooldown = false)
    if (!toggled) {
        aimbot.register()
        toggled = true
        chat("Aimbot on")
    } else {
        aimbot.unregister()
        toggled = false
        chat("Aimbot off")
    }
})

register("Chat", () => {
    if (!Settings().espWither) return
    render.register()
}).setCriteria(/^Maxor*/)

register("Chat", () => {
    render.unregister()
}).setCriteria("[BOSS] Necron: All this, for nothing...")


const render = register("renderWorld", () => {
    if (!Settings().espWither) return
    World.getAllEntitiesOfType(net.minecraft.entity.boss.EntityWither).forEach(ent => {
        if (ent.getName() !== "Wither") return
        RenderLibV2.drawInnerEspBox(ent.getRenderX(), ent.getRenderY(), ent.getRenderZ(), 1, 3, 0, 1, 1, 0.5, true)
        RenderLibV2.drawEspBox(ent.getRenderX(), ent.getRenderY(), ent.getRenderZ(), 1, 3, 0, 0, 1, 0.5, true)
    })
}).unregister()

const aimbot = register("renderWorld", () => {
    World.getAllEntitiesOfType(net.minecraft.entity.boss.EntityWither).forEach(ent => {
        block(ent.getRenderX(), ent.getRenderY(), ent.getRenderZ())
    })
}).unregister()