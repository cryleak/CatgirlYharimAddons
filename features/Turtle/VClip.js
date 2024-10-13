import Settings from "../../config"

const S08PacketPlayerPosLook = Java.type("net.minecraft.network.play.server.S08PacketPlayerPosLook")
const S32PacketConfirmTransaction = Java.type("net.minecraft.network.play.server.S32PacketConfirmTransaction")

let toggled = false
let delay = 0
let vclipCooldown = false

register("Tick", () => {
    if (vclipCooldown) return
    vclipCooldown = true
    Client.scheduleTask(4, () => { 
        vclipCooldown = false
    })
    if (!Keyboard.isKeyDown(Settings().lavaVclipKeybind)) return
    if (!toggled) {
        toggled = true
        vclip.register()
    } else {
        toggled = false
        vclip.unregister()
    }
})

register("Command", () => {
    toggled = false
    vclip.unregister()
}).setName("noclip")

register("renderOverlay", () => {
    if (!toggled) return;
    let text = "Dirty Cheater!"
    let scale = 1.5
    Renderer.scale(scale)
    Renderer.drawStringWithShadow(text, (Renderer.screen.getWidth() / scale - Renderer.getStringWidth(text)) / 2, Renderer.screen.getHeight() / scale / 2 + 16)
})

const vclip = register("tick", () => {
    if (!Player.getPlayer().func_180799_ab()) return
    Player.getPlayer().func_70107_b(Player.getX(), Player.getY() - 20, Player.getZ())
    const veloPacket = register("packetReceived", (packet, event) => {
        if (Player.getPlayer().func_145782_y() !== packet.func_149412_c()) return;
        if (packet.func_149410_e() !== 28000) return;
        cancel(event)
        veloPacket.unregister();
        vclip.unregister();
    }).setFilteredClass(S12PacketEntityVelocity);
}).unregister();

register("packetReceived", (packet) => {
    const x = Math.floor(packet.func_148932_c());
    const y = Math.floor(packet.func_148928_d());
    const z = Math.floor(packet.func_148933_e());

    if (Settings().bossClip && x == 73 && y == 221 && z == 14 && delay == 0) {
        delay = 10;
        Client.scheduleTask(0, () => Player.getPlayer().func_70107_b(Player.getX(), Player.getY() - 40, Player.getZ()))
    };
}).setFilteredClass(S08PacketPlayerPosLook);

register("packetReceived", () => {
    if (delay > 0) delay--;
}).setFilteredClass(S32PacketConfirmTransaction)