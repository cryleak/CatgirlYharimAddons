import RenderLib from "../../../RenderLib"
import Settings from "../../config"

let inTerms = false

register("Chat", () => {
    if (!Settings().espTerminals) return
    inTerms = true
    render.register()
}).setCriteria("[BOSS] Goldor: Who dares trespass into my domain?")

register("Chat", () => {
    inTerms = false
    render.unregister()
}).setCriteria("[BOSS] Goldor: You have done it, you destroyed the factory…")

const render = register("renderWorld", () => {
    if (!inTerms) return
    World.getAllEntitiesOfType(net.minecraft.entity.item.EntityArmorStand).forEach(ent => {
        if (!ent.getName().includes("Inactive")) return
        RenderLib.drawInnerEspBox(ent.getRenderX(), ent.getRenderY() + 1, ent.getRenderZ(), 1, 1, 0, 1, 1, 0.5, true)
        RenderLib.drawEspBox(ent.getRenderX(), ent.getRenderY() + 1, ent.getRenderZ(), 1, 1, 0, 0, 1, 0.5, true)
    })
}).unregister()

