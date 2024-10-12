import { chat } from "../../utils/utils"
import Settings from "../../config"
import { clipForward } from "../../utils/utils"

register("Tick", () => {
    if(!Keyboard.isKeyDown(Settings().barphaseKeybind)) return
    let yaw = (Player.getYaw()) * Math.PI / 180;
    if (Player.getPlayer().field_70123_F && World.getBlockAt(Player.getX(), Player.getY(), Player.getZ()).type.getID() == 101) {
        clipForward(0.0625)
        Client.scheduleTask(() => {
            clipForward(0.5)
        })
        chat("Phasing")
    }
})