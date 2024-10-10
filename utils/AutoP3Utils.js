import RenderLibV2 from "../../RenderLibV2"



const KeyBinding = Java.type("net.minecraft.client.settings.KeyBinding");

const keybinds = [
    Client.getMinecraft().field_71474_y.field_74351_w.func_151463_i(),
    Client.getMinecraft().field_71474_y.field_74370_x.func_151463_i(),
    Client.getMinecraft().field_71474_y.field_74366_z.func_151463_i(),
    Client.getMinecraft().field_71474_y.field_74368_y.func_151463_i()
];

export function stop() {
    Player.getPlayer().func_70016_h(0, Player.getPlayer().field_70181_x, 0);
}

export function noWalk() {
    Client.scheduleTask(() => { KeyBinding.func_74510_a(Client.getMinecraft().field_71474_y.field_74351_w.func_151463_i(), false) })
}

export function walk() {
    KeyBinding.func_74510_a(Client.getMinecraft().field_71474_y.field_74351_w.func_151463_i(), true)
}

export function rotate(yaw, pitch) {
    const player = Player.getPlayer();

    player.field_70177_z = yaw;
    player.field_70125_A = pitch;
}

export function jump() {
    Client.scheduleTask(() => { KeyBinding.func_74510_a(Client.getMinecraft().field_71474_y.field_74314_A.func_151463_i(), true) })
    Client.scheduleTask(2, () => { KeyBinding.func_74510_a(Client.getMinecraft().field_71474_y.field_74314_A.func_151463_i(), false) })
}

export const edgeJump = register("renderOverlay", () => {
    if (World.getBlockAt(Player.getX(), Player.getY() - 0.5, Player.getZ()).type.getID() == 0) {
        jump()
        edgeJump.unregister()
    }
}).unregister()

export function renderRings(x, y, z, w, type) {
    if (type === "walk") { [r, g, b] = [0, 1, 0] }
    else if (type === "walk2") { [r, g, b] = [0, 1, 1] }
    else if (type === "jump") { [r, g, b] = [0, 0, 1] }
    else if (type === "jump2") { [r, g, b] = [1, 0, 1] }
    else if (type === "stop") { [r, g, b] = [1, 0, 0] }
    else if (type === "boom") { [r, g, b] = [0, 1, 1] }
    else if (type === "hclip") { [r, g, b] = [0, 0, 0] }
    else if (type === "hclip2") { [r, g, b] = [0, 0, 0] }
    else if (type === "bonzo") { [r, g, b] = [1, 1, 1] }
    else if (type === "bonzo2") { [r, g, b] = [1, 0, 1] }
    else if (type === "look") { [r, g, b] = [1, 0, 1] }
    else if (type === "aura") { [r, g, b] = [1, 1, 0] }
    else if (type === "vclip") { [r, g, b] = [1, 1, 0] }
    else if (type === "block") { [r, g, b] = [0, 0, 1] }
    else if (type === "block2") { [r, g, b] = [0, 1, 1] }
    else if (type === "edge") { [r, g, b] = [1, 0, 1] }
    RenderLibV2.drawCyl(x, y, z, w / 2, w / 2, -0.01, 120, 1, 90, 0, 0, r, g, b, 1, false, true);
}

export function renderBoxes(x, y, z, h, w, type) {
    if (type === "walk") { [r, g, b] = [0, 1, 0] }
    else if (type === "walk2") { [r, g, b] = [0, 1, 1] }
    else if (type === "jump") { [r, g, b] = [0, 0, 1] }
    else if (type === "jump2") { [r, g, b] = [1, 0, 1] }
    else if (type === "stop") { [r, g, b] = [1, 0, 0] }
    else if (type === "boom") { [r, g, b] = [0, 1, 1] }
    else if (type === "hclip") { [r, g, b] = [0, 0, 0] }
    else if (type === "bonzo") { [r, g, b] = [1, 1, 1] }
    else if (type === "bonzo2") { [r, g, b] = [1, 0, 1] }
    else if (type === "look") { [r, g, b] = [1, 0, 1] }
    else if (type === "aura") { [r, g, b] = [1, 1, 0] }
    else if (type === "vclip") { [r, g, b] = [1, 1, 0] }
    else if (type === "block") { [r, g, b] = [0, 0, 1] }
    else if (type === "block2") { [r, g, b] = [0, 1, 1] }
    else if (type === "edge") { [r, g, b] = [1, 0, 1] }
    RenderLibV2.drawEspBoxV2(x, y, z, w, h, w, r, g, b, 1, false);
}

//stolen from trimone :3
export function getClass() {
    let index = TabList?.getNames()?.findIndex(line => line?.includes(Player.getName()))
    if (index == -1) return
    let match = TabList?.getNames()[index]?.removeFormatting().match(/.+ \((.+) .+\)/)
    if (!match) return "EMPTY"
    return match[1];
}

