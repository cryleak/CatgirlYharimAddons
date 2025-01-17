import Settings from "../../config"

let yVelo = 3.5
const ping = 100

register("Command", (Velocity) => {
    yVelo = parseFloat(Velocity)
}).setName("velo")

const simulation = register("tick", () => {
    // const denmark = Player.getPlayer().func_110148_a(net.minecraft.entity.SharedMonsterAttributes.field_111263_d).func_111126_e()
    // if (denmark) ChatLib.chat(denmark)
    if (Server.getIP() !== "localhost" && Server.getIP() !== "127.0.0.1") return
    if (Settings().simulateSpeed) {
        Player.getPlayer().func_110148_a(net.minecraft.entity.SharedMonsterAttributes.field_111263_d).func_111128_a(0.50000000745)
        Player.getPlayer().field_71075_bZ.func_82877_b(0.50000000745) // Make hclip work correctly
    }

    // Lava bounce
    if (Settings().simulateLavaBounce) {
        if (Player.getPlayer().func_180799_ab() || World.getBlockAt(Math.floor(Player.getX()), Math.floor(Player.getY()), Math.floor(Player.getZ())).type.getRegistryName().includes("rail") && Player.getY() - Math.floor(Player.getY()) < 0.1) {
            simulation.unregister()

            setTimeout(() => Player.getPlayer().func_70016_h(Player.getPlayer().field_70159_w, yVelo, Player.getPlayer().field_70179_y), ping)
            setTimeout(() => simulation.register(), ping + 100)
        }
    }
});
