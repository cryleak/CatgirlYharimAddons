import Settings from "../../config"

let yVelo = 3.37

register("Command", (Velocity) => {
    yVelo = parseFloat(Velocity)
}).setName("velo")

register("tick", () => {
    // const denmark = Player.getPlayer().func_110148_a(net.minecraft.entity.SharedMonsterAttributes.field_111263_d).func_111126_e()
    // if (denmark) ChatLib.chat(denmark)
    if (Server.getIP() !== "localhost") return
    if (Settings().simulateSpeed) {
        Player.getPlayer().func_110148_a(net.minecraft.entity.SharedMonsterAttributes.field_111263_d).func_111128_a(0.50000000745)
        Player.getPlayer().field_71075_bZ.func_82877_b(0.50000000745) // Make hclip work correctly
    }

    // Lava bounce
    if (Settings().simulateLavaBounce) {
        let Velo = yVelo
        if (Player.getPlayer().func_180799_ab()) Player.getPlayer().func_70016_h(Player.getPlayer().field_70159_w, Velo, Player.getPlayer().field_70179_y);
    }
});
