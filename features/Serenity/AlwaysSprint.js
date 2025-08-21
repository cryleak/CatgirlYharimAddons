import Settings from "../../config"

const Keybinding = Java.type("net.minecraft.client.settings.KeyBinding")
const sprintKey = Client.getMinecraft().field_71474_y.field_151444_V.func_151463_i()

register("tick", () => {
    if (!Settings().alwaysSprint) return
    Keybinding.func_74510_a(sprintKey, !Keyboard.isKeyDown(sprintKey))
})