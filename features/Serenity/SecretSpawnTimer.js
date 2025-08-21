import Dungeon from "../../../BloomCore/dungeons/Dungeon";
import data from "../../utils/data";
import Settings from "../../config";

import { secretSpawnTimerGui } from "../../config";

const S3EPacketTeams = Java.type("net.minecraft.network.play.server.S3EPacketTeams");
let ticks = null;


register("renderOverlay", () => {
    if (!Settings().secretSpawnTimer) return;
    if (secretSpawnTimerGui.isOpen()) {
        Renderer.scale(data.secretSpawnTimer.scale)
        Renderer.drawStringWithShadow("§a20", Renderer.screen.getWidth() * data.secretSpawnTimer.x, Renderer.screen.getHeight() * data.secretSpawnTimer.y)
        return
    }
    if (!Dungeon.inDungeon) return;
    if (ticks === null) return;
    Renderer.scale(data.secretSpawnTimer.scale)
    Renderer.drawString((ticks < 5 ? "§c" : ticks < 10 ? "§6" : "§a") + ticks, Renderer.screen.getWidth() * data.secretSpawnTimer.x, Renderer.screen.getHeight() * data.secretSpawnTimer.y, true);
});

register("packetReceived", packet => {
    if (!Dungeon.inDungeon) return;
    const channel = packet.func_149307_h();
    if (channel !== 2) return;

    const teamStr = packet.func_149312_c();
    const teamMatch = teamStr.match(/^team_(\d+)$/);
    if (!teamMatch) return;
    if (ticks > 3 || ticks === null) ticks = 20; // Sync ticks

}).setFilteredClass(S3EPacketTeams);

register("worldLoad", () => {
    ticks = null;
})

register("packetReceived", packet => {
    if (packet.func_148890_d() > 0) return;
    if (ticks === 0) ticks = 20;
    if (ticks > 0) ticks--;
}).setFilteredClass(net.minecraft.network.play.server.S32PacketConfirmTransaction);

register("dragged", (_0, _1, x, y, bn) => {
    if (!secretSpawnTimerGui.isOpen()) return;
    if (bn === 2) return;
    data.secretSpawnTimer.x = (x / data.secretSpawnTimer.scale) / Renderer.screen.getWidth();
    data.secretSpawnTimer.y = (y / data.secretSpawnTimer.scale) / Renderer.screen.getHeight();
    data.save();
});

register("scrolled", (_0, _1, dir) => {
    if (!secretSpawnTimerGui.isOpen()) return;
    if (dir == 1) data.secretSpawnTimer.scale += 0.01;
    else data.secretSpawnTimer.scale -= 0.01;
    data.secretSpawnTimer.scale = Math.round(data.secretSpawnTimer.scale * 100) / 100;
    ChatLib.clearChat(69420); // Prevent clogging chat by deleting the previous message
    new Message(`§0[§6Yharim§0] §7Current scale: ${data.secretSpawnTimer.scale}`).setChatLineId(69420).chat();
    data.save();
});