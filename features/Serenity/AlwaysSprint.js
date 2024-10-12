import Settings from "../../config"

const wKey = Client.getMinecraft().field_71474_y.field_74351_w

register("tick", () => {
    if (!Settings().alwaysSprint) return
    Player.getPlayer().func_70031_b((wKey.func_151470_d() && !Player.isSneaking()))
})