import Settings from "../../config"

let yVelo = 3.37

register("Command", (Velocity) => {
    yVelo = parseFloat(Velocity)
}).setName("velo")

register("tick", () => {
    if (!Settings().simulation) return
    let Velo = yVelo
    if (Player.getPlayer().func_180799_ab()) {
        Player.getPlayer().func_70016_h(Player.getPlayer().field_70159_w, Velo, Player.getPlayer().field_70179_y);
    }
})

register("tick", () => {
    if (!Settings().simulation) return
    if (Server.getIP() !== "localhost") return
    let player = Player.getPlayer();
    player.func_110148_a(net.minecraft.entity.SharedMonsterAttributes.field_111263_d).func_111128_a(0.50000000745)
});
